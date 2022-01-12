/* eslint-disable no-template-curly-in-string */

import clsx from "clsx";
import toNumber from "lodash/toNumber";
import numeral from "numeral";
import { rgba } from "polished";
import { CSSProperties, FC, ReactNode, useEffect, useMemo, useRef } from "react";
import styled, { useTheme } from "styled-components";

import SpringSlider from "../components/SpringSlider";
import { getYearsListStartingWith } from "../lib/dates";
import { AreaChartSeries, Highchart, HighchartRefAttributes } from "../lib/highcharts";

interface ChartDataPoint {
  y: number;
  id: string;
}
interface ChartProps {
  className?: string;
  startYear: number;
  labelGroups: LabelGroup[];
  utilityData: number[];
  utilityLabel?: string;
  maxValue: number;
  solarData?: (number | ChartDataPoint)[];
  active: boolean;
}

interface LabelGroup {
  step: number;
  value: number;
  visible: boolean;
  renderLabel: () => ReactNode;
  className?: string;
  style?: CSSProperties;
}

const SavingsChartRent: FC<ChartProps> = ({
  className,
  startYear,
  labelGroups,
  utilityData = [],
  utilityLabel = "Local Utility Rate",
  maxValue,
  solarData = undefined,
  active = true,
}) => {
  const highchart = useRef<HighchartRefAttributes | null>(null);
  const theme = useTheme();

  const yearsCount = utilityData?.length ?? 0;
  const labels = useMemo(
    () => getYearsListStartingWith(startYear, yearsCount).map(x => x.toString()),
    [startYear, yearsCount]
  );

  const utilitySeries = useMemo<AreaChartSeries>(
    () => [
      {
        type: "area",
        name: utilityLabel,
        data: [...utilityData],
        color: theme.colors.redLight,
        borderColor: theme.colors.redLight,
        borderWidth: 20,
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, theme.colors.redLight],
            [0.5, rgba(theme.colors.redLight, 0.5)],
            [1, "rgba(255,255,255,0)"],
          ],
        },
      },
    ],
    [theme, utilityData, utilityLabel]
  );

  const solarSeries = useMemo<AreaChartSeries>(
    () => [
      {
        type: "area",
        name: "Solar",
        data: solarData ? [...solarData] : undefined,
        color: theme.colors.redLight,
        borderColor: theme.colors.redLight,
        borderWidth: 20,
        fillColor: theme.colors.primary,
      },
    ],
    [theme, solarData]
  );

  // TODO we could work on this and make it transition in a little nicer
  useEffect(() => {
    if (!highchart.current) return;

    highchart.current.chart.reflow();
  }, [active]);

  if (yearsCount === 0) {
    return null;
  }

  let visibleCount = labelGroups.filter(x => x.visible).length;

  return (
    <ChartWrapper className={clsx("w-full aspect-w-16 aspect-h-7", className)}>
      <div className="absolute inset-0 pr-3 pb-9" style={{ zIndex: 0 }}>
        <SpringSlider activeIndex={0} slidesAtOnce={visibleCount}>
          {labelGroups.map(group => (
            <div key={group.step} className={clsx("w-full h-full text-center py-4 px-6", group.className)} />
          ))}
        </SpringSlider>
      </div>
      <div className="flex">
        <Highchart
          ref={highchart}
          containerProps={{ className: "flex-grow" }}
          updateArgs={[false, true, true]}
          options={{
            chart: {
              type: "area",
              polar: false,
              inverted: false,
              backgroundColor: "transparent",
              spacing: [50, 0, 0, 0],
            },
            title: {
              text: undefined,
            },
            xAxis: {
              categories: labels,
              tickmarkPlacement: undefined,
              title: {
                text: null,
              },
              labels: {
                rotation: -45,
                overflow: "allow",
                formatter: function () {
                  // print all years if we can fit them comfortably
                  if (yearsCount < 12) {
                    return `${this.value}`;
                  }

                  // Print even years
                  return toNumber(this.value) % 2 === 0 ? `${this.value}` : "";
                },
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
              gridLineWidth: 0,
              min: 0,
              max: maxValue,
            },
            tooltip: {
              // shared: true,
              useHTML: true,
              formatter: function () {
                return `
                <div class="w-40">
                  <div class="text-sm font-bold mb-2">${this.x}</div>
                  <div class="flex justify-between">
                    <div style="color: ${this.color};">${this.series?.name}: </div>
                    <div class="font-bold">${numeral(this.y).format("$0,0")}</div>
                  </div>
                </div>
              `;
              },
            },
            legend: {
              enabled: false,
              verticalAlign: "top",
            },
            plotOptions: {
              area: {
                stacking: undefined,
                marker: {
                  enabled: false,
                },
                lineWidth: 0,
                lineColor: "transparent",
              },
            },
            series: [...utilitySeries, ...solarSeries],
            annotations: [
              {
                labels: [
                  {
                    point: "loan-complete",
                    text: "Solar Loan Paid Off",
                    style: { color: theme.colors.grayDark },
                    className: "text-gray-400",
                    borderColor: theme.colors.grayDark,
                    borderWidth: 1,
                    distance: 120,
                    shape: "connector",
                  },
                ],
              },
            ],
          }}
        />
      </div>
      <div className="absolute inset-0 pr-3 pb-9" style={{ zIndex: 50 }}>
        <SpringSlider activeIndex={0} slidesAtOnce={visibleCount}>
          {labelGroups.map(group => (
            <div key={group.step} className={clsx("w-full text-center pt-4 px-6 h-full")}>
              <div
                className={clsx(
                  "text-secondary font-bold mb-1",
                  visibleCount === 1 && "text-4xl",
                  visibleCount === 2 && "text-2xl",
                  visibleCount === 3 && "text-xl"
                )}
              >
                {numeral(group.value).format("$0,0")}
              </div>
              <div
                className={clsx(
                  "text-gray-600 font-bold",
                  visibleCount === 1 && "text-lg",
                  visibleCount === 2 && "text-sm",
                  visibleCount === 3 && "text-xs"
                )}
              >
                {group.renderLabel()}
              </div>
            </div>
          ))}
        </SpringSlider>
      </div>
    </ChartWrapper>
  );
};

const ChartWrapper = styled.div`
  .highcharts-credits {
    display: none;
  }
`;

export default SavingsChartRent;
