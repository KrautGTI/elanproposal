import findIndex from "lodash/findIndex";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../rootReducer";
import { Annotation } from "../../types";

import type { RegisteredScreenKey } from "../../screen-registry";
interface PenTypeSettings {
  penWidth: number;
  penColor: string;
}

const defaultPenTypes = {
  marker: {
    penWidth: 4,
    penColor: "rgba(238, 0, 0, 1)",
  } as PenTypeSettings,
  highlighter: {
    penWidth: 14,
    penColor: "rgba(255, 229, 0, 0.5)",
  } as PenTypeSettings,
};

export type PenType = keyof typeof defaultPenTypes;

export type DrawingBoard = {
  active: boolean;
  id: string;
};

export type DrawingBoardState = {
  enabled: boolean;
  annotations: Annotation[];
  activeBoardId?: string;
  boards: Record<RegisteredScreenKey, DrawingBoard>;
  penType: PenType;
  penSettings: PenTypeSettings;
};

let initialState = {
  enabled: false,
  annotations: [],
  boards: {} as DrawingBoardState["boards"],
  penType: "marker",
  penSettings: defaultPenTypes.marker,
} as DrawingBoardState;

const drawModeSlice = createSlice({
  name: "drawMode",
  initialState,
  reducers: {
    enableDrawing(state, action: PayloadAction<string>) {
      const id = action.payload;

      if (!state.boards[id]) {
        state.boards[id] = { id, active: false };
      }

      state.enabled = true;
      state.activeBoardId = id;
    },
    restoreAnnotations(state, action: PayloadAction<Annotation[]>) {
      state.annotations = action.payload;

      for (let { screen } of state.annotations) {
        state.boards[screen] = { id: screen, active: false };
      }
    },
    linkSavedAnnotation(state, action: PayloadAction<Annotation>) {
      const existingIndex = findIndex(state.annotations, x => x.id === action.payload.id);

      if (existingIndex > -1) {
        state.annotations[existingIndex] = action.payload;
      } else {
        state.annotations.push(action.payload);
      }
    },
    removeAnnotation(state, action: PayloadAction<string>) {
      const existingIndex = findIndex(state.annotations, x => x.screen === action.payload);

      if (existingIndex > -1) {
        state.annotations.splice(existingIndex, 1);
      }
    },
    disableDrawing(state) {
      state.enabled = false;
      state.activeBoardId = undefined;
    },
    boardCreated(state, action: PayloadAction<string>) {
      const id = action.payload;

      state.boards[id].active = true;
    },
    changePenType(state, action: PayloadAction<PenType>) {
      state.penType = action.payload;
      state.penSettings = defaultPenTypes[action.payload];
    },
    clear(state) {
      //
    },
    undo(state) {
      //
    },
  },
});

export const toggleDrawingBoard = createAsyncThunk<void, undefined, { state: RootState }>(
  "drawMode/toggle",
  async (arg, thunkAPI) => {
    const state = thunkAPI.getState();
    const enabled = state.drawMode.enabled;

    if (enabled) {
      thunkAPI.dispatch(drawModeSlice.actions.disableDrawing());
    } else {
      const currentSlideId = state.deck.currentSlideId;

      if (currentSlideId) {
        thunkAPI.dispatch(drawModeSlice.actions.enableDrawing(currentSlideId));
      }
    }
  }
);

export const {
  enableDrawing,
  disableDrawing,
  boardCreated,
  changePenType,
  undo: undoDrawing,
  clear: clearDrawing,
} = drawModeSlice.actions;

export default drawModeSlice;
