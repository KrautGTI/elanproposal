import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AppNotification } from "./types";

type NotificationsState = {
  queue: AppNotification[];
};

let initialState: NotificationsState = {
  queue: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    sendNotification(state, action: PayloadAction<AppNotification>) {
      const notif = {
        ...action.payload,
        show: true,
      };
      const matchIndex = state.queue.findIndex(n => n.id === notif.id);

      const copy = state.queue.slice();
      if (matchIndex > -1) {
        copy.splice(matchIndex, 1, notif);
      } else {
        copy.push(notif);
      }

      state.queue = copy;
    },
    dismissNotification(state, action: PayloadAction<string>) {
      const matchIndex = state.queue.findIndex(n => n.id === action.payload);

      if (matchIndex > -1) {
        state.queue.splice(matchIndex, 1, {
          ...state.queue[matchIndex],
          show: false,
        });
      } else {
        throw new Error("Could not find notification to dismiss");
      }
    },
    destroyNotification(state, action: PayloadAction<string>) {
      state.queue = state.queue.filter(n => n.id !== action.payload);
    },
    clearNotifications(state) {
      state.queue = [];
    },
  },
});

export const { sendNotification, dismissNotification, destroyNotification, clearNotifications } =
  notificationsSlice.actions;

export default notificationsSlice;
