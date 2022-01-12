import { Options, SeriesOptionsType } from "highcharts";
import { Component, createRef, MutableRefObject } from "react";
import { connect } from "react-redux";
import { DefaultTheme, withTheme } from "styled-components";

import { Highchart, HighchartRefAttributes } from "../lib/highcharts";
import { selectDeckFeatureFlags } from "../lib/selectors";

type OffsetChartProps = {
  active?: boolean;
  className?: string;
  solarOffset?: number;
  theme?: DefaultTheme;
  isStatic?: boolean;
  borderWidth?: number;
  backgroundColor?: string;
};

type OffsetChartState = {
  chartOptions: Options;
};

class OffsetChart extends Component<OffsetChartProps, OffsetChartState> {
  highchartRef: MutableRefObject<HighchartRefAttributes | null>;
  _chart?: Highcharts.Chart;
  _reflowTimeout?: number;

  constructor(props: OffsetChartProps) {
    super(props);

    this.highchartRef = createRef<HighchartRefAttributes>();

    this.state = {
      chartOptions: {
        chart: {
          plotBackgroundColor: undefined,
          plotBorderWidth: undefined,
          plotShadow: false,
          type: "pie",
          backgroundColor: this.props.backgroundColor ?? undefined,
        },
        title: {
          text: "",
        },
        credits: undefined,
        tooltip: {
          pointFormat: "{series.name}: <b>{point.percentage:.0f}%</b>",
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            borderWidth: this.props.borderWidth ?? 1,
            dataLabels: {
              enabled: false,
            },
          },
        },
        legend: {
          enabled: false,
        },
        series: this._getChartSeries(0),
      },
    };
  }

  componentDidMount() {
    this._chart = this.highchartRef.current?.chart;

    this.setState({
      chartOptions: {
        series: this._getChartSeries(this.props.solarOffset ?? 0),
      },
    });
  }

  getSnapshotBeforeUpdate() {
    let shouldReflow = false;

    if (this._chart) {
      if (
        typeof this._chart["containerHeight"] === "undefined" ||
        typeof this._chart["containerWidth"] === "undefined"
      ) {
        console.warn(
          "Check to see if containerHeight and containerWidth were deprecated? " +
            "They are not part of TS types as of time of writing."
        );
      }

      if (this._chart.chartHeight && this._chart.chartWidth) {
        const heightDiffers = this._chart["containerHeight"] !== this._chart.chartHeight;
        const widthDiffers = this._chart["containerWidth"] !== this._chart.chartWidth;

        shouldReflow = heightDiffers || widthDiffers;
      }
    }

    return { shouldReflow };
  }

  componentDidUpdate(prevProps: Readonly<OffsetChartProps>, prevState: Readonly<OffsetChartState>, { shouldReflow }) {
    const offsetChanged = prevProps.solarOffset !== this.props.solarOffset;
    const activeChanged = !!prevProps.active !== !!this.props.active;
    const isStaticChanged = !!prevProps.isStatic !== !!this.props.isStatic;

    if (activeChanged) {
      if (this.props.active) {
        this.updateChartSeries(this.props.solarOffset ?? 0);
      } else {
        this.updateChartSeries(0);
      }
    } else if (offsetChanged) {
      this.updateChartSeries(this.props.solarOffset ?? 0);
    }

    const isStaticNow = isStaticChanged && this.props.isStatic;

    if (shouldReflow || isStaticNow) {
      this._scheduleReflow();
    }
  }

  componentWillUnmount() {
    this._cancelReflow();
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

  updateChartSeries = (solarOffset: number) => {
    this.setState({
      chartOptions: {
        series: this._getChartSeries(solarOffset),
      },
    });
  };

  _getChartSeries = (solarOffset: number): SeriesOptionsType[] => {
    const utilityOffset = Math.max(0, 100 - solarOffset);

    return [
      {
        name: "Offset",
        data: [
          { name: "Solar", y: solarOffset, color: this.props.theme?.colors.offsetChartSolar },
          { name: "Utility", y: utilityOffset, color: this.props.theme?.colors.offsetChartUtility },
        ],
        type: "pie",
        startAngle: 0,
      },
    ];
  };

  _scheduleReflow = () => {
    this._cancelReflow();
    this._reflowTimeout = window.setTimeout(() => {
      this._chart?.reflow();
    }, 500);
  };

  _cancelReflow = () => {
    if (this._reflowTimeout) {
      window.clearTimeout(this._reflowTimeout);
    }
  };
}

const connector = connect(state => {
  return {
    isStatic: selectDeckFeatureFlags(state).printMode,
  };
});

export default withTheme(connector(OffsetChart));
