import { EventChannel } from "redux-saga";
import { call, delay, fork, put, race, select, take, takeLatest } from "redux-saga/effects";

import {
  createMessageDispatcher,
  createMessageToActionHandler,
} from "../../lib/redux-postmessage-middleware/messaging";
import { getRoofImageUrl } from "../../lib/selectors";
import { lockWidget, unlockWidget } from "../designPortal";
import { refreshDesignData, submitOptimization } from "../proposal";
import { refetchRoofImage } from "../roofImage";
import { GENERATE_IMAGE, INITIALIZED } from "./constants";
import helioquoteSlice from "./helioquote.slice";
import { createIframeMessageChannel } from "./iframe-event-channel";
import { AnyHelioquoteEventData } from "./types";
import { isMutationEventData } from "./utils";

function* handleIframeMessagePayload(payload: AnyHelioquoteEventData) {
  if (payload.type === INITIALIZED) {
    if (payload.status === "pending") {
      yield put(helioquoteSlice.actions.initPending());
    } else if (payload.status === "success") {
      yield put(helioquoteSlice.actions.initSuccess());
    } else if (payload.status === "failed") {
      yield put(helioquoteSlice.actions.initFailed("Something went wrong"));
    }
  } else if (payload.type === GENERATE_IMAGE) {
    if (payload.status === "pending") {
      yield put(helioquoteSlice.actions.generateImagePending());
    } else if (payload.status === "success") {
      yield put(helioquoteSlice.actions.generateImageComplete());
    } else if (payload.status === "failed") {
      yield put(helioquoteSlice.actions.generateImageFailed());
    }
  } else if (isMutationEventData(payload)) {
    if (payload.status === "pending") {
      yield put(helioquoteSlice.actions.remoteMutationPending());
    } else if (payload.status === "success") {
      yield put(helioquoteSlice.actions.remoteMutationComplete());
    } else if (payload.status === "failed") {
      yield put(helioquoteSlice.actions.remoteMutationFailed());
    }
  }
}

function* watchIframeMessages(iframeChannel: EventChannel<AnyHelioquoteEventData>) {
  while (true) {
    try {
      // Subscribe to event payloads from helioquote iframe
      const payload: AnyHelioquoteEventData = yield take(iframeChannel);
      yield call(handleIframeMessagePayload, payload);
    } catch (err) {
      console.error("iframe error:", err);
      // iframeChannel is still open in catch block
      // if we want end the iframeChannel, we need close it explicitly
      // iframeChannel.close()
    }
  }
}

function* refetchImageAfterGenerated() {
  const { completed } = yield race({
    completed: take(helioquoteSlice.actions.generateImageComplete.type),
    failed: take(helioquoteSlice.actions.generateImageFailed.type),
  });

  if (completed) {
    const imageUrl = yield select(getRoofImageUrl);
    if (imageUrl) {
      yield put(refetchRoofImage(imageUrl));
    }
  }
}

function* watchPendingInitializeSaga() {
  const existingLockMessage = yield select(state => state.designPortal.lockMessage);
  yield put(lockWidget(existingLockMessage));

  const { timeout: timedOut } = yield race({
    finished: take([helioquoteSlice.actions.initSuccess.type, helioquoteSlice.actions.initFailed.type]),
    // Sometimes helioquote doesn't reach the finished event, so we use a timeout to stop loading on our end
    timeout: delay(10500), // 10.5 seconds
  });

  if (timedOut) {
    yield put(helioquoteSlice.actions.initFailed("Timed out"));
  }
}

function* watchLockActionSaga() {
  // Sleep until init succeeds or fails
  yield take([helioquoteSlice.actions.initSuccess.type, helioquoteSlice.actions.initFailed.type]);
  // Then unlock the widget
  yield put(unlockWidget());
}

type Dependencies = {
  allowedURLs?: string[];
};

const defaultAllowedUrls = [
  "https://helioquote.completesolar.biz",
  "https://helioquote.completesolar.com",
  "https://enerflo.io",
  "https://staging.enerflo.io",
  "https://dev.enerflo.io",
  "http://localhost:3006",
];

export function* helioquoteSaga({ allowedURLs = defaultAllowedUrls }: Dependencies = {}) {
  if (typeof window === "undefined") return;

  // Create the iframe message handler (them to us)
  const messageToActionHandler = createMessageToActionHandler({ allowedURLs });

  const iframeChannel = yield call(createIframeMessageChannel, messageToActionHandler);

  // Create the iframe message dispatcher (us to them)
  const messageDispatcher = createMessageDispatcher({
    document,
    senderURL: "*",
    // id of the iframe element to send a message to
    targetSelector: "#helioquote-integration",
  });

  // Initialize the window message listener
  yield fork(watchIframeMessages, iframeChannel);

  yield takeLatest(lockWidget.type, watchLockActionSaga);
  yield takeLatest(helioquoteSlice.actions.initPending.type, watchPendingInitializeSaga);
  yield takeLatest(helioquoteSlice.actions.generateImagePending.type, refetchImageAfterGenerated);

  // Generate the roof image if it failed after the iframe is initialized
  yield takeLatest(helioquoteSlice.actions.initSuccess.type, function* () {
    const roofImageHasError: boolean = yield select(state => !!state.roofImage?.hasError);

    if (roofImageHasError) {
      yield delay(500);
      // Send helioquote::generate-image message to iframe
      yield call(messageDispatcher, GENERATE_IMAGE);
    }
  });

  // Re-generate the roof image after a successful design change
  yield takeLatest([refreshDesignData.fulfilled.type, submitOptimization.fulfilled.type], function* () {
    yield take(helioquoteSlice.actions.initSuccess);
    yield delay(500);
    // Send helioquote::generate-image message to iframe
    yield call(messageDispatcher, GENERATE_IMAGE);
  });
}
