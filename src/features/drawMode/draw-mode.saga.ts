import find from "lodash/find";
import { call, fork, put, race, select, spawn, take, takeLatest } from "redux-saga/effects";

import { PayloadAction } from "@reduxjs/toolkit";
import { captureException } from "@sentry/react";

import { deleteAnnotation, fetchAnnotations, postAnnotation } from "../../lib/api/proposal-api";
import { lockScreen, unlockScreen } from "../../lib/utils";
import { Annotation } from "../../types";
import deckSlice from "../deck/deck.slice";
import drawModeSlice from "./draw-mode.slice";
import { DrawingBoard, DrawingBoardManager } from "./drawing-board-manager";

export function* drawModeSaga(manager = new DrawingBoardManager()) {
  if (typeof window === "undefined") return;

  // Wait until deck is ready so we don't interfere with startup time
  yield take(deckSlice.actions.ready.type);

  yield fork(restoreSavedAnnotationsSaga, manager);

  yield takeLatest(drawModeSlice.actions.enableDrawing.type, startDrawSessionSaga, manager);
}

function* restoreSavedAnnotationsSaga(manager: DrawingBoardManager) {
  const reportHash = yield select(state => state.proposal.reportHash);

  try {
    const response = yield call(fetchAnnotations, reportHash);
    const annotations = response.data.annotations;

    if (!annotations.length) return;

    yield put(drawModeSlice.actions.restoreAnnotations(annotations));

    for (let annotation of annotations) {
      const board: DrawingBoard = yield call(lookupOrCreateDrawingBoard, annotation.screen, manager);
      console.log("restored board", annotation.screen, { board });

      board._drawing.svg.parseSVGString(annotation.svg);
      board._drawing.update();
    }
  } catch (e) {
    captureException(e);
  }
}

interface WaitForDrawingEndReason {
  slidechanged: any;
  disableDrawing: any;
}

function* startDrawSessionSaga(manager: DrawingBoardManager, action: PayloadAction<string>) {
  const board: DrawingBoard = yield call(lookupOrCreateDrawingBoard, action.payload, manager);

  console.log("draw session started", { board });

  // Lock the screen
  yield call(() => lockScreen({ bodyClassName: "drawing-enabled" }));

  // Sync the pen settings
  yield call(updatePenSettings, board);

  // Watch for events
  yield spawn(function*() {
    yield takeLatest(drawModeSlice.actions.changePenType.type, updatePenSettings, board);
    yield takeLatest(drawModeSlice.actions.undo.type, () => board.undo());
    yield takeLatest(drawModeSlice.actions.clear.type, () => board.clear());
  });

  // Wait until drawing ends
  const endReason: WaitForDrawingEndReason = yield race({
    slidechanged: take(deckSlice.actions.slidechanged.type),
    disableDrawing: take(drawModeSlice.actions.disableDrawing.type),
  });

  // Make sure we dispatch disableDrawing in the case of it ending non-explicitely
  if (!endReason.disableDrawing) {
    console.log("Drawing disabled.");
    yield put(drawModeSlice.actions.disableDrawing());
  } else {
    console.log("Drawing ended because slide changed.");
  }

  // Unlock screen
  yield call(() => unlockScreen({ bodyClassName: "drawing-enabled" }));

  yield fork(saveAnnotationSaga, board);
}

function* updatePenSettings(board: DrawingBoard) {
  const penSettings = yield select(state => state.drawMode.penSettings);

  yield call(() => {
    board.changePenWidth(penSettings.penWidth);
    board.changePenColor(penSettings.penColor);
  });
}

function* lookupOrCreateDrawingBoard(id: string, manager: DrawingBoardManager) {
  let board: DrawingBoard = yield call(() => manager.get(id));
  if (board) return board;

  // Wait until react creates the board and shoots off an event
  const createdAction: PayloadAction<string> = yield take(drawModeSlice.actions.boardCreated.type);
  const penSettings = yield select(state => state.drawMode.penSettings);

  return yield call(() => manager.add(createdAction.payload, { ...penSettings }));
}

function* saveAnnotationSaga(board: DrawingBoard) {
  const existingAnnotation: Annotation | undefined = yield select(state =>
    find(state.drawMode.annotations, { screen: board.id })
  );

  // Clean the SVG object before checking if it's empty
  board.clean();

  if (board.isEmpty()) {
    // Only call to remove the annotation if it was saved previously
    if (existingAnnotation) {
      yield call(removeAnnotationSaga, { screenId: board.id });
    }

    return;
  }

  const svgXml = board.getSvgXML();
  if (existingAnnotation?.svg === svgXml) return;

  const reportHash = yield select(state => state.proposal.reportHash);

  try {
    const response = yield call(postAnnotation, reportHash, { screen: board.id, svg: svgXml });

    yield put(drawModeSlice.actions.linkSavedAnnotation(response.data.annotation));
  } catch (e) {
    captureException(e);
  }
}

function* removeAnnotationSaga({ screenId }: { screenId: string }) {
  const { drawMode, proposal } = yield select(state => ({ drawMode: state.drawMode, proposal: state.proposal }));

  const existingSaved = find(drawMode.annotations, annotation => annotation.screen === screenId);
  if (!existingSaved) return null;

  const response = yield call(deleteAnnotation, proposal.reportHash, existingSaved.id);

  yield put(drawModeSlice.actions.removeAnnotation(screenId));

  return response.data.annotation;
}
