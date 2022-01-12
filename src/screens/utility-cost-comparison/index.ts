import createDeckScreen from "../../features/deck/createDeckScreen";
import UtilityCostComparison from "./UtilityCostComparison";

const screen = createDeckScreen(UtilityCostComparison, {
  id: "utility-cost-comparison",
  title: "Utility Cost Comparison",
  screenshot: {
    jpg: require("./screenshot.jpg"),
    webp: require("./screenshot.webp"),
  },
  canRender: proposal => {
    return !!(proposal?.chartData?.consumptionFirstYear?.length && proposal?.chartData?.localUtilityRates?.length);
  },
});

export default screen;
