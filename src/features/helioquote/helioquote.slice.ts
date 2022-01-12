import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentFrame {
  hasError?: boolean;
  errorMessage?: string;
}

interface CurrentQuoteStatus {
  generatingImage?: boolean;
  mutationPending?: boolean;
  hasUnsavedChanges?: boolean;
}

type IFrameState = {
  initialized: boolean;
} & CurrentFrame &
  CurrentQuoteStatus;

let initialState: IFrameState = {
  initialized: false,
};

const helioquoteSlice = createSlice({
  name: "helioquote",
  initialState,
  reducers: {
    initPending(state) {
      state.hasUnsavedChanges = false;
      state.initialized = false;
    },
    initSuccess(state) {
      state.initialized = true;
    },
    initFailed(state, action: PayloadAction<string>) {
      state.hasError = true;
      state.errorMessage = action.payload;
    },
    generateImagePending(state) {
      state.generatingImage = true;
    },
    generateImageComplete(state) {
      state.generatingImage = false;
    },
    generateImageFailed(state) {
      state.generatingImage = false;
    },
    remoteMutationPending(state) {
      state.mutationPending = true;
    },
    remoteMutationComplete(state) {
      state.mutationPending = false;
      state.hasUnsavedChanges = true;
    },
    remoteMutationFailed(state) {
      state.mutationPending = false;
    },
  },
});

export const { initPending, initSuccess, initFailed } = helioquoteSlice.actions;

export default helioquoteSlice;
