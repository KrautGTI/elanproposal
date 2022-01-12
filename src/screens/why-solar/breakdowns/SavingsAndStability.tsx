import clsx from "clsx";
import concat from "lodash/concat";
import last from "lodash/last";
import range from "lodash/range";
import sum from "lodash/sum";
import take from "lodash/take";
import takeRight from "lodash/takeRight";
import numeral from "numeral";
import { FC, forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { faChevronDoubleLeft, faChevronDoubleRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useToggle from "@react-hook/toggle";

import SavingsChartOwn from "../../../charts/SavingsChartOwn";
import SavingsChartRent from "../../../charts/SavingsChartRent";
import Fade from "../../../components/Fade";
import Slide from "../../../components/Slide";
import SpringSlider from "../../../components/SpringSlider";
import {
  getLoanTermYears,
  getLocalUtilityRatesData,
  getNationalUtilityRatesData,
  getPast30YearUtilityRates,
  getSolarRatesData,
  getUtilityMonthlyPayment,
  getUtilityRateIncrease,
  getYearsInHome,
  getCanShowSolarSavings,
} from "../../../lib/selectors";
import { TileOptions } from "../../../types/tile-options";
import { ReactComponent as BreakdownIcon } from "../images/WhyChooseSolar--Breakdown--Savings.svg";
import SavingsJpg from "../images/WhyChooseSolar--Savings.jpg";
import SavingsWebp from "../images/WhyChooseSolar--Savings.webp";

interface SavingsAndStabilityBreakdownProps {}

const SavingsAndStabilityBreakdown: FC<SavingsAndStabilityBreakdownProps> = props => {
  const [chartType, toggleChartType] = useToggle<0, 1>(0, 1, 0);

  const monthlyUtilityPayment = useSelector(getUtilityMonthlyPayment);
  const utilityRateIncrease = useSelector(getUtilityRateIncrease);
  const canShowSolarSavings = useSelector(getCanShowSolarSavings);

  const description = (
    <p className="text-sm text-gray-600">
      When owning your source of power vs renting from the power company, you stabilize yourself against rising energy
      costs. You usually save from day one and the delta becomes wider over time.
    </p>
  );

  return (
    <BreakdownWrapper className="px-6 lg:px-14 py-16 lg:py-8 bg-white rounded-lg shadow-xl">
      <div className="mb-8 xl:mb-10 lg:w-full lg:flex lg:items-center">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-full md:mx-0 md:h-auto md:w-auto">
          <BreakdownIcon />
        </div>
        <div className="mt-3 text-center lg:mt-0 lg:mx-4 lg:text-left">
          <h3 className="text-4xl leading-snug font-bold text-gray-900 mb-3" id="modal-headline">
            {canShowSolarSavings ? "Savings & Stability" : "Stability"}
          </h3>
          <div className="mx-auto max-w-prose">{description}</div>
        </div>
        <div className="flex-shrink-0 flex justify-center lg:justify-end lg:ml-auto">
          <ChartSelector value={chartType} onToggle={toggleChartType} />
        </div>
      </div>
      <div className="w-full aspect-w-16 aspect-h-9 overflow-hidden mb-6">
        <SpringSlider activeIndex={chartType}>
          <SavingsAndStabilityRent in={chartType === 0} />
          <SavingsAndStabilityOwn in={chartType === 1} />
        </SpringSlider>
      </div>
      <div className="flex-shrink-0 text-gray-500 text-center xl:p-4 text-xs font-bold">
        Calculations assume a current avg energy bill of {numeral(monthlyUtilityPayment ?? 0).format("$0,0")}
        /mo,
        <br />
        being in the home for 5 yrs with a rate increase of {numeral((utilityRateIncrease ?? 0) / 100).format("0.00%")}
      </div>
    </BreakdownWrapper>
  );
};

export default {
  id: "savings-and-stability",
  title: "Savings & Stability",
  subtitle:
    "History usually repeats itself. Knowing what you’ve paid for power in the past will help you predict the rising costs of power for the future.",
  image: { jpg: SavingsJpg, webp: SavingsWebp },
  breakdown: SavingsAndStabilityBreakdown,
} as TileOptions;

const BreakdownWrapper = styled.div`
  pointer-events: auto;
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: left;
`;

const noop = () => {};

const ChartSelector = forwardRef<HTMLDivElement, { value: 0 | 1; onToggle: () => void }>(({ value, onToggle }, ref) => {
  return (
    <div ref={ref} className="w-full sm:w-1/2 lg:w-full flex bg-gray-100 p-2 lg:p-3 rounded-lg mt-6 lg:mt-0">
      <button
        type="button"
        className={clsx(
          "w-full justify-center rounded-tl rounded-bl border border-transparent shadow-sm px-4 py-1 text-base font-bold focus:outline-none focus:ring-2 focus:ring-secondary-light",
          value === 0 ? "border-secondary-light bg-secondary-light text-white" : "bg-white text-gray-500"
        )}
        onClick={value === 0 ? noop : onToggle}
        data-cy="switch-to-rent"
      >
        Rent
      </button>
      <button
        type="button"
        className={clsx(
          "w-full justify-center rounded-tr rounded-br border border-transparent shadow-sm px-4 py-1 text-base font-bold focus:outline-none focus:ring-2 focus:ring-secondary-light",
          value === 1 ? "border-secondary-light bg-secondary-light text-white" : "bg-white text-gray-500"
        )}
        onClick={value === 1 ? noop : onToggle}
        data-cy="switch-to-own"
      >
        Own
      </button>
    </div>
  );
});

const currentYear = new Date().getFullYear();

const SavingsAndStabilityRent = forwardRef<HTMLDivElement, { className?: string; in: boolean }>(
  ({ className, in: isIn }, ref) => {
    const localUtilityRates = useSelector(getLocalUtilityRatesData);
    const termYears = useSelector(getLoanTermYears) ?? 25;
    const yearsInHome = useSelector(getYearsInHome);
    const lookback30YearsData = useSelector(getPast30YearUtilityRates);

    const [lookbackYears, setLookbackYears] = useState(yearsInHome);
    const startYear = currentYear - lookbackYears;

    const lookbackData = useMemo(
      () => takeRight(lookback30YearsData, lookbackYears),
      [lookback30YearsData, lookbackYears]
    );
    const nextPeriodData = useMemo(
      () => concat([], lookbackData, take(localUtilityRates, termYears)),
      [lookbackData, localUtilityRates, termYears]
    );
    const costOfDoingNothingData = useMemo(
      () => concat([], lookbackData, localUtilityRates ?? []),
      [lookbackData, localUtilityRates]
    );

    const costOfLookbackPeriod = sum(lookbackData);
    const costOfNextPeriod = sum(takeRight(nextPeriodData, termYears));
    const costOfDoingNothing = sum(takeRight(costOfDoingNothingData, 30));

    // const costOfLookbackPeriod = sum(lookbackData);
    // const costOfNextPeriod = sum(nextPeriodData);
    // const costOfDoingNothing = sum(costOfDoingNothingData);

    const [activeStep, setActiveStep] = useState<number>(1);
    const [nextStepBtnYears, setNextStepBtnYears] = useState<number | null>(termYears);

    useEffect(() => {
      let timeoutId = window.setTimeout(() => {
        if (activeStep === 1) {
          setNextStepBtnYears(termYears);
        } else if (activeStep === 2) {
          setNextStepBtnYears(30 - termYears);
        } else if (nextStepBtnYears !== null) {
          setNextStepBtnYears(null);
        }
      }, 1000);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }, [activeStep, nextStepBtnYears, termYears]);

    const switchSteps = useCallback((step: number) => {
      setNextStepBtnYears(null);
      setActiveStep(step);
    }, []);

    const maxValue = useMemo(() => last(localUtilityRates) ?? 0, [localUtilityRates]);

    const rentChartData = useMemo<number[]>(() => {
      switch (activeStep) {
        case 1:
          return lookbackData;
        case 2:
          return nextPeriodData;
        case 3:
        default:
          return costOfDoingNothingData;
      }
    }, [activeStep, lookbackData, nextPeriodData, costOfDoingNothingData]);

    const labelGroups = useMemo(() => {
      const labelGroup1 = {
        step: 1,
        value: costOfLookbackPeriod,
        visible: activeStep >= 1,
        renderLabel: () => (
          <div className="text-base">
            Spent on utilities since
            <br />
            <select
              className="py-1"
              value={lookbackYears}
              onChange={e => {
                setLookbackYears(parseInt(e.target.value, 10));
              }}
              data-cy="select-utility-lookback"
            >
              {range(currentYear - 1, currentYear - 11, -1).map(year => (
                <option key={year} value={currentYear - year}>
                  {year}
                </option>
              ))}
              {/* Allow previously selected values up to 30 */}
              {!!lookbackYears && lookbackYears > 10 && (
                <option value={Math.min(lookbackYears, 30)}>{currentYear - Math.min(lookbackYears, 30)}</option>
              )}
            </select>
          </div>
        ),
      };

      const labelGroup2 = {
        step: 2,
        value: costOfNextPeriod,
        className: "bg-gray-200",
        visible: activeStep >= 2,
        renderLabel: () => (
          <div>
            What you’ll spend over the
            <br />
            next {termYears} years
          </div>
        ),
      };

      const labelGroup3 = {
        step: 3,
        value: costOfDoingNothing,
        className: "bg-gray-300",
        visible: activeStep >= 3,
        renderLabel: () => (
          <div>
            What you’ll spend over the
            <br />
            next 30 years
          </div>
        ),
      };

      return [labelGroup1, labelGroup2, labelGroup3];
    }, [
      activeStep,
      costOfLookbackPeriod,
      costOfNextPeriod,
      costOfDoingNothing,
      lookbackYears,
      setLookbackYears,
      termYears,
    ]);

    return (
      <div ref={ref} className="w-full h-full flex flex-col justify-evenly lg:justify-start">
        <div className="flex items-center px-6 md:mb-4 relative">
          <div className="w-1/3">
            <Fade show={activeStep !== 1}>
              <button
                className={clsx(
                  "text-secondary focus:ring-secondary-light focus:ring-opacity-30",
                  activeStep === 1 && "invisible"
                )}
                onClick={() => switchSteps(Math.max(1, activeStep - 1))}
              >
                <FontAwesomeIcon icon={faChevronDoubleLeft} size="lg" />
              </button>
            </Fade>
          </div>
          <div className="w-1/3 relative">
            <Slide in={activeStep === 3} timeout={1000}>
              <div className="bg-white rounded-lg shadow-md border py-3 px-12 text-center">
                <div className="font-bold text-3xl text-secondary mb-1">
                  {numeral(costOfDoingNothing).format("$0,0")}
                </div>
                <div className="text-lg text-gray-500">Cost of doing nothing</div>
              </div>
            </Slide>
          </div>
          <div className="w-1/3 flex justify-end">
            <Fade show={!!nextStepBtnYears && activeStep !== 3}>
              <button
                className="flex items-center text-secondary focus:ring-secondary-light focus:ring-opacity-30"
                onClick={() => switchSteps(Math.min(3, activeStep + 1))}
                data-cy="next-btn"
              >
                <div className={clsx("mr-4 text-base", !nextStepBtnYears && "invisible")}>
                  <div>
                    What you’ll
                    <br />
                    spend over the
                    <br />
                    next {nextStepBtnYears} years
                  </div>
                </div>
                <div>
                  <FontAwesomeIcon icon={faChevronDoubleRight} size="2x" />
                </div>
              </button>
            </Fade>
          </div>
        </div>
        <div className="flex-grow flex justify-center mx-8 my-2 relative">
          <SavingsChartRent
            active={true}
            startYear={startYear}
            labelGroups={labelGroups}
            utilityData={rentChartData}
            maxValue={maxValue}
          />
        </div>
      </div>
    );
  }
);

const SavingsAndStabilityOwn = forwardRef<HTMLDivElement, { className?: string; in: boolean }>(
  ({ className, in: isIn }, ref) => {
    const solarRates = useSelector(getSolarRatesData);
    const localUtilityRates = useSelector(getLocalUtilityRatesData);
    const nationalUtilityRates = useSelector(getNationalUtilityRatesData);

    return (
      <div ref={ref} className="w-full h-full flex items-end">
        <div className="flex-grow flex justify-center mx-8 my-2">
          <SavingsChartOwn
            className="flex-grow"
            utilityData={localUtilityRates ?? []}
            solarData={solarRates ?? []}
            nationalAvgData={nationalUtilityRates ?? []}
          />
        </div>
      </div>
    );
  }
);
