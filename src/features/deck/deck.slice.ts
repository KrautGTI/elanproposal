import { RevealOptions } from "reveal.js";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ColorMode, DeckFeatureFlags, LogoPosition } from "../../types";

import type { RegisteredScreenKey } from "../../screen-registry";

interface SlideState {
  prevSlideId?: string;
  currentSlideId?: RegisteredScreenKey;
  currentSlideIndex: number;
  colorMode?: ColorMode;
  logoPosition?: LogoPosition;
}

type DeckState = {
  ready: boolean;
  options: RevealOptions;
  features: DeckFeatureFlags;
} & SlideState;

const initialState: DeckState = {
  ready: false,
  currentSlideIndex: 0,
  options: {},
  features: {
    printMode: false,
  },
};

const defaultOptions: RevealOptions = {
  width: 1366,
  height: 1024,
  embedded: true,
  transition: "slide",
  margin: 0.07,
  hash: true,
  progress: true,
  touch: true,
  controls: false,
  slideNumber: false,
  // keyboardCondition: "focused",
};

const deckSlice = createSlice({
  name: "deck",
  initialState,
  reducers: {
    init(state, action: PayloadAction<DeckFeatureFlags>) {
      state.features = action.payload;
      state.options = defaultOptions;
    },
    sync(state) {
      //
    },

    // events
    ready(state, action: PayloadAction<SlideState>) {
      Object.assign(state, action.payload);
      state.ready = true;
    },
    slidechanged(state, action: PayloadAction<SlideState>) {
      Object.assign(state, action.payload);
    },

    // actions
    gotoNext(state) {
      //
    },
    gotoPrev(state) {
      //
    },
    gotoIndex(state, action: PayloadAction<number>) {
      //
    },
    syncSlideById(state, action: PayloadAction<string>) {
      //
    },
    changeColorMode(state, action: PayloadAction<ColorMode | undefined>) {
      state.colorMode = action.payload
    },
    changeLogoPosition(state, action: PayloadAction<LogoPosition | undefined>) {
      state.logoPosition = action.payload
    },
    changeSlideBackground(state, action: PayloadAction<{ id: RegisteredScreenKey; color: string }>) {
      //
    },
  },
});

export const {
  init: initDeck,
  sync: syncDeck,
  gotoNext,
  gotoPrev,
  gotoIndex,
  syncSlideById,
  changeColorMode,
  changeLogoPosition,
  changeSlideBackground,
} = deckSlice.actions;

export default deckSlice;
