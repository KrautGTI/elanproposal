/* eslint-disable no-template-curly-in-string */

import isEqual from "lodash/isEqual";
import range from "lodash/range";
import numeral from "numeral";
import { Options, SeriesOptionsType } from "highcharts";
import { Component, createRef, MutableRefObject } from "react";
import { DefaultTheme, withTheme } from "styled-components";

import { Highchart, HighchartRefAttributes } from "../../../lib/highcharts";

type SavingsImpactChartProps = {
  active: boolean;
  className?: string;
  solarData: number[];
  utilityData: number[];
  utilityWithOffsetData: number[];
  utilityWithOffsetLabel: string;
  years: number;
  theme: DefaultTheme;
};

type SavingsImpactChartState = {
  chartOptions: Options;
};

class SavingsImpactChart extends Component<SavingsImpactChartProps, SavingsImpactChartState> {
  highchartRef: MutableRefObject<HighchartRefAttributes | null>;
  _chart?: Highcharts.Chart;
  _reflowTimeout?: number;

  constructor(props: SavingsImpactChartProps) {
    super(props);

    this.highchartRef = createRef<HighchartRefAttributes>();

    this.state = {
      chartOptions: {
        chart: {
          type: "area",
          polar: false,
          inverted: false,
          spacing: [0, 0, 0, 0],
        },
        title: {
          text: undefined,
        },
        credits: undefined,
        xAxis: {
          categories: this._getCategories(),
          tickmarkPlacement: "on",
          title: {
            text: null,
          },
          labels: {
            autoRotation: undefined,
            overflow: "allow",
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: null,
          },
          labels: {
            format: "${value}",
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
                <td class="text-lg text-right">${numeral(this.y).format("$0,0")}</td>
              </tr>
            `;
          },
          footerFormat: "</table>",
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
        series: this._getChartSeries(false),
      },
    };
  }

  componentDidMount() {
    this._chart = this.highchartRef.current?.chart;
    this.updateChartSeries();
  }

  componentDidUpdate(prevProps: Readonly<SavingsImpactChartProps>, prevState: Readonly<SavingsImpactChartState>) {
    const activeChanged = !!prevProps.active !== !!this.props.active;
    const utilityDataChanged = !isEqual(prevProps.utilityData, this.props.utilityData);
    const solarDataChanged = !isEqual(prevProps.solarData, this.props.solarData);
    const utilityWithOffsetDataChanged = !isEqual(prevProps.utilityWithOffsetData, this.props.utilityWithOffsetData);

    if (activeChanged || utilityDataChanged || solarDataChanged || utilityWithOffsetDataChanged) {
      this.updateChartSeries();
    }
  }

  render() {
    return (
      <Highchart
        ref={this.highchartRef}
        containerProps={{ className: this.props.className }}
        options={this.state.chartOptions}
      />
    );
  }

  updateChartSeries = () => {
    this.setState({
      chartOptions: {
        series: this._getChartSeries(this.props.active),
      },
    });
  };

  _getCategories = () => {
    return range(1, this.props.years + 1).map(yrNum => `Yr ${yrNum}`);
  };

  _getChartSeries = (active?: boolean): SeriesOptionsType[] => {
    const { theme, solarData, utilityWithOffsetData, utilityWithOffsetLabel, utilityData } = this.props;

    const estimatedSavingsData = utilityData?.map((compoundedUtilityRate, i) => {
      return compoundedUtilityRate - (solarData?.[i] ?? 0) - (utilityWithOffsetData?.[i] ?? 0);
    });

    return [
      {
        type: "spline",
        name: "Forecasted Utility Cost",
        data: [...utilityData],
        color: theme.colors.redLight,
        marker: {
          enabled: false,
        },
        zIndex: 4,
      },
      {
        type: "area",
        name: utilityWithOffsetLabel,
        data: [...utilityWithOffsetData],
        color: "#24bee3",
        zIndex: 3,
      },
      {
        name: "Cost of Solar",
        color: theme.colors.grayDark,
        data: [...solarData],
        type: "area",
        zIndex: 2,
        fillOpacity: 1,
      },
      {
        name: "Solar Savings",
        color: theme.colors.savings,
        data: [...utilityData],
        type: "area",
        zIndex: 1,
        fillOpacity: 0.8,
        tooltip: {
          pointFormatter: () => "",
        },
      },
      {
        name: "Estimated Savings",
        color: theme.colors.savings,
        data: [...(estimatedSavingsData ?? [])],
        type: "line",
        zIndex: 0,
        showInLegend: false,
        opacity: 0,
      },
    ];
  };
}

export default withTheme(SavingsImpactChart);
