import notificationsSlice from "./notifications.slice";

export * from "./notifications.saga";
export type { AppNotification } from "./types";

export default notificationsSlice.reducer;
