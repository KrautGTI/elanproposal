import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ImageStatus {
  error?: string;
  hasError?: boolean;
}

type RoofImageState = {
  remoteUrl?: string;
  url?: string;
  loading?: boolean;
  retryAt?: number;
} & ImageStatus;

let initialState: RoofImageState = {};

const roofImageSlice = createSlice({
  name: "roofImage",
  initialState,
  reducers: {
    init(state, action: PayloadAction<string>) {
      if (state.remoteUrl !== action.payload) {
        state.remoteUrl = action.payload;
        state.loading = !!action.payload;
      }
    },
    refetch(state, action: PayloadAction<string>) {
      delete state.retryAt;
      state.remoteUrl = action.payload;
      state.loading = !!action.payload;
    },
    downloadImageRequest(state, action: PayloadAction<string>) {
      delete state.retryAt;
      state.loading = true;
    },
    downloadImageSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.hasError = false;
      state.url = action.payload;
    },
    downloadImageRetry(state, action: PayloadAction<{ retryAt: number; attempt: number; attemptsRemaining: number }>) {
      state.retryAt = action.payload.retryAt;
    },
    downloadImageFailed(state, action: PayloadAction<string>) {
      delete state.retryAt;
      state.loading = false;
      state.hasError = true;
      state.error = action.payload;
    },
    downloadImageError(state, action: PayloadAction<{ message: string; attempt: number }>) {
      state.hasError = true;
      state.error = action.payload.message;
    },
  },
});

export const { init: initRoofImage, refetch: refetchRoofImage, downloadImageRetry } = roofImageSlice.actions;

export default roofImageSlice;
