import { Buffer, eventChannel } from "redux-saga";

import type { Reveal, RevealEvent } from "reveal.js";

export type ActionHandler = (action: any) => void;

export type RevealEventHandler = (ev: RevealEvent) => void;

export type RevealEventToActionHandler = (fn: ActionHandler) => RevealEventHandler;

export function createRevealEventChannel(reveal: Reveal, eventName: RevealEvent["type"], buffer?: Buffer<unknown>) {
  // `eventChannel` takes a subscriber function
  // the subscriber function takes an `emit` argument to put messages onto the channel
  return eventChannel(emit => {
    const listener = (e: RevealEvent) => {
      emit(e);
    };

    reveal.on(eventName, listener);

    // the subscriber must return an unsubscribe function
    // this will be invoked when the saga calls `channel.close` method
    return () => {
      reveal.off(eventName, listener);
    };
  }, buffer);
}
