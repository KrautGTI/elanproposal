import AboutInstaller from "./screens/about-installer";
import CompareProposals from "./screens/compare-proposals";
import CustomImage from "./screens/custom-image";
import CustomerReviews from "./screens/customer-reviews";
import EnvironmentalImpact from "./screens/environmental-impact";
import Faqs from "./screens/faqs";
import FinanceTerms from "./screens/finance-terms";
import FinancialImpact from "./screens/financial-impact";
import HomeDesign from "./screens/home-design";
import Home from "./screens/home-page";
import NextSteps from "./screens/next-steps";
import Notes from "./screens/notes";
import ProductionVsConsumption from "./screens/production-vs-consumption";
import PureLightFinanceTerms from "./screens/purelight/finance-terms";
import PureLightHomeDesign from "./screens/purelight/home-design";
import PureLightHome from "./screens/purelight/home-page";
import PureLightNextSteps from "./screens/purelight/next-steps";
import PureLightOwnVsRent from "./screens/purelight/own-vs-rent";
import PureLightWhySolar from "./screens/purelight/why-solar";
import SolarPower from "./screens/solar-power";
import TraditionalPower from "./screens/traditional-power";
import UnderstandBill from "./screens/understand-bill";
import UtilityCostComparison from "./screens/utility-cost-comparison";
import WhyChooseSolar from "./screens/why-solar";

const screens = {
  "about-installer": AboutInstaller,
  "custom-image": CustomImage,
  "customer-reviews": CustomerReviews,
  "environmental-impact": EnvironmentalImpact,
  faqs: Faqs,
  "finance-terms": FinanceTerms,
  "financial-impact": FinancialImpact,
  "home-design": HomeDesign,
  "home-page": Home,
  "next-steps": NextSteps,
  "production-vs-consumption": ProductionVsConsumption,
  "traditional-power": TraditionalPower,
  "solar-power": SolarPower,
  "understand-bill": UnderstandBill,
  "utility-cost-comparison": UtilityCostComparison,
  "why-solar": WhyChooseSolar,
  notes: Notes,

  // V2
  "compare-proposals": CompareProposals,

  // PureLight Power
  "purelight-home-page": PureLightHome,
  "purelight-why-solar": PureLightWhySolar,
  "purelight-home-design": PureLightHomeDesign,
  "purelight-finance-terms": PureLightFinanceTerms,
  "purelight-own-vs-rent": PureLightOwnVsRent,
  "purelight-next-steps": PureLightNextSteps,
};

export type RegisteredScreenKey = keyof typeof screens;

// type ScreenComponentProps<T extends RegisteredScreenKey> = PropsOf<typeof screens[T]["component"]>;

export const isScreenRegistered = (key: string): key is RegisteredScreenKey => {
  return !!lookupRegisteredScreen(key as RegisteredScreenKey);
};

export function lookupRegisteredScreen<T extends RegisteredScreenKey>(key: T): typeof screens[T] {
  return screens[key];
}
