import clsx from "clsx";
import numeral from "numeral";
import { FC } from "react";
import { Highchart } from "../lib/highcharts";

interface SparklineChartProps {
  className?: string;
  name: string;
  data: number[];
  color: string;
}

const SparklineChart: FC<SparklineChartProps> = ({
  className,
  name: seriesName,
  data: seriesData,
  color: seriesColor,
}) => {
  if (!seriesData) {
    return null;
  }

  return (
    <Highchart
      containerProps={{
        className: clsx(className),
      }}
      options={{
        // small optimalization, saves 1-2 ms each sparkline
        skipClone: true,
        chart: {
          // backgroundColor: null,
          // borderWidth: 0,
          type: "area",
          margin: [2, 0, 2, 0],
          width: 120,
          height: 20,
          style: {
            overflow: "visible",
          },
        },
        title: {
          text: "",
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          labels: {
            enabled: false,
          },
          title: {
            text: null,
          },
          startOnTick: false,
          endOnTick: false,
          tickPositions: [],
        },
        yAxis: {
          endOnTick: false,
          startOnTick: false,
          labels: {
            enabled: false,
          },
          title: {
            text: null,
          },
          tickPositions: [0],
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          backgroundColor: "#000",
          borderWidth: 0,
          hideDelay: 400,
          shared: true,
          padding: 10,
          borderColor: "silver",
          borderRadius: 3,
          outside: true,
          headerFormat: undefined,
          useHTML: true,
          style: {
            color: "#fff",
          },
          pointFormatter: function () {
            return `<div class="text-lg">${numeral(this.y).format("0,0")} kWh</div>`;
          },
          // formatter: function (
          //   this: Highcharts.TooltipFormatterContextObject,
          //   tooltip: Highcharts.Tooltip
          // ): (string|Array<string>) {
          //     var items = this.points || splat(this),
          //         s: (string|Array<string>);

          //     // Build the header
          //     s = [tooltip.tooltipFooterHeaderFormatter(items[0])];

          //     // build the values
          //     s = s.concat(tooltip.bodyFormatter(items));

          //     // footer
          //     s.push(tooltip.tooltipFooterHeaderFormatter(items[0], true));

          //     return s;
          // },
          // formatter: function () {
          //   return `
          //     <div class="flex justify-between">
          //       <div style="color: ${this.color};">${this.series?.name}: </div>
          //       <div class="font-bold">${numeral(this.y).format("0,0")} <small class="text-sm">kWh</small></div>
          //     </div>
          // `;
          // },
        },
        plotOptions: {
          series: {
            animation: false,
            lineWidth: 1,
            shadow: false,
            states: {
              hover: {
                lineWidth: 1,
              },
            },
            marker: {
              radius: 1,
              states: {
                hover: {
                  radius: 2,
                },
              },
            },
            // fillOpacity: 0.25
            opacity: 0.6,
          },
          column: {
            negativeColor: "#910000",
            borderColor: "silver",
          },
        },
        series: [
          {
            name: seriesName,
            color: seriesColor,
            // @ts-ignore
            data: [...seriesData],
          },
        ],
      }}
    />
  );
};

export default SparklineChart;
