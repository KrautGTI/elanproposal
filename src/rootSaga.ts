import { END } from "redux-saga";
import { fork, put } from "redux-saga/effects";

import { deckSaga } from "./features/deck";
import { designPortalSaga } from "./features/designPortal";
import { drawModeSaga } from "./features/drawMode";
import { helioquoteSaga } from "./features/helioquote";
import { auroraSaga } from "./features/aurora";
import { roofImageSaga } from "./features/roofImage";
import { proposalSaga } from "./features/proposal";
import { notificationsSaga } from "./features/notifications";
import { dialogsSaga } from "./features/dialogs";

function* rootSaga() {
  if (typeof window === "undefined") {
    yield put(END);
    return;
  }

  yield fork(deckSaga);
  yield fork(proposalSaga);
  yield fork(designPortalSaga);
  yield fork(helioquoteSaga);
  yield fork(auroraSaga);
  yield fork(dialogsSaga);
  yield fork(roofImageSaga);
  yield fork(drawModeSaga);
  yield fork(notificationsSaga);
}

export default rootSaga;
