import localForage from "localforage";
import { call, fork, put, select, take, takeEvery } from "redux-saga/effects";

import { openDialog } from "../dialogs";
import { fetchProposalTemplate } from "../template";
import { fetchProposalData } from "./proposal.actions";
import proposalSlice from "./proposal.slice";

function* fetchTemplateSaga(reportHash: string) {
  const action = yield call(fetchProposalTemplate, reportHash);
  yield put(action);
}

function* fetchProposalSaga(reportHash: string) {
  const action = yield call(fetchProposalData, reportHash);
  yield put(action);

  // TODO is this a good spot to do this?
  yield take("proposal/fetch/fulfilled");
  const rate = yield select(state => state.proposal.data?.solarCosts.lenderRate);
  if (rate === null) {
    yield put(openDialog("MANAGE_LENDER"));
  }
}

function* restoreLockStatusSaga(store: LocalForage, cacheKey: string) {
  const storedValue = yield store.getItem(cacheKey);

  if (storedValue === false) {
    yield put(proposalSlice.actions.unlock());
  }
}

function* persistLocked(store: LocalForage) {
  const cacheKey = yield select(state => state.proposal.reportHash);
  const isLocked = yield select(state => state.proposal.locked);
  if (!cacheKey) return;
  if (isLocked) {
    yield store.removeItem(cacheKey);
  } else {
    yield store.setItem(cacheKey, false);
  }
}

export function* watchLockStatusSaga(store: LocalForage, reportHash: string) {
  yield call(restoreLockStatusSaga, store, reportHash);

  yield takeEvery(proposalSlice.actions.toggleLock.type, persistLocked, store);
}

const createLocalStore = () =>
  localForage.createInstance({
    name: "proposal-lock",
    driver: localForage.LOCALSTORAGE,
  });

export function* proposalSaga(store = createLocalStore()) {
  const initAction: ReturnType<typeof proposalSlice.actions.init> = yield take(proposalSlice.actions.init.type);
  const reportHash = initAction.payload;

  yield fork(watchLockStatusSaga, store, reportHash);

  yield fork(fetchTemplateSaga, reportHash);
  yield fork(fetchProposalSaga, reportHash);
}
