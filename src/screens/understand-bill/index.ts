import createDeckScreen from "../../features/deck/createDeckScreen";

import UnderstandBill from "./UnderstandBill";

const screen = createDeckScreen(UnderstandBill, {
  id: "understand-bill",
  title: "Understand Bill",
  screenshot: {
    jpg: require("./screenshot.jpg"),
    webp: require("./screenshot.webp"),
  },
});

export default screen;
