import createDeckScreen from "../../features/deck/createDeckScreen";
import CompareProposals from "./CompareProposals";

const screen = createDeckScreen(CompareProposals, {
  id: "compare-proposals",
  title: "Compare Your Options",
  screenshot: {
    jpg: require("./screenshot.jpg"),
    webp: require("./screenshot.webp"),
  },
  canRender: proposal => !!proposal?.compareProposals?.length,
});

export default screen;
