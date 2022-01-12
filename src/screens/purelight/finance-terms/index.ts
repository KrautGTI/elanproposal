import dynamic from "next/dynamic";
import createDeckScreen from "../../../features/deck/createDeckScreen";

const screen = createDeckScreen(
  dynamic(() => import("./FinanceTerms"), { ssr: false }),
  {
    id: "purelight-finance-terms",
    title: "Finance Terms",
    screenshot: {
      jpg: require("./screenshot.jpg"),
      webp: require("./screenshot.webp"),
    },
  }
);

export default screen;
