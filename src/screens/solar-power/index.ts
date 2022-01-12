import createDeckScreen from "../../features/deck/createDeckScreen";
import SolarPower from "./SolarPower";

const screen = createDeckScreen(SolarPower, {
  id: "solar-power",
  title: "Solar Power",
  screenshot: {
    jpg: require("./screenshot.jpg"),
    webp: require("./screenshot.webp"),
  },
  getRevealDataProps() {
    return {
      backgroundColor: "#f1f4f8",
    };
  },
  getPrintModeProps(parentProps) {
    return [
      {
        ...parentProps,
        id: `solar-power--day`,
        forceSelect: "day" as "day",
      },
      {
        ...parentProps,
        id: `solar-power--night`,
        forceSelect: "night" as "night",
      },
    ];
  },
});

export default screen;
