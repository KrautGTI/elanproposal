import createDeckScreen from "../../../features/deck/createDeckScreen";

import HomePage from "./HomePage";

const screen = createDeckScreen(HomePage, {
  id: "purelight-home-page",
  title: "Home",
  colorMode: "light",
  screenshot: {
    jpg: require("./screenshot.jpg"),
    webp: require("./screenshot.webp"),
  },
  getRevealDataProps() {
    return { backgroundImage: "/proposals/purelight/home-background-image.jpg" };
  },
});

export default screen;
