import numeral from "numeral";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import TitleLayout from "../../components/layouts/TitleLayout";
import { getYearsListStartingWith } from "../../lib/dates";
import {
  getFirstYearChartData,
  getMaxBillForChart,
  getSelectedYearRateFactory,
  getUtilityMonthlyPayment,
  getUtilityRateIncrease,
  selectDeckFeatureFlags,
} from "../../lib/selectors";
import ComparisonChart from "./ComparisonChart";
import Slider from "./Slider";

import type { DeckScreen } from "../../types";

const ALLOWED_LOOKAHEAD_YEARS = 20;
const currentYear = new Date().getFullYear();

const range = getYearsListStartingWith(currentYear, ALLOWED_LOOKAHEAD_YEARS);

const UtilityCostComparison: DeckScreen = ({ isActive }) => {
  const isReady = useSelector(state => state.deck.ready);
  const { printMode } = useSelector(selectDeckFeatureFlags);
  const [futureYear, setFutureYear] = useState(currentYear);

  useEffect(() => {
    if (printMode) {
      setFutureYear(range[range.length - 1]);
    }
  }, [printMode]);

  const lookaheadYears = futureYear - currentYear;

  const getSelectedYearData = useSelector(getSelectedYearRateFactory);
  const futureYearData = useMemo(() => getSelectedYearData(lookaheadYears), [getSelectedYearData, lookaheadYears]);

  const highestBillInFutureYear = useMemo(() => Math.max(...futureYearData), [futureYearData]);
  const firstYearData = useSelector(getFirstYearChartData);
  const highestMonthlyBillTotal = useSelector(getMaxBillForChart);

  return (
    <TitleLayout title="Your Utility Bill is Increasing">
      <div className="w-full h-full flex flex-col px-10 bg-white rounded-lg">
        <div className="w-full flex justify-center py-8">
          <div className="bg-white rounded-lg shadow-md border py-3 px-12 text-center">
            <div className="font-bold text-4xl text-cost-dark mb-1">
              {numeral(highestBillInFutureYear).format("$0,0")}
            </div>
            <div className="text-lg text-gray-500">Highest bill in {futureYear}</div>
          </div>
        </div>
        <div className="w-full flex-grow flex flex-col justify-center overflow-hidden">
          {isReady && (
            <ComparisonChart
              className="flex-grow"
              active={isActive}
              firstYearData={firstYearData}
              futureYearData={futureYearData}
              max={highestMonthlyBillTotal * 1.05}
              futureYear={futureYear}
            />
          )}
        </div>
        <div className="py-12">
          <Slider min={range[0]} max={range[range.length - 1]} value={futureYear} onChange={setFutureYear} />
        </div>
        <Disclaimer />
      </div>
    </TitleLayout>
  );
};

export default UtilityCostComparison;

const Disclaimer = () => {
  const monthlyUtilityPayment = useSelector(getUtilityMonthlyPayment);
  const rateIncrease = useSelector(getUtilityRateIncrease);

  return (
    <div className="text-center pt-4 pb-8 text-sm text-gray-500">
      Calculations assume a current avg energy bill of {numeral(monthlyUtilityPayment).format("$0,0")}/mo with a rate
      increase of {numeral(rateIncrease).format("0[.]00")}%
    </div>
  );
};
