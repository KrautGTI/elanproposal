import { call, delay, put, select, take, takeLatest } from "redux-saga/effects";
import { getShowArrayDataPopup } from "../../lib/selectors";
import { syncAuroraDesign } from "../aurora/aurora.actions";
import auroraSlice from "../aurora/aurora.slice";

import { refreshDesignData, submitOptimization } from "../proposal";
import { lockDesign, lockWidget, unlockDesign, expandArrayDataTable, closeArrayDataTable } from "./design-portal.slice";

function* maybeCloseArrayData() {
  const arrayTableExpanded = yield select(state => state.designPortal.arrayDataTableExpanded);
  if (arrayTableExpanded) {
    yield put(closeArrayDataTable());
  }
}

function* maybeExpandArrayData() {
  const showArrayDataPopup = yield select(getShowArrayDataPopup);
  if (showArrayDataPopup) {
    yield put(expandArrayDataTable());
  }
}

function* lockInProgressDesign(lockMessage: string, completeActions: string[]) {
  yield call(maybeCloseArrayData);

  yield put(lockDesign());
  yield put(lockWidget(lockMessage));

  // Wait until the optimization succeeds or fails
  yield take(completeActions);

  yield delay(1_500);
  yield put(unlockDesign());

  yield call(maybeExpandArrayData);
}

type Dependencies = {};

export function* designPortalSaga(deps: Dependencies = {}) {
  yield takeLatest(submitOptimization.pending.type, lockInProgressDesign, "Optimizing", [
    submitOptimization.fulfilled.type,
    submitOptimization.rejected.type,
  ]);
  yield takeLatest(refreshDesignData.pending.type, lockInProgressDesign, "Syncing", [
    refreshDesignData.fulfilled.type,
    refreshDesignData.rejected.type,
  ]);
  yield takeLatest(syncAuroraDesign.pending.type, lockInProgressDesign, "Syncing Aurora", [
    syncAuroraDesign.fulfilled.type,
    syncAuroraDesign.rejected.type,
  ]);

  yield takeLatest(auroraSlice.actions.saveDesign, lockInProgressDesign, "Saving Aurora Design", [
    auroraSlice.actions.saveDesignComplete.type,
  ]);
}
