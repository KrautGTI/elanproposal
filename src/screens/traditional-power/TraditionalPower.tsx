import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import TitleLayout from "../../components/layouts/TitleLayout";
import Animation from "./Animation";
import { UtilityBillList } from "./UtilityBillList";

import type { DeckScreen } from "../../types";

interface TraditionalPowerStep {
  key: string;
  label: string;
  description: string;
}

export const steps: TraditionalPowerStep[] = [
  {
    key: "collection",
    label: "Collection Plant",
    description:
      "Extracting resources like coal, natural gas, and oil out of the ground. Can also come from nuclear, wind, hydro, and solar farms",
  },
  {
    key: "generation",
    label: "Generation Plant",
    description: "Burning these resources and creating power",
  },
  {
    key: "transference",
    label: "Transmission",
    description: "Transference of power from power source over long distances",
  },
  {
    key: "distribution",
    label: "Distribution",
    description: "Supplying the right amount of power where the demand is across the utility infrastructure",
  },
  {
    key: "conversion",
    label: "Conversion",
    description: "High voltage power is stepped down for smaller use through use of transformers",
  },
  {
    key: "house-solar",
    label: "Consumption",
    description:
      "The meter at each home or business tracks how much monthly usage and is billed accordingly - rates tend to fluctuate are driven by factors outside your control (Diminishing supply/increasing demand, Fuel costs, long-term debt, fixing and maintaining the infrastructure, fires, hurricanes, and other damages)",
  },
];

interface TraditionalPowerProps {
  heading?: string | undefined;
}

const lastIndex = steps.length - 1;

const TraditionalPower: DeckScreen<TraditionalPowerProps> = ({ features, heading }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentStep = useMemo(() => steps[activeIndex], [activeIndex]);

  const { printMode } = features;

  useEffect(() => {
    if (printMode) {
      setActiveIndex(lastIndex);
    }
  }, [printMode]);

  return (
    <TitleLayout title={heading ?? "Traditional Power"}>
      <Animation activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      <div className="absolute left-16 bottom-16 h-60" style={{ width: 400 }}>
        <div className="font-bold text-2xl mb-2">{currentStep.label}</div>
        <span className="text-gray-500 text-lg">{currentStep.description}</span>
      </div>
      <UtilityBillPortal>
        <UtilityBillList step={activeIndex + 1} />
      </UtilityBillPortal>
      <div className="absolute left-0 bottom-0 text-gray-500 font-bold text-xs">
        *Numbers used are for information purposes only and are not exact numbers from the customer's utility bill
      </div>
    </TitleLayout>
  );
};

export default TraditionalPower;

const UtilityBillPortal = styled.div`
  position: absolute;
  bottom: 402px;
  right: 0;
`;
