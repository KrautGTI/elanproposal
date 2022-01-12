import dynamic from "next/dynamic";

import createDeckScreen from "../../features/deck/createDeckScreen";
import { faqs } from "./constants";

const screen = createDeckScreen(
  dynamic(() => import("./Faqs")),
  {
    id: "faqs",
    title: "FAQs",
    screenshot: {
      jpg: require("./screenshot.jpg"),
      webp: require("./screenshot.webp"),
    },
    getPrintModeProps(parentProps) {
      return faqs.map(faq => ({
        ...parentProps,
        id: `faqs--${faq.id}`,
        forceSelect: faq.id,
      }));
    },
  }
);

export default screen;
