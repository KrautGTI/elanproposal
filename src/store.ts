import { createWrapper } from "next-redux-wrapper";

import makeStore from "./store/make-store";

export type StoreType = ReturnType<typeof makeStore>;

export const wrapper = createWrapper(makeStore, { debug: process.env.NODE_ENV === "development" });
