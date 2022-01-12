import numeral from "numeral";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import styled, { useTheme } from "styled-components";

import OffsetChart from "../../../../charts/OffsetChart";
import SparklineChart from "../../../../charts/SparklineChart";
import {
  getEstimatedYearlyConsumption,
  getEstimatedYearlyProduction,
  getFirstYearConsumptionData,
  getFirstYearProductionData,
  getSolarOffset,
  getSystemSizeInKw,
} from "../../../../lib/selectors";
import { OptimizeByMetricButton } from "../../../forms/OptimizeByMetric";
import TransparentBoxLock from "./TransparentBoxLock";

interface SystemOffsetCardProps {
  open: boolean;
  locked: boolean;
}

const SystemOffsetCard = memo(({ open, locked }: SystemOffsetCardProps) => {
  const theme = useTheme();

  const prodSparkline = useSelector(getFirstYearProductionData);
  const consumptionSparkline = useSelector(getFirstYearConsumptionData);
  const offset = useSelector(getSolarOffset);

  const annualProduction = useSelector(getEstimatedYearlyProduction);
  const estimatedConsumption = useSelector(getEstimatedYearlyConsumption);

  const systemSizeKw = useSelector(getSystemSizeInKw);

  const kwhOverKw = annualProduction / systemSizeKw;

  return (
    <Wrapper>
      <TransparentBoxLock show={locked} />
      <Title>System Offset</Title>
      <Content>
        <OffsetWrapper>
          <div className="px-16 py-4 xl:p-0">
            <div className="aspect-w-1 aspect-h-1 overflow-hidden">
              <OffsetChart className="absolute inset-0" active={open} solarOffset={offset ?? 0} />
            </div>
          </div>
          <div className="text-center flex-shrink-0 py-1">
            <OptimizeByMetricButton metric="offset" className="text-center font-bold text-3xl px-6 py-1">
              {offset ?? 0}%
            </OptimizeByMetricButton>
          </div>
        </OffsetWrapper>
        <div className="flex xl:flex-col flex-wrap">
          <UsageButton
            metric="production"
            label="Production"
            value={annualProduction}
            data={prodSparkline}
            color={theme.colors.greenLight}
          />

          <h5 className="m-0 mt-n1 text-center font-bold text-cost-dark">
              {kwhOverKw.toLocaleString(undefined, {maximumFractionDigits:0}) ?? "0"} kWh/kW
          </h5>

          <UsageButton
            metric="consumption"
            label="Consumption"
            value={estimatedConsumption}
            data={consumptionSparkline}
            color={theme.colors.redLight}
          />
        </div>
      </Content>
    </Wrapper>
  );
});

export default SystemOffsetCard;

const Wrapper = styled.div.attrs({ className: "relative w-full bg-white rounded-lg p-4 text-left" })``;

const Title = styled.div.attrs({ className: "font-light text-gray-700 mb-2" })``;

const Content = styled.div.attrs({ className: "w-full h-full xl:grid xl:grid-cols-2 gap-1 pb-3" })``;

const OffsetWrapper = styled.div.attrs({ className: "mb-8 xl:mb-0 flex flex-col" })``;

const UsageButton = ({
  metric,
  label,
  value,
  data,
  color,
}: {
  metric: "production" | "consumption";
  label: string;
  value: number | null | undefined;
  data: number[] | null | undefined;
  color: string;
}) => (
  <OptimizeByMetricButton metric={metric} className="p-4 pb-0 text-center flex-auto">
    <div className="font-light text-gray-700 mb-1">{label}</div>
    <div className="font-bold text-xl mb-2">
      {numeral(value ?? 0).format("0,0")} <small className="text-sm">kWh</small>
    </div>
    <div className="flex-shrink-0 flex justify-center">
      {!!data && <SparklineChart name={label} data={data} color={color} />}
    </div>
  </OptimizeByMetricButton>
);
