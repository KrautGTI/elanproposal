import { HYDRATE } from "next-redux-wrapper";

import { AnyAction, combineReducers, Reducer } from "@reduxjs/toolkit";

import deckReducer from "./features/deck";
import designPortalReducer from "./features/designPortal";
import drawModeReducer from "./features/drawMode";
import helioquoteReducer from "./features/helioquote";
import notificationsReducer from "./features/notifications";
import proposalReducer from "./features/proposal";
import roofImageReducer from "./features/roofImage";
import templateReducer from "./features/template";
import dialogsReducer from "./features/dialogs";
import auroraReducer from "./features/aurora";

const rootReducer = combineReducers({
  deck: deckReducer,
  designPortal: designPortalReducer,
  drawMode: drawModeReducer,
  helioquote: helioquoteReducer,
  roofImage: roofImageReducer,
  proposal: proposalReducer,
  template: templateReducer,
  dialogs: dialogsReducer,
  notifications: notificationsReducer,
  aurora: auroraReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const reducerWithHydrate: Reducer<RootState, AnyAction> = (state, action) => {
  if (action.type === HYDRATE) {
    return { ...state, ...action.payload };
  }

  return rootReducer(state, action);
};

export default reducerWithHydrate;
