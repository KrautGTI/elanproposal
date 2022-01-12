import { AxiosError } from "axios";
import { addMilliseconds, getUnixTime } from "date-fns";
import { call, delay, put, select, takeLatest } from "redux-saga/effects";

import { makeGetRequest, makeUnauthenticatedGetRequest } from "../../lib/api";
import { syncAuroraDesign } from "../aurora/aurora.actions";
import roofImageSlice, { initRoofImage } from "./roof-image.slice";

async function loadImageIntoMemory(url: string) {
  try {
    const fetchFn = url.startsWith("https:") ? makeUnauthenticatedGetRequest : makeGetRequest;

    const response = await fetchFn(url, {
      responseType: "blob", // important
      params: {
        ts: Date.now(),
      },
    });

    return window.URL.createObjectURL(
      new Blob([response.data], {
        type: response.headers["content-type"] ?? "image/png",
      })
    );
  } catch (e) {
    const err = e as AxiosError<Blob>;

    const data = JSON.parse((await err.response?.data.text()) ?? "");

    throw new Error(data.message || "Loading image failed");
  }
}

function removeImageFromMemory(url: string) {
  console.log("revoke", url);
  window.URL.revokeObjectURL(url);
}

function* tryToDownloadImage(attempts: number, retryDelay: number, requestFn: any, data: any) {
  for (let i = 0; i < attempts; i++) {
    try {
      const apiResponse = yield call(requestFn, data);
      return apiResponse;
    } catch (err: any) {
      yield put(roofImageSlice.actions.downloadImageError({ message: err.message, attempt: i + 1 }));

      if (i < attempts - 1) {
        const retryAt = getUnixTime(addMilliseconds(new Date(), retryDelay));

        yield put(
          roofImageSlice.actions.downloadImageRetry({
            retryAt,
            attempt: i + 1,
            attemptsRemaining: attempts - i - 1,
          })
        );

        yield delay(retryDelay);
      } else {
        throw err;
      }
    }
  }
}

function* downloadImage(remoteUrl: string) {
  const prevUrl = yield select(state => state.roofImage.url);
  if (prevUrl) {
    // purge the previous image from memory
    yield call(removeImageFromMemory, prevUrl);
  }

  yield put(roofImageSlice.actions.downloadImageRequest(remoteUrl));

  try {
    const objectUrl = yield call(tryToDownloadImage, 3, 60_000, loadImageIntoMemory, remoteUrl);

    yield put(roofImageSlice.actions.downloadImageSuccess(objectUrl));
  } catch (e: any) {
    yield put(roofImageSlice.actions.downloadImageFailed(e.message));
  }
}

function* initSaga(action: ReturnType<typeof initRoofImage>) {
  const hasUrl = yield select(state => !!state.roofImage.url);
  if (hasUrl) return;

  yield delay(1_000);

  yield call(downloadImage, action.payload);
}

function* refetchSaga(action: ReturnType<typeof initRoofImage>) {
  yield delay(1_000);

  yield call(downloadImage, action.payload);
}

function* refetchImageFromProposalStateSaga() {
  const url = yield select(state => state.proposal.data?.design.roofImageUrl);
  yield put(roofImageSlice.actions.refetch(url));
}

type Dependencies = {};

export function* roofImageSaga(deps: Dependencies = {}) {
  if (typeof window !== "undefined") {
    yield takeLatest(roofImageSlice.actions.init, initSaga);
    yield takeLatest(roofImageSlice.actions.refetch, refetchSaga);
    yield takeLatest(syncAuroraDesign.fulfilled.type, refetchImageFromProposalStateSaga);
  }
}
