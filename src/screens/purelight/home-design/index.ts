import createDeckScreen from "../../../features/deck/createDeckScreen";
import HomeDesign from "./HomeDesign";

const screen = createDeckScreen(HomeDesign, {
  id: "purelight-home-design",
  title: "Home Design",
  screenshot: {
    jpg: require("./screenshot.jpg"),
    webp: require("./screenshot.webp"),
  },
});

export default screen;
