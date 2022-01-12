import numeral from "numeral";
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";

import useToggle from "@react-hook/toggle";

import EmptyLayout from "../../components/layouts/EmptyLayout";
import {
  getCostOfDoingNothing,
  getUtilityBillFiles,
  getUtilityMonthlyPayment,
  getUtilityRateIncrease,
} from "../../lib/selectors";
import FallbackBill from "./FallbackBill";

import type { DeckScreen } from "../../types";

interface UnderstandBillProbs {
  heading?: string | undefined;
  forceSelect?: "document" | "digital";
}

const UnderstandBill: DeckScreen<UnderstandBillProbs> = ({forceSelect}) => {
  const monthlyPayment = useSelector(getUtilityMonthlyPayment);
  const rateIncrease = useSelector(getUtilityRateIncrease);
  const utilityBillFiles = useSelector(getUtilityBillFiles);
  const costOfDoingNothing = useSelector(getCostOfDoingNothing);

  const billUrl = utilityBillFiles[0]?.url;

  const [chartType, toggleChartType] = useToggle<"document", "digital">("document", "digital",  forceSelect || "document");

  const handleToggle = useCallback(() => {
    if (forceSelect) return;
    toggleChartType();
  }, [forceSelect, toggleChartType]);


  return (
    <EmptyLayout className="text-left">
      <div className="w-full h-full flex overflow-hidden">
        <div className="w-5/12 pr-10">
          <h1 className="text-7xl font-bold mb-4">Your Bill</h1>
          <div className="text-3xl mb-4">
            <span className="whitespace-nowrap">Since 2000, the average retail cost</span>
            <br />
            of power has doubled.
          </div>

          <div className="flex-grow flex flex-col items-start py-12">
            <div className="py-8 px-16 bg-white rounded-lg shadow-md">
              <div className="text-center mb-12">
                <div className="font-bold text-xl mb-4 text-gray-500">Your average monthly electric bill</div>
                <div className="font-bold text-4xl">{numeral(monthlyPayment ?? 0).format("$0,0")}</div>
              </div>

              <div className="text-center mb-12">
                <div className="font-bold text-xl mb-4 text-gray-500">Your estimated annual increase</div>
                <div className="font-bold text-4xl">{numeral(rateIncrease ?? 0).format("0.0")}%</div>
              </div>

              <div className="text-center mb">
                <div className="font-bold text-xl mb-4 text-gray-500">
                  At this rate of consumption
                  <br />
                  your 30 year cost of doing nothing is
                </div>
                <div className="font-bold text-7xl text-red-700">{numeral(costOfDoingNothing ?? 0).format("$0,0")}</div>
              </div>
            </div>
          </div>
        </div>

        {!!billUrl ? (
        <div className="w-full h-full flex flex-col px-8 py-7 bg-white border-2 border-gray-900 border-opacity-20 rounded-lg shadow-lg">
          <ToggleButtons selected={chartType} toggle={handleToggle} />

          <div className="flex-grow flex justify-center overflow-auto">
            { chartType === "digital" ? (
              <FallbackBill />
            ) : (
              <img className="border border-black" src={billUrl} alt="Power Bill" />
            )}
          </div>
        </div>
        ): <FallbackBill /> }
      </div>

    </EmptyLayout>
  );
};

export default UnderstandBill;

function ToggleButtons({ selected, toggle }: { selected: "document" | "digital"; toggle: () => void }) {
  return (
    <div className="flex justify-center pt-1 pb-3 mb-6">
      <div className="bg-gray-200 inline-flex rounded relative">
        <div
          className={clsx(
            "bg-primary w-7rem h-full rounded-lg absolute z-0 transition-all duration-500",
            selected === "document" ? "left-0" : "left-1/2"
          )}
          style={{width: "8rem"}}
        ></div>

        <button
          type="button"
          className={clsx("btn px-6 py-3 z-10", selected === "document" && "text-white")}
          onClick={selected === "digital" ? toggle : undefined}
          data-cy="payment-toggle"
          style={{width: "8rem"}}
        >
          Document
        </button>
        <button
          type="button"
          className={clsx("btn px-6 py-3 z-10", selected === "digital" && "text-white")}
          onClick={selected === "document" ? toggle : undefined}
          data-cy="savings-toggle"
          style={{width: "8rem"}}
        >
          Digital
        </button>
      </div>
    </div>
  );
}

