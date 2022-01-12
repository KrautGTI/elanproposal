import createDeckScreen from "../../features/deck/createDeckScreen";
import NextSteps from "./NextSteps";

const screen = createDeckScreen(NextSteps, {
  id: "next-steps",
  title: "Next Steps",
  screenshot: {
    jpg: require("./screenshot.jpg"),
    webp: require("./screenshot.webp"),
  },
});

export default screen;
