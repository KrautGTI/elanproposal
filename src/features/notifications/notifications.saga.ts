import { delay, fork, put, select, takeEvery } from "redux-saga/effects";

import { dismissNotification, sendNotification } from "./notifications.slice";

export function* notificationsSaga() {
  // Fork options
  yield takeEvery(sendNotification, function* ({ payload }) {
    if (payload.dismissAfter) {
      yield fork(dismissAfterSaga, payload.id, payload.dismissAfter);
    }
  });
}

function* dismissAfterSaga(id: string, timeout: number) {
  yield delay(timeout);

  const stillOpen = yield select(state => state.notifications.queue.some(x => x.id === id));
  if (stillOpen) {
    yield put(dismissNotification(id));
  }
}
