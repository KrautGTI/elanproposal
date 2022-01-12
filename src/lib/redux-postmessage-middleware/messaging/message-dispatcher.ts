import { originFromURL } from "./utils";

type Dependencies = {
  document: Document;
  senderURL: string;
  targetSelector: string;
};

export type MessageDispatcher = (action: any) => void;

export const createMessageDispatcher = ({ document, senderURL, targetSelector }: Dependencies): MessageDispatcher => {
  const senderOrigin = senderURL === "*" ? senderURL : originFromURL(document)(senderURL);

  return (action: any) => {
    const data = typeof action === "string" ? action : JSON.stringify(action);

    const iframe = document.querySelector<HTMLIFrameElement>(targetSelector);
    console.log({ targetSelector, iframe, data, senderOrigin });
    if (!iframe) return;

    iframe.contentWindow?.postMessage(data, senderOrigin);
  };
};
