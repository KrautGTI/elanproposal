import dynamic from "next/dynamic";
import createDeckScreen from "../../../features/deck/createDeckScreen";

const screen = createDeckScreen(
  dynamic(() => import("./OwnVsRent"), {
    ssr: false,
  }),
  {
    id: "purelight-own-vs-rent",
    title: "Own vs Rent",
    screenshot: {
      jpg: require("./screenshot.jpg"),
      webp: require("./screenshot.webp"),
    },
  }
);

export default screen;
