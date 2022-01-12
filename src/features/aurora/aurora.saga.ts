import { createAuroraJwt, fetchAuroraDesigns, syncAuroraDesign } from "./aurora.actions";
import { getIsAuroraDesign, getUseAuroraSdk } from "./../../lib/selectors";
import { all, call, delay, put, putResolve, select, take, takeLatest } from "redux-saga/effects";
import { changeDesign, toggleViewOption } from ".";
import dialogsSlice from "../dialogs/dialogs.slice";
import auroraSlice, {
  setViewOptions,
  changeViewOption,
  ChangeAuroraViewOptionPayload,
  setDesignSaveStatus,
} from "./aurora.slice";
import { AuroraSaveDesignStatus, AuroraViewOptions } from "./aurora.types";

async function changeSdkDesign(designId) {
  const auroraSdk = getSdk();
  window.auroraDesignId = designId;
  window.auroraDesign = await auroraSdk.design.load(designId);
  await window.auroraDesign.runIrradiance();
  await window.auroraDesign.runPerformanceSimulation();
}

function* saveDesignSaga() {
  yield put(auroraSlice.actions.clearErrors());
  yield put(setDesignSaveStatus(AuroraSaveDesignStatus.RUNNING_IRRADIANCE));
  yield downloadScreenshotSaga();
  yield getAuroraDesign().runIrradiance();

  yield put(setDesignSaveStatus(AuroraSaveDesignStatus.RUNNING_PERFORMANCE));
  yield getAuroraDesign().runPerformanceSimulation();

  // TODO Hack for now because of a race condition with Aurora SDK.
  // We can try creating a polling method in Enerflo, but this could be an inherent limitation with the SDK.
  yield delay(20_000);

  const syncAction = yield call(syncAuroraDesign, null);
  const result = yield putResolve(syncAction);

  if (result.type === syncAuroraDesign.fulfilled.type) {
    yield delay(800);
    yield put(dialogsSlice.actions.close("SAVE_AURORA_DESIGN"));
    yield put(auroraSlice.actions.saveDesignComplete());
  }
}

function* changeDesignSaga(action: ReturnType<typeof changeDesign>) {
  yield put(auroraSlice.actions.clearErrors());
  const designId = action.payload;
  const changeAction = yield call(syncAuroraDesign, designId);
  const result = yield putResolve(changeAction);

  if (result.type === syncAuroraDesign.fulfilled.type) {
    yield put(auroraSlice.actions.setDesignSaveStatus(AuroraSaveDesignStatus.IDLE));

    const getDesigns = yield call(fetchAuroraDesigns);
    yield putResolve(getDesigns);

    const useSdk = yield select(state => getUseAuroraSdk(state));
    if (useSdk) {
      yield changeSdkDesign(designId);
    }
    yield put(auroraSlice.actions.sdkDesignLoadedSuccess());
    yield put(dialogsSlice.actions.close("SELECT_AURORA_DESIGN"));
  }
}

function* initSaga() {
  const getDesigns = yield call(fetchAuroraDesigns);
  yield put(getDesigns);

  const createJwt = yield call(createAuroraJwt);
  const jwtResult = yield putResolve(createJwt);

  yield put(auroraSlice.actions.jwtLoaded(jwtResult.payload));
  putJwtToSdk(jwtResult.payload);

  // Wait to see if the user opens the Design Tool to see if they need the SDK
  yield take(auroraSlice.actions.sdkOpened.type);
  yield pollSdkLoaded();
  yield put(auroraSlice.actions.sdkDesignLoadedSuccess());
}

function* pollSdkLoaded() {
  if (!!window.auroraDesign) {
    return;
  }
  yield delay(200);
  yield pollSdkLoaded();
}

export function* auroraSaga() {
  yield all([take("proposal/fetch/fulfilled"), take("template/fetch/fulfilled")]);

  const useSdk = yield select(state => getUseAuroraSdk(state));
  const isAuroraDesign = yield select(state => getIsAuroraDesign(state));
  if (useSdk) {
    // Basic SKD Interactions
    yield takeLatest(auroraSlice.actions.changeViewOption, setViewOptionSaga);
    yield takeLatest(auroraSlice.actions.toggleViewOption, toggleViewOptionSaga);
    yield takeLatest(auroraSlice.actions.toggleSunAnimation, toggleSunAnimationSaga);
    yield takeLatest(auroraSlice.actions.downloadScreenshot, downloadScreenshotSaga);
    yield takeLatest(auroraSlice.actions.fullScreen, fullScreenSaga);
    yield takeLatest(auroraSlice.actions.toHomeView, toHomeViewSaga);
    yield takeLatest(auroraSlice.actions.sdkDesignLoadedSuccess, setViewOptionsFromSdkSaga);

    // Long Running Sagas
    yield takeLatest(auroraSlice.actions.saveDesign, saveDesignSaga);
    yield takeLatest(auroraSlice.actions.changeDesign, changeDesignSaga);

    yield initSaga();
  } else if (isAuroraDesign) {
    // init smaller set of functionality for non-SDK users
    yield takeLatest(auroraSlice.actions.changeDesign, changeDesignSaga);

    const getDesigns = yield call(fetchAuroraDesigns);
    yield put(getDesigns);
  }
}

// Basic SDK Interactions

function* fullScreenSaga() {
  yield getSdk().cad.toggleFullScreen();
}

function* downloadScreenshotSaga() {
  const auroraDesign = getAuroraDesign();
  yield auroraDesign.downloadScreenshot();
}

function* toHomeViewSaga() {
  yield getSdk().camera.returnToHomeView();
}

function* setViewOptionsFromSdkSaga() {
  const toggles = (yield getViewOptions()) as AuroraViewOptions;
  yield put(setViewOptions(toggles));
}

function* updateSdkViewOptionsSaga(options: AuroraViewOptions) {
  yield getAuroraDesign().toggleView(options);
  yield put(auroraSlice.actions.setViewOptions(options));
}

function* setSdkViewOptionSaga(payload: ChangeAuroraViewOptionPayload) {
  const options = (yield getViewOptions()) as AuroraViewOptions;
  const nextOptions = { ...options, [payload.key]: payload.value };
  yield updateSdkViewOptionsSaga(nextOptions);
}

function* setViewOptionSaga(action: ReturnType<typeof changeViewOption>) {
  yield call(setSdkViewOptionSaga, action.payload);
}

function* toggleViewOptionSaga(action: ReturnType<typeof toggleViewOption>) {
  const options = (yield getViewOptions()) as AuroraViewOptions;
  yield call(setSdkViewOptionSaga, { key: action.payload, value: !options[action.payload] });
}

function* toggleSunAnimationSaga() {
  const auroraDesign = getAuroraDesign();
  const sunpath = ((yield getViewOptions()) as AuroraViewOptions).sunpath;
  if (sunpath) {
    yield auroraDesign.stopSunAnimation();
    toHomeView();
    yield call(setSdkViewOptionSaga, { value: false, key: "sunpath" });
  } else {
    yield auroraDesign.startSunAnimation();
    yield call(setSdkViewOptionSaga, { value: true, key: "sunpath" });
  }
}

// SDK Utilities
function getAuroraDesign() {
  return window.auroraDesign;
}

async function getViewOptions() {
  const auroraDesign = getAuroraDesign();
  return await auroraDesign.getViewToggle();
}

function toHomeView() {
  getSdk().camera.returnToHomeView();
}

function getSdk() {
  return window.auroraSdk;
}

function putJwtToSdk(jwt: string) {
  window.auroraJwt = jwt;
}
