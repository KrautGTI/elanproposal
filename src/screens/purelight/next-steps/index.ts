import createDeckScreen from "../../../features/deck/createDeckScreen";
import NextSteps from "./NextSteps";

const screen = createDeckScreen(NextSteps, {
  id: "purelight-next-steps",
  title: "What’s Next",
  screenshot: {
    jpg: require("./screenshot.jpg"),
    webp: require("./screenshot.webp"),
  },
  getRevealDataProps() {
    return {
      backgroundImage: "/proposals/purelight/install-background.jpg",
    };
  },
});

export default screen;
