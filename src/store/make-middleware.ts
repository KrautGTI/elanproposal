import { AnyAction, ConfigureStoreOptions, Middleware } from "@reduxjs/toolkit";
import { RootState } from "../rootReducer";

type MakeMiddlewareFn<T extends Middleware = Middleware> = (
  middleware: T[]
) => ConfigureStoreOptions<RootState, AnyAction, T[]>["middleware"];

export const makeMiddleware: MakeMiddlewareFn = middleware => getDefaultMiddleware => {
  return getDefaultMiddleware({
    serializableCheck: {
      // Ignore these field paths in all actions
      ignoredActionPaths: ["meta.arg"],
    },
  }).concat(middleware);
};
