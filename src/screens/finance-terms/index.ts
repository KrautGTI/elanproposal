import createDeckScreen from "../../features/deck/createDeckScreen";

import FinanceTerms from "./FinanceTerms";

const screen = createDeckScreen(FinanceTerms, {
  id: "finance-terms",
  title: "Finance Terms",
  screenshot: {
    jpg: require("./screenshot.jpg"),
    webp: require("./screenshot.webp"),
  },
  getRevealDataProps() {
    return {
      background: `linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, #f0f5f6 50%, #f0f5f6 100%)`,
    };
  },
});

export default screen;
