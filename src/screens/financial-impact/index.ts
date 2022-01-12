import dynamic from "next/dynamic";
import createDeckScreen from "../../features/deck/createDeckScreen";

const screen = createDeckScreen(
  dynamic(() => import(/* webpackChunkName: "FinancialImpact--Screen"*/ "./FinancialImpact"), {
    ssr: false,
  }),
  {
    id: "financial-impact",
    title: "Financial Impact",
    screenshot: {
      jpg: require("./screenshot.jpg"),
      webp: require("./screenshot.webp"),
    },
    getPrintModeProps(parentProps, proposal) {
      const pages: (typeof parentProps & { id: string })[] = [
        {
          ...parentProps,
          id: `${this.id}-payment`,
          forceSelect: "payment" as "payment",
        },
      ];

      if (proposal.solarCosts.canShowSolarSavings) {
        pages.push({
          ...parentProps,
          id: `${this.id}-savings`,
          forceSelect: "savings" as "savings",
        });
      }

      return pages;
    },
  }
);

export default screen;
