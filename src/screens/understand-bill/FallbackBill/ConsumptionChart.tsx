import numeral from "numeral";
import { memo, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getAllShortMonthNames } from "../../../lib/dates";

import { Highchart } from "../../../lib/highcharts";
import { getFirstYearConsumptionData } from "../../../lib/selectors";

const shiftArray = (items: any[] = [], index): any[] => {
  return [...items.slice(index, items.length), ...items.slice(0, index)];
};

const ConsumptionChart = () => {
  const consumptionFirstYear = useSelector(getFirstYearConsumptionData);

  const monthNames = useMemo(() => getAllShortMonthNames(), []);

  const data = useMemo(() => {
    const d = new Date();
    const currentMonth = d.getMonth();

    // If last month was December, consumption is already Jan - Dec
    if (currentMonth === 0) {
      return consumptionFirstYear;
    }

    return shiftArray(consumptionFirstYear, currentMonth);
  }, [consumptionFirstYear]);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;

    let timeoutId = window.setTimeout(() => {
      setReady(true);
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <Highchart
      containerProps={{ className: "w-full" }}
      options={{
        chart: {
          type: "column",
          height: "30%",
        },
        title: {
          text: "",
        },
        credits: undefined,
        xAxis: {
          categories: monthNames,
          labels: {
            style: {
              fontSize: "16px",
            },
          },
        },
        yAxis: {
          title: undefined,
          labels: {
            style: {
              fontSize: "14px",
            },
          },
        },
        plotOptions: {
          column: {
            borderRadiusTopLeft: 5,
            borderRadiusTopRight: 5,
          },
          series: {
            stickyTracking: false,
            dataLabels: {
              padding: 0,
              style: {
                textOutline: "none",
                fontSize: "0.75rem",
              },
            },
          },
        },
        tooltip: {
          enabled: false,
        },
        series: [
          {
            type: "column",
            name: "Consumption",
            data: data?.map((item, index) => {
              const isOlderData = index <= 4;
              let color = "#32D094";

              if (isOlderData) {
                color = "#DBE2E7";
              } else if (index === data.length - 1) {
                color = "#32BCD0";
              }

              return {
                y: item,
                dataLabels: {
                  enabled: !isOlderData,
                  formatter: function (_chart) {
                    return numeral(this.y).format("0,0");
                  },
                  color: "#9ca3af",
                },
                color,
              };
            }),
            showInLegend: false,
            states: {
              hover: { enabled: false },
            },
          },
        ],
      }}
    />
  );
};

export default memo(ConsumptionChart);
