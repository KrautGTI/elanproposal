/* eslint-disable no-template-curly-in-string */

import isEqual from "lodash/isEqual";
import { Options, SeriesOptionsType } from "highcharts";
import { Component, createRef, MutableRefObject } from "react";
import { DefaultTheme, withTheme } from "styled-components";

import { getYearsListStartingWith } from "../../../lib/dates";
import { Highchart, HighchartRefAttributes } from "../../../lib/highcharts";

const currentYear = new Date().getFullYear();

type PaymentImpactChartProps = {
  active: boolean;
  className?: string;
  solarData: number[];
  utilityData: number[];
  utilityWithOffsetData: number[];
  utilityWithOffsetLabel: string;
  years: number;
  theme: DefaultTheme;
};

type PaymentImpactChartState = {
  chartOptions: Options;
};

class PaymentImpactChart extends Component<PaymentImpactChartProps, PaymentImpactChartState> {
  highchartRef: MutableRefObject<HighchartRefAttributes | null>;
  _chart?: Highcharts.Chart;
  _reflowTimeout?: number;

  constructor(props: PaymentImpactChartProps) {
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
        credits: undefined,
        title: {
          text: undefined,
        },
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
          max: this._getMaxYValue(),
          title: {
            text: null,
          },
          labels: {
            format: "${value}",
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
        series: this._getChartSeries(false),
      },
    };
  }

  componentDidMount() {
    this._chart = this.highchartRef.current?.chart;
    this.updateChartSeries();
  }

  componentDidUpdate(prevProps: Readonly<PaymentImpactChartProps>, prevState: Readonly<PaymentImpactChartState>) {
    const activeChanged = !!prevProps.active !== !!this.props.active;
    const series1Changed = !isEqual(prevProps.utilityData, this.props.utilityData);
    const series2Changed = !isEqual(prevProps.solarData, this.props.solarData);
    const series3Changed = !isEqual(prevProps.utilityWithOffsetData, this.props.utilityWithOffsetData);

    if (activeChanged || series1Changed || series2Changed || series3Changed) {
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
        yAxis: {
          max: this.props.active ? undefined : this._getMaxYValue(),
        },
      },
    });
  };

  _getCategories = () => {
    return getYearsListStartingWith(currentYear, this.props.years).map((year, idx) => {
      if (idx % 2 === 0) {
        return year.toString();
      }
      return "";
    });
  };

  _getMaxYValue = () => {
    const highestNumber = Math.max(...this.props.utilityData, ...this.props.solarData);
    const maxYValue = highestNumber * 1.1;

    return maxYValue;
  };

  _getChartSeries = (active?: boolean): SeriesOptionsType[] => {
    const { theme, solarData, utilityWithOffsetData, utilityWithOffsetLabel, utilityData } = this.props;

    return [
      {
        type: "area",
        name: "Estimated utility payments without solar",
        data: active ? [...utilityData] : utilityData.map(x => 0),
        color: theme.colors.redLight,
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, theme.colors.redLight],
            [1, "rgba(255,255,255,0)"],
          ],
        },
      },
      {
        type: "area",
        name: "Solar payments",
        data: active ? [...solarData] : solarData.map(x => 0),
        color: theme.colors.greenLight,
        opacity: 1,
        zIndex: 2,
      },
      {
        type: "area",
        name: utilityWithOffsetLabel,
        data: active ? [...utilityWithOffsetData] : utilityWithOffsetData.map(x => 0),
        color: theme.colors.blue,
        zIndex: 3,
      },
    ];
  };
}

export default withTheme(PaymentImpactChart);
