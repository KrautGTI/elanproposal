import isNumber from "lodash/isNumber";
import { EventChannel } from "redux-saga";
import { call, delay, fork, put, race, select, take, takeEvery, takeLatest } from "redux-saga/effects";

import { ColorMode, LogoPosition } from "../../types";
import { createRevealDeck } from "./create-reveal-deck";
import deckSlice, { changeColorMode, changeLogoPosition, initDeck } from "./deck.slice";
import { createRevealEventChannel } from "./reveal-event-channel";

import type { Reveal, ReadyEvent, SlideChangedEvent } from "reveal.js";
import type { RegisteredScreenKey } from "../../screen-registry";

function getSlideStateFromEvent(event: ReadyEvent | SlideChangedEvent) {
  return {
    prevSlideId: event["previousSlide"]?.dataset.slideId,
    currentSlideId: event.currentSlide?.dataset.slideId as RegisteredScreenKey,
    currentSlideIndex: event.indexh,
    colorMode: event.currentSlide?.dataset.colorMode as ColorMode,
    logoPosition: event.currentSlide?.dataset.logoPosition as LogoPosition,
  };
}

function* watchRevealEvents(reveal: Reveal) {
  const readyEventChannel: EventChannel<ReadyEvent> = yield call(createRevealEventChannel, reveal, "ready");
  const slideChangedEventChannel: EventChannel<SlideChangedEvent> = yield call(
    createRevealEventChannel,
    reveal,
    "slidechanged"
  );
  const slidetransitionendEventChannel: EventChannel<SlideChangedEvent> = yield call(
    createRevealEventChannel,
    reveal,
    "slidetransitionend"
  );

  yield takeEvery(readyEventChannel, function* (event: ReadyEvent) {
    yield put(deckSlice.actions.ready(getSlideStateFromEvent(event)));
  });

  yield takeLatest(slideChangedEventChannel, function* (event: SlideChangedEvent) {
    const slideState = getSlideStateFromEvent(event);
    if (!slideState.prevSlideId) return;

    const { colorMode, logoPosition } = yield select(state => state.deck);

    if (colorMode !== slideState.colorMode) {
      yield put(changeColorMode(slideState.colorMode));
    }

    if (logoPosition !== slideState.logoPosition) {
      yield put(changeLogoPosition(slideState.logoPosition));
    }

    yield race({
      // Wait for the slidetransitionend event before dispatching the slidechanged action
      transitionEnd: take(slidetransitionendEventChannel),
      // If we are jumping too far for a transition event, just cancel after 1800ms and dispatch slidechanged event
      timeout: delay(1800),
    });

    yield put(deckSlice.actions.slidechanged(slideState));
  });
}

export function* deckSaga() {
  // Wait until deck is initialized
  yield take(initDeck.type);

  const options = yield select(state => state.deck.options);
  const reveal: Reveal = yield call(createRevealDeck, options);

  yield fork(watchRevealEvents, reveal);

  yield call(function () {
    reveal.initialize();
    console.log(reveal);
  });

  yield takeEvery(deckSlice.actions.gotoPrev.type, function* () {
    yield call(reveal.left);
  });

  yield takeEvery(deckSlice.actions.gotoNext.type, function* () {
    yield call(reveal.right);
  });

  yield takeLatest(deckSlice.actions.gotoIndex, function* ({ payload: indexh }) {
    if (!isNumber(indexh)) return;

    yield call(reveal.slide, indexh);
  });

  yield takeLatest(deckSlice.actions.syncSlideById, function* ({ payload: slideId }) {
    yield call(function* () {
      const slide = document.querySelector(`section[data-slide-id="${slideId}"]`) as HTMLElement;

      const { colorMode, logoPosition } = yield select(state => state.deck);

      if (colorMode !== slide?.dataset.colorMode) {
        yield put(changeColorMode(slide?.dataset.colorMode as ColorMode));
      }

      if (logoPosition !== slide?.dataset.logoPosition) {
        yield put(changeLogoPosition(slide?.dataset.logoPosition as LogoPosition));
      }

      if (slide) {
        try {
          reveal.syncSlide(slide);
        } catch (e) {
          console.warn(`Error syncing slide "${slideId}"`, e);
        }
      }
    });
  });

  yield takeLatest(deckSlice.actions.changeSlideBackground, function* ({ payload: { id: slideId, color } }) {
    yield call(function () {
      const slide = document.querySelector(`section[data-slide-id="${slideId}"]`) as HTMLDivElement;
      if (!slide) return;

      if (slide.dataset.backgroundColor !== color) {
        slide.dataset.backgroundColor = color;

        try {
          reveal.syncSlide(slide);
        } catch (e) {
          console.warn(`Error syncing slide "${slideId}"`, e);
        }
      }
    });
  });

  yield takeLatest(deckSlice.actions.sync.type, function* () {
    yield call(() => reveal.sync());
  });
}
