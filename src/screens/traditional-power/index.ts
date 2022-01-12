import createDeckScreen from "../../features/deck/createDeckScreen";
import TraditionalPower from "./TraditionalPower";

const screen = createDeckScreen(TraditionalPower, {
  id: "traditional-power",
  title: "Traditional Power",
  screenshot: {
    jpg: require("./screenshot.jpg"),
    webp: require("./screenshot.webp"),
  },
});

export default screen;
