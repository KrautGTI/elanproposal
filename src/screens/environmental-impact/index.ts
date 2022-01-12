import createDeckScreen from "../../features/deck/createDeckScreen";

import EnvironmentalImpact from "./EnvironmentalImpact";

const screen = createDeckScreen(EnvironmentalImpact, {
  id: "environmental-impact",
  title: "Environmental Impact",
  screenshot: {
    jpg: require("./screenshot.jpg"),
    webp: require("./screenshot.webp"),
  },
});

export default screen;
