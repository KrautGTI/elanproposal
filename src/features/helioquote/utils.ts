import includes from "lodash/includes";
import { DISABLE_SURFACES, MOVE_PANELS, REMOVE_PANELS, RESET_PANEL_LAYOUT } from "./constants";
import { AnyHelioquoteEventData } from "./types";

export const isMutationEventData = (data: AnyHelioquoteEventData): data is AnyHelioquoteEventData =>
  includes([DISABLE_SURFACES, REMOVE_PANELS, RESET_PANEL_LAYOUT, MOVE_PANELS], data?.type);
