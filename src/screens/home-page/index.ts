import createDeckScreen from "../../features/deck/createDeckScreen";
import HomePage from "./HomePage";

const defaultVideoUrl =
  "https://s3-us-west-2.amazonaws.com/static-assets.enerflo.io/_next/static/videos/AdobeStockTrees_720-8b6d59e694fbbdd45056ac91c1106aa4.mp4";

const screen = createDeckScreen(HomePage, {
  id: "home-page",
  title: "Home",
  colorMode: "dark",
  screenshot: {
    jpg: require("./screenshot.jpg"),
    webp: require("./screenshot.webp"),
  },
  getRevealDataProps(config) {
    return {
      backgroundVideo: config?.videoUrl || defaultVideoUrl,
      backgroundVideoMuted: true,
      backgroundVideoLoop: true,
    };
  },
});

export default screen;
