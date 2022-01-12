import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAuroraDesigns, syncAuroraDesign } from "./aurora.actions";
import { AuroraDesign, AuroraSaveDesignStatus, AuroraViewOptionKey, AuroraViewOptions } from "./aurora.types";

export interface AuroraState {
  jwt?: string;
  loadingDesignToSdk: boolean;
  viewOptions: AuroraViewOptions;
  saveStatus: AuroraSaveDesignStatus;
  sdkHasChanges: boolean;
  watchingIrradiance: boolean;
  designs?: AuroraDesign[];
  loadingDesigns: boolean;
  changingDesign: boolean;
  syncErrors?: string;
}

const initialViewOptions = {
  azimuthArrows: false,
  buildings: false,
  connections: false,
  designComponents: false,
  edges: false,
  electricalComponents: false,
  ground: false,
  irradianceMap: false,
  irradianceMapPanels: false,
  lidar: false,
  mapImagery: false,
  measurements: false,
  projectCenter: false,
  rulers: false,
  setbacks: false,
  shadows: false,
  sky: false,
  solarPanels: false,
  strings: false,
  sunpath: false,
  trees: false,
};

const initialState: AuroraState = {
  jwt: undefined,
  loadingDesignToSdk: true,
  viewOptions: initialViewOptions,
  saveStatus: AuroraSaveDesignStatus.IDLE,
  sdkHasChanges: false,
  watchingIrradiance: false,
  designs: undefined,
  loadingDesigns: false,
  changingDesign: false,
  syncErrors: undefined,
};

export interface ChangeAuroraViewOptionPayload {
  key: AuroraViewOptionKey;
  value: boolean;
}

const auroraSlice = createSlice({
  name: "aurora",
  initialState,
  reducers: {
    jwtLoaded(state, action: PayloadAction<string>) {
      state.jwt = action.payload;
    },
    sdkDesignLoadedSuccess(state) {
      state.loadingDesignToSdk = false;
      state.changingDesign = false;
      state.loadingDesigns = false;
    },
    setViewOptions(state, action: PayloadAction<AuroraViewOptions>) {
      state.viewOptions = action.payload;
    },
    setDesignSaveStatus(state, action: PayloadAction<AuroraSaveDesignStatus>) {
      state.saveStatus = action.payload;
    },
    saveDesign(state) {},
    saveDesignComplete(state) {
      state.saveStatus = AuroraSaveDesignStatus.IDLE;
    },
    changeViewOption(state, action: PayloadAction<ChangeAuroraViewOptionPayload>) {},
    toggleViewOption(state, action: PayloadAction<AuroraViewOptionKey>) {},
    toggleSunAnimation(state) {},
    fullScreen(state) {},
    downloadScreenshot(state) {},
    sdkOpened(state) {},
    toHomeView(state) {},
    clearErrors(state) {
      state.syncErrors = undefined;
    },
    changeDesign(state, action: PayloadAction<string>) {
      state.loadingDesigns = true;
      state.loadingDesignToSdk = true;
      state.changingDesign = true;
    },
    watchingIrradiance(state) {
      state.watchingIrradiance = true;
    },
    detectChanges(state) {
      state.sdkHasChanges = true;
    },
    cleanChanges(state) {
      state.sdkHasChanges = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAuroraDesigns.pending, state => {
        state.loadingDesigns = true;
      })
      .addCase(fetchAuroraDesigns.rejected, state => {
        state.loadingDesigns = false;
      })
      .addCase(fetchAuroraDesigns.fulfilled, (state, action) => {
        state.designs = action.payload;
        state.loadingDesigns = false;
      });

    builder
      .addCase(syncAuroraDesign.pending, (state, action) => {
        state.saveStatus = AuroraSaveDesignStatus.SYNCING_ENERFLO;
        state.syncErrors = undefined;
      })
      .addCase(syncAuroraDesign.fulfilled, (state, action) => {
        state.saveStatus = AuroraSaveDesignStatus.FINISHED;
      })
      .addCase(syncAuroraDesign.rejected, (state, action: any) => {
        // TODO do these errors automatically go to sentry?

        state.loadingDesignToSdk = false;
        state.changingDesign = false;
        state.loadingDesigns = false;
        state.saveStatus = AuroraSaveDesignStatus.IDLE;
        const errorMessage = action.payload?.errors?.message;
        state.syncErrors = errorMessage || action.error.message;
      });
  },
});

export const {
  jwtLoaded,
  sdkDesignLoadedSuccess,
  setViewOptions,
  changeViewOption,
  toggleViewOption,
  toggleSunAnimation,
  fullScreen,
  downloadScreenshot,
  toHomeView,
  saveDesign,
  setDesignSaveStatus,
  changeDesign,
} = auroraSlice.actions;

export default auroraSlice;
