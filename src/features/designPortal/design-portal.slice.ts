import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DesignPortalSettings = {};

type DesignPortalState = {
  open: boolean;
  isLocked: boolean;
  isWidgetLocked: boolean;
  lockMessage?: string;
  frameExpanded?: boolean;
  arrayDataTableExpanded: boolean;
} & DesignPortalSettings;

let initialState: DesignPortalState = {
  open: false,
  isLocked: false,
  isWidgetLocked: true,
  arrayDataTableExpanded: false,
};

const designPortalSlice = createSlice({
  name: "designPortal",
  initialState,
  reducers: {
    open(state) {
      state.open = true;
    },
    close(state) {
      state.open = false;
    },
    lockDesign(state) {
      state.isLocked = true;
    },
    lockWidget(state, action: PayloadAction<string | undefined>) {
      state.isWidgetLocked = true;
      state.lockMessage = action.payload;
    },
    unlockDesign(state) {
      state.isLocked = false;
    },
    unlockWidget(state) {
      state.isWidgetLocked = false;
      state.lockMessage = undefined;
    },
    toggleFrameExpand(state) {
      state.frameExpanded = !state.frameExpanded;
    },
    expandArrayDataTable(state) {
      state.arrayDataTableExpanded = true;
    },
    closeArrayDataTable(state) {
      state.arrayDataTableExpanded = false;
    },
    toggleArrayDataTable(state) {
      state.arrayDataTableExpanded = !state.arrayDataTableExpanded;
    },
  },
});

export const {
  open: openDesignPortal,
  close: closeDesignPortal,
  lockDesign,
  lockWidget,
  unlockDesign,
  unlockWidget,
  toggleFrameExpand,
  toggleArrayDataTable,
  closeArrayDataTable,
  expandArrayDataTable,
} = designPortalSlice.actions;

export default designPortalSlice;
