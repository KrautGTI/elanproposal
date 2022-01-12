import { isString } from "./utils";

const getEventOrigin = (ev: MessageEvent): string => {
  const origin = ev.origin || (ev as any).originalEvent.origin;
  return origin;
};

const readAction = (ev: MessageEvent) => {
  try {
    const action: any = isString(ev.data) ? JSON.parse(ev.data) : ev.data;
    return action;
  } catch (ex) {
    return { type: "" };
  }
};

const isDevtoolsAction = (action: any): boolean => action.source?.startsWith("@devtools");

const isValidAction = (action: any): boolean => isString(action.type) && !isDevtoolsAction(action);

type Dependencies = {
  allowedURLs: string[];
};

export type ActionHandler = (action: any) => void;

export type MessageHandler = (ev: MessageEvent) => void;

export type MessageToActionHandler = (fn: ActionHandler) => MessageHandler;

export const createMessageToActionHandler = ({ allowedURLs }: Dependencies): MessageToActionHandler => {
  const isValidOrigin = (origin: string): boolean => {
    return allowedURLs.some(url => url.includes(origin));
  };

  return emit => event => {
    const origin = getEventOrigin(event);
    if (!isValidOrigin(origin)) {
      console.log("invalid origin", origin);
      return;
    }
    const action = readAction(event);
    if (!isValidAction(action)) {
      return;
    }
    console.log(action);
    emit(action);
  };
};
