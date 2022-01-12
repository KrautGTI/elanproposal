import { SeriesColumnOptions } from "highcharts";
import range from "lodash/range";
import numeral from "numeral";
import { FC, useEffect, useMemo, useRef } from "react";
import { useTheme } from "styled-components";
import { usePrevious } from "../../hooks/usePrevious";

import { getAllShortMonthNames } from "../../lib/dates";
import { Highchart, HighchartRefAttributes } from "../../lib/highcharts";

interface UtilityCostComparisonChartProps {
  className?: string;
  active: boolean;
  firstYearData: number[];
  futureYearData: number[];
  futureYear: number;
  max?: number;
}

function findIndicesOfMax(inp: number[] | undefined, count: number) {
  if (!inp) return [];
  let outp: number[] = [];
  for (let i = 0; i < inp.length; i++) {
    outp.push(i); // add index to output array
    if (outp.length > count) {
      outp.sort(function (a, b) {
        return inp[b] - inp[a];
      }); // descending sort the output array
      outp.pop(); // remove the last index (index of smallest element in output array)
    }
  }
  return outp;
}

const currentYear = new Date().getFullYear();

const ComparisonChart: FC<UtilityCostComparisonChartProps> = ({
  className,
  active,
  firstYearData,
  futureYearData,
  futureYear,
  max,
}) => {
  const theme = useTheme();
  const ref = useRef<HighchartRefAttributes>();

  const categories = useMemo(() => getAllShortMonthNames(), []);

  const isIndexAccented = useMemo<(idx: number) => boolean>(() => {
    // memoize this expensive-ish loop and return a callback to get a boolean from the index
    const highestThreeMonths = findIndicesOfMax(futureYearData, 3);
    return (idx: number) => !!highestThreeMonths.includes(idx);
  }, [futureYearData]);

  const accentColor = theme.colors.costDark;
  const defaultColor = theme.colors.grayDark;
  const showSecondSeries = futureYear !== currentYear;

  const colors = useMemo(
    () =>
      range(0, 12).map(idx => {
        if (isIndexAccented(idx)) return accentColor;
        return defaultColor;
      }),
    [accentColor, defaultColor, isIndexAccented]
  );

  const prevFutureYear = usePrevious(futureYear);
  const prevActive = usePrevious(active);
  const changed =
    (typeof prevFutureYear !== "undefined" && prevFutureYear !== futureYear) ||
    (typeof prevActive !== "undefined" && prevActive !== active);

  useEffect(() => {
    if (!changed) return;
    if (!ref.current?.chart) return;

    const chart = ref.current.chart;

    chart.series[0].update(
      {
        color: showSecondSeries ? theme.colors.grayLight : undefined,
        colorByPoint: showSecondSeries ? false : true,
      } as SeriesColumnOptions,
      false
    );

    // Do manipulations with redraw = false, then call redraw below
    chart.series[0].setData([...firstYearData], false, true, true);
    chart.series[1].setData([...futureYearData], false, true, true);
    chart.series[1].setVisible(showSecondSeries, false);

    chart.redraw(true);
  }, [firstYearData, futureYearData, showSecondSeries, changed, theme]);

  return (
    <Highchart
      ref={ref}
      containerProps={{ className }}
      allowChartUpdate={false}
      options={{
        chart: {
          type: "column",
          animation: true,
        },
        title: {
          text: "",
        },
        credits: undefined,
        xAxis: {
          categories,
          crosshair: true,
          labels: {
            style: {
              fontSize: "16px",
            },
          },
        },
        yAxis: {
          title: undefined,
          min: 0,
          max,
          labels: {
            formatter: function (_chart) {
              return numeral(this.value).format("$0,0");
            },
            style: {
              fontSize: "1.25rem",
            },
          },
        },
        tooltip: {
          headerFormat: '<div class="mb-3 text-base">{point.key}</div><table>',
          pointFormat:
            '<tr><td class="text-gray-800 p-0">{series.name}: </td>' +
            '<td class="py-0 pr-0 pl-2"><b>{point.y}</b></td></tr>',
          valuePrefix: "$",
          valueDecimals: 0,
          footerFormat: "</table>",
          shared: true,
          useHTML: true,
        },
        plotOptions: {
          column: {
            colors,
            borderRadiusTopLeft: 5,
            borderRadiusTopRight: 5,
            dataLabels: {
              enabled: true,
              formatter: function (_chart) {
                return numeral(this.y).format("$0,0");
              },
              color: theme.colors.grayDark,
              style: {
                textOutline: "none",
                fontSize: "0.75rem",
              },
              // align: "center",
              // verticalAlign: "center",
            },
          },
        },
        series: [
          {
            // animation: false,
            type: "column",
            name: currentYear.toString(),
            data: [...firstYearData],
            showInLegend: false,
            colorByPoint: showSecondSeries ? false : true,
            color: showSecondSeries ? theme.colors.grayLight : undefined,
          },
          {
            visible: showSecondSeries,
            type: "column",
            name: futureYear.toString(),
            data: [...futureYearData],
            showInLegend: false,
            colorByPoint: true,
          },
        ] as SeriesColumnOptions[],
      }}
    />
  );
};

export default ComparisonChart;
