import createDeckScreen from "../../features/deck/createDeckScreen";

import AboutInstaller from "./AboutInstaller";

const screen = createDeckScreen(AboutInstaller, {
  id: "about-installer",
  title: "About Installer",
  logoPosition: "none",
  screenshot: {
    jpg: require("./screenshot.jpg"),
    webp: require("./screenshot.webp"),
  },
});

export default screen;
