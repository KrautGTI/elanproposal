/* eslint-disable no-template-curly-in-string */

import type { SeriesOptionsType } from "highcharts";
import clsx from "clsx";
import take from "lodash/take";
import { FC, useMemo } from "react";
import styled, { useTheme } from "styled-components";

import { getYearsListStartingWith } from "../lib/dates";
import { Highchart } from "../lib/highcharts";

interface ChartProps {
  className?: string;
  utilityData: number[];
  utilityLabel?: string;
  solarData: number[];
  solarLabel?: string;
  nationalAvgData?: number[];
  nationalAvgLabel?: string;
}

const currentYear = new Date().getFullYear();
const GRAPH_LENGTH = 25;

const SavingsChartOwn: FC<ChartProps> = ({
  className,
  utilityData = [],
  utilityLabel = "Local Utility Rate",
  solarData = [],
  solarLabel = "Solar Rate",
  nationalAvgData = [],
  nationalAvgLabel = "National Avg.",
}) => {
  const labels = useMemo(() => getYearsListStartingWith(currentYear, 30).map(x => x.toString()), []);
  const theme = useTheme();

  const series = useMemo<SeriesOptionsType[]>(
    () => [
      {
        type: "area",
        name: utilityLabel,
        data: [...utilityData],
        color: theme.colors.redLight,
        fillColor: theme.colors.redLight,
      },
      {
        type: "area",
        name: nationalAvgLabel,
        data: [...nationalAvgData],
        color: theme.colors.grayDark,
        fillColor: theme.colors.grayDark,
        visible: false,
      },
      {
        type: "area",
        name: solarLabel,
        data: [...solarData],
        color: theme.colors.greenLight,
        fillColor: theme.colors.greenLight,
      },
    ],
    [theme, utilityLabel, utilityData, solarData, solarLabel, nationalAvgData, nationalAvgLabel]
  );

  return (
    <ChartWrapper
      className={clsx("flex-grow flex-shink-0 aspect-w-16 aspect-h-7", className)}
      style={{ maxHeight: 400 }}
    >
      <Highchart
        containerProps={{ className: "flex-grow" }}
        options={{
          chart: {
            type: "area",
            polar: false,
            inverted: false,
            spacing: [0, 0, 0, 0],
          },
          title: {
            text: undefined,
          },
          xAxis: {
            categories: take(labels as string[], GRAPH_LENGTH),
            tickmarkPlacement: "on",
            title: {
              text: null,
            },
            labels: {
              // autoRotation: false,
              overflow: "allow",
            },
          },
          yAxis: {
            title: {
              text: null,
            },
            labels: {
              enabled: false,
              // format: "${value}",
            },
          },
          tooltip: {
            split: true,
            valuePrefix: "$",
          },
          legend: {
            verticalAlign: "top",
          },
          plotOptions: {
            area: {
              stacking: undefined,
              marker: {
                enabled: false,
              },
            },
          },
          series,
        }}
      />
    </ChartWrapper>
  );
};

const ChartWrapper = styled.div`
  .highcharts-credits {
    display: none;
  }
`;

export default SavingsChartOwn;
