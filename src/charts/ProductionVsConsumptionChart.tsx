import clsx from "clsx";
import numeral from "numeral";
import { FC, memo, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "styled-components";

import { getAllShortMonthNames } from "../lib/dates";
import { Highchart, HighchartRefAttributes } from "../lib/highcharts";
import { getFirstYearConsumptionData, getFirstYearProductionData } from "../lib/selectors";

interface ProductionVsConsumptionChartProps {
  active?: boolean;
  className?: string;
}

const ProductionVsConsumptionChart: FC<ProductionVsConsumptionChartProps> = ({ active, className }) => {
  const ref = useRef<HighchartRefAttributes>();
  const theme = useTheme();

  const monthNames = useMemo(() => getAllShortMonthNames(), []);
  const solarProductionFirstYear = useSelector(getFirstYearProductionData);
  const consumptionFirstYear = useSelector(getFirstYearConsumptionData);

  const highestNumber = useMemo(
    () => Math.max(...solarProductionFirstYear, ...consumptionFirstYear),
    [solarProductionFirstYear, consumptionFirstYear]
  );

  const maxYValue = highestNumber * 1.1;

  useEffect(() => {
    const chart = ref.current?.chart;
    if (!chart) return;
    const series1 = active ? [...solarProductionFirstYear] : solarProductionFirstYear.map(_ => 0);
    const series2 = active ? [...consumptionFirstYear] : consumptionFirstYear.map(_ => 0);
    chart.series[0].setData(series1, false, false, true);
    chart.series[1].setData(series2, false, false, true);
    chart.update({ yAxis: { max: active ? undefined : maxYValue } }, false);

    chart.redraw(true);
  }, [active, maxYValue, solarProductionFirstYear, consumptionFirstYear]);

  return (
    <Highchart
      ref={ref}
      allowChartUpdate={false}
      containerProps={{
        className: clsx(className),
        "data-cy": "production-vs-consumption-chart",
      }}
      options={{
        chart: {
          height: "50%",
        },
        title: {
          text: "",
        },
        credits: undefined,
        xAxis: {
          categories: monthNames,
        },
        yAxis: {
          title: undefined,
          min: 0,
          max: maxYValue,
        },
        legend: {
          itemStyle: {
            fontSize: "20px",
          },
        },
        plotOptions: {
          series: {
            // stickyTracking: false,
          },
        },
        tooltip: {
          // split: true,
          shared: true,
          useHTML: true,
          // formatter: function () {
          //   return numeral(this.y).format("$0,0");
          // },
          headerFormat: `<strong class="text-base">{point.key}</strong><table>`,
          pointFormatter: function () {
            return `
              <tr>
                <td class="text-2xl pr-1" style="color:${this.color}">●</td>
                <td class="text-lg pr-4">${this.series.name}</td>
                <td class="text-lg text-right">${numeral(this.y).format("0,0")} kWh</td>
              </tr>
            `;
          },
          footerFormat: "</table>",
        },
        series: [
          {
            type: "spline",
            name: "Solar Production",
            data: [...solarProductionFirstYear],
            color: theme.colors.savingsDark,
            lineWidth: 6,
            marker: {
              lineColor: theme.colors.savingsDark,
              fillColor: theme.colors.savingsDark,
              symbol: "circle",
            },
          },
          {
            type: "column",
            name: "Energy Consumption",
            data: [...consumptionFirstYear],
            color: theme.colors.consumption,
          },
        ],
      }}
    />
  );
};

export default memo(ProductionVsConsumptionChart);
