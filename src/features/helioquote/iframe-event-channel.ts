import { eventChannel } from "redux-saga";

import { MessageToActionHandler } from "../../lib/redux-postmessage-middleware/messaging";

export function createIframeMessageChannel(messageToActionHandler: MessageToActionHandler) {
  // `eventChannel` takes a subscriber function
  // the subscriber function takes an `emit` argument to put messages onto the channel
  return eventChannel(emit => {
    const listener = messageToActionHandler(emit);

    window.addEventListener("message", listener);

    // the subscriber must return an unsubscribe function
    // this will be invoked when the saga calls `channel.close` method
    const unsubscribe = () => {
      window.removeEventListener("message", listener);
    };

    return unsubscribe;
  });
}
