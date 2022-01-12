import Highcharts from "highcharts";
import HighchartsPatternFill from "highcharts/modules/pattern-fill";
import HighchartsReact from "highcharts-react-official";
import { FC, forwardRef } from "react";

import { HighchartRefAttributes } from "./types";

import HighChartsAnnotations from "highcharts/modules/annotations";

// Ignore these steps for SSR
if (typeof Highcharts === "object") {
  HighchartsPatternFill(Highcharts);
  HighChartsAnnotations(Highcharts);

  Highcharts.setOptions({
    chart: {
      style: {
        fontFamily: '"Product Sans", sans-serif',
      },
    },
  });
}

const Highchart: FC<HighchartsReact.Props> = forwardRef<HighchartRefAttributes, HighchartsReact.Props>((props, ref) => {
  const { callback, options, ...rest } = props;

  return <HighchartsReact ref={ref} {...rest} options={options} callback={callback} highcharts={Highcharts} />;
});

export default Highchart;
