import createDeckScreen from "../../features/deck/createDeckScreen";
import ProductionVsConsumption from "./ProductionVsConsumption";

const screen = createDeckScreen(ProductionVsConsumption, {
  id: "production-vs-consumption",
  title: "",
  screenshot: {
    jpg: require("./screenshot.jpg"),
    webp: require("./screenshot.webp"),
  },
  canRender: proposal => {
    return !!(
      proposal?.chartData?.solarProductionFirstYear?.length || proposal?.chartData?.consumptionFirstYear?.length
    );
  },
});

export default screen;
