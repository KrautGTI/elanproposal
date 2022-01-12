import createSagaMiddleware, { END } from "redux-saga";

import { configureStore } from "@reduxjs/toolkit";
import * as Sentry from "@sentry/react";

import rootReducer from "../rootReducer";
import rootSaga from "../rootSaga";
import { makeMiddleware } from "./make-middleware";

export default function makeStore() {
  const sagaMiddleware = createSagaMiddleware({
    onError(error: Error) {
      Sentry.captureException(error);
    },
  });

  const middleware = [sagaMiddleware];

  const store = configureStore({
    reducer: rootReducer,
    middleware: makeMiddleware(middleware),
  });

  // not using sagas on the server (yet)
  if (typeof window !== "undefined") {
    store.sagaTask = sagaMiddleware.run(rootSaga);
    store.close = () => store.dispatch(END);
  }

  return store;
}
