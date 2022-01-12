import createDeckScreen from "../../features/deck/createDeckScreen";

import WhyChooseSolar from "./WhyChooseSolar";

const screen = createDeckScreen(WhyChooseSolar, {
  id: "why-solar",
  title: "Why Solar",
  screenshot: {
    jpg: require("./screenshot.jpg"),
    webp: require("./screenshot.webp"),
  },
});

export default screen;
