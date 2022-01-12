import clsx from "clsx";
import last from "lodash/last";
import sum from "lodash/sum";
import numeral from "numeral";
import React, { FC, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

import useToggle from "@react-hook/toggle";

import TitleLayout from "../../components/layouts/TitleLayout";
import SpringSlider from "../../components/SpringSlider";
import {
  getCanShowSolarSavings,
  getCompoundingUtilityRatesData,
  getCostOfSolarData,
  getLocalUtilityRatesData,
  getMonthlyBillAfterOffset,
  getSolarMonthlyPayment,
  getSolarOffset,
  getUtilityMonthlyPayment,
  getUtilityWithOffsetData,
} from "../../lib/selectors";
import PaymentImpactChart from "./components/PaymentImpactChart";
import SavingsImpactChart from "./components/SavingsImpactChart";

import type { DeckScreen } from "../../types";

type Bubble = {
  bgColor: string;
  textColor: string;
  value: string;
  label: string;
};

interface FinancialImpactProps {
  heading?: string | undefined;
  forceSelect?: "payment" | "savings";
}

const FinancialImpact: DeckScreen<FinancialImpactProps> = ({ heading, isActive, forceSelect }) => {
  const [chartType, toggleChartType] = useToggle<"payment", "savings">("payment", "savings", forceSelect || "payment");

  const canShowSolarSavings = useSelector(getCanShowSolarSavings);

  const handleToggle = useCallback(() => {
    if (forceSelect) return;
    toggleChartType();
  }, [forceSelect, toggleChartType]);

  return (
    <TitleLayout title={heading ?? "Financial Impact"}>
      <div className="w-full h-full flex flex-col px-8 py-7 bg-white border-2 border-gray-900 border-opacity-20 rounded-lg shadow-lg">
        {canShowSolarSavings && <ToggleButtons selected={chartType} toggle={handleToggle} />}
        <BreakdownBubbles selected={chartType} />
        <div className="flex-grow flex justify-end">
          {!forceSelect && canShowSolarSavings ? (
            <SpringSlider activeIndex={chartType === "payment" ? 0 : 1}>
              <PaymentChart isActive={isActive} />
              <SavingsChart isActive={isActive} />
            </SpringSlider>
          ) : chartType === "savings" ? (
            <SavingsChart isActive={isActive} />
          ) : (
            <PaymentChart isActive={isActive} />
          )}
        </div>
      </div>
    </TitleLayout>
  );
};

export default FinancialImpact;

function ToggleButtons({ selected, toggle }: { selected: "payment" | "savings"; toggle: () => void }) {
  return (
    <div className="flex justify-center overflow-hidden pt-1 pb-3 mb-6">
      <div className="bg-gray-200 inline-flex rounded relative">
        <div
          className={clsx(
            "bg-primary w-1/2 h-full rounded-lg absolute z-0 transition-all duration-500",
            selected === "payment" ? "left-0" : "left-1/2"
          )}
        ></div>

        <button
          type="button"
          className={clsx("btn px-6 py-3 z-10 w-1/2", selected === "payment" && "text-white")}
          onClick={selected === "savings" ? toggle : undefined}
          data-cy="payment-toggle"
        >
          Payment
        </button>
        <button
          type="button"
          className={clsx("btn px-6 py-3 z-10 w-1/2", selected === "savings" && "text-white")}
          onClick={selected === "payment" ? toggle : undefined}
          data-cy="savings-toggle"
        >
          Savings
        </button>
      </div>
    </div>
  );
}
interface BreakdownBubbleProps extends Bubble {
  className?: string;
}

const BreakdownBubble: FC<BreakdownBubbleProps> = ({ className, bgColor, textColor, value, label }) => (
  <div className={clsx("py-8 rounded-lg", bgColor, className)}>
    <div className={clsx("font-bold text-5xl", textColor)}>{value}</div>
    <div className="mt-4 text-lg text-gray-500">{label}</div>
  </div>
);

function BreakdownBubbles({ selected }: { selected: "payment" | "savings" }) {
  const monthlyUtilityPayment = useSelector(getUtilityMonthlyPayment);
  const monthlySolarPayment = useSelector(getSolarMonthlyPayment);
  const utilityWithOffsetRates = useSelector(getUtilityWithOffsetData);
  const compoundingUtilityRates = useSelector(getCompoundingUtilityRatesData);

  const costOfSolarData = useSelector(getCostOfSolarData);
  const monthlyUtilityBillAfterOffset = useSelector(getMonthlyBillAfterOffset);

  const bubbles = useMemo<Bubble[]>(() => {
    if (selected === "savings") {
      const costOfDoingNothing = last(compoundingUtilityRates) ?? 0;
      const costOfUtilityAfterOffset = sum(utilityWithOffsetRates) ?? 0;
      const solarPaymentsTotal = sum(costOfSolarData);

      const totalSavings = costOfDoingNothing - solarPaymentsTotal - costOfUtilityAfterOffset;

      return [
        {
          bgColor: "bg-gray-200",
          textColor: "text-secondary-light",
          value: numeral(costOfDoingNothing).format("$0,0"),
          label: "Cost of Doing Nothing",
        },
        {
          bgColor: "bg-blue-gray-800",
          textColor: "text-green-light",
          value: numeral(totalSavings).format("$0,0"),
          label: "Total Estimated Solar Savings",
        },
      ];
    }

    return [
      {
        bgColor: "bg-gray-200",
        textColor: "text-secondary-light",
        value: numeral(monthlyUtilityPayment).format("$0,0"),
        label: "Current Monthly Utility Bill",
      },
      {
        bgColor: "bg-blue-gray-800",
        textColor: "text-green-light",
        value: numeral(monthlySolarPayment).format("$0,0"),
        label: "Monthly Solar Payment",
      },
      {
        bgColor: "bg-gray-200",
        textColor: "text-alt-blue",
        value: numeral(monthlyUtilityBillAfterOffset).format("$0,0"),
        label: "Remaining Utility Bill After Solar",
      },
    ];
  }, [
    selected,
    compoundingUtilityRates,
    monthlyUtilityPayment,
    monthlySolarPayment,
    utilityWithOffsetRates,
    monthlyUtilityBillAfterOffset,
    costOfSolarData,
  ]);

  const bubblesGrids = useMemo(() => (bubbles.length === 3 ? "grid-cols-3" : "grid-cols-2"), [bubbles]);
  const bubbleWidth = useMemo(() => (bubbles.length > 2 ? "w-4/5" : "w-3/5"), [bubbles]);

  return (
    <div className="flex justify-center mb-8">
      <div className={`grid ${bubblesGrids} gap-4 text-center ${bubbleWidth}`}>
        {bubbles.map(bubble => (
          <BreakdownBubble key={bubble.label} {...bubble} />
        ))}
      </div>
    </div>
  );
}

function PaymentChart({ isActive }) {
  const localUtilityRates = useSelector(getLocalUtilityRatesData);
  const utilityWithOffsetRates = useSelector(getUtilityWithOffsetData);

  const GRAPH_YEARS = 30;

  const costOfSolarData = useSelector(getCostOfSolarData);

  return (
    <PaymentImpactChart
      className="w-full h-full"
      active={isActive}
      solarData={costOfSolarData ?? []}
      utilityData={localUtilityRates ?? []}
      utilityWithOffsetData={utilityWithOffsetRates ?? []}
      utilityWithOffsetLabel={`Estimated utility payments after Solar`}
      years={GRAPH_YEARS}
    />
  );
}

function SavingsChart({ isActive }) {
  const localUtilityRates = useSelector(getLocalUtilityRatesData);
  const utilityWithOffsetRates = useSelector(getUtilityWithOffsetData);
  const solarOffset = useSelector(getSolarOffset);

  const GRAPH_YEARS = 30;

  const costOfSolarData = useSelector(getCostOfSolarData);

  return (
    <SavingsImpactChart
      className="w-full h-full"
      active={isActive}
      solarData={costOfSolarData ?? []}
      utilityData={localUtilityRates ?? []}
      utilityWithOffsetData={utilityWithOffsetRates ?? []}
      utilityWithOffsetLabel={`Utility cost at ${solarOffset}% offset`}
      years={GRAPH_YEARS}
    />
  );
}
