import { SVGProps } from "react";
import styled from "styled-components";

export default function LoadingIcon({
  height,
  width,
}: {
  height: SVGProps<SVGSVGElement>["height"];
  width: SVGProps<SVGSVGElement>["width"];
}) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 60 60"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      height={height}
      width={width}
    >
      <g>
        <path
          d="M46.366326,3C47.481520,3,48.484362,3.678957,48.898535,4.714389L48.898535,4.714389L59.807626,31.987116C60.524205,33.778565,59.204866,35.727273,57.275417,35.727273L57.275417,35.727273L32.729000,35.727000L32.729000,52.090000L43.639053,52.090909C45.145284,52.090909,46.366326,53.311951,46.366326,54.818182C46.366326,56.216825,45.313489,57.369565,43.957111,57.527106L43.639053,57.545454L16.366326,57.545454C14.860095,57.545454,13.639053,56.324413,13.639053,54.818182C13.639053,53.419539,14.691890,52.266799,16.048268,52.109257L16.366326,52.090909L27.275000,52.090000L27.275000,35.727000L2.729962,35.727273C0.858982,35.727273,-0.438306,33.894879,0.138178,32.150350L0.197753,31.987116L5.635700,18.391211C5.641986,18.374743,5.648427,18.358352,5.655022,18.342040L11.106844,4.714389C11.521017,3.678957,12.523859,3,13.639053,3L13.639053,3ZM6.755417,30.272727L27.275000,30.272000L27.275000,22.090000L10.028000,22.090000L6.755417,30.272727ZM49.974000,22.090000L32.729000,22.090000L32.729000,30.272000L53.247235,30.272727L49.974000,22.090000ZM47.792000,16.636000L44.519962,8.454545L32.729000,8.454000L32.729000,16.636000L47.792000,16.636000ZM27.275000,8.454000L15.482690,8.454545L12.209000,16.636000L27.275000,16.636000L27.275000,8.454000Z"
          fill="rgb(242,184,128)"
          stroke="none"
          strokeWidth="1"
        />
        <polyline
          id="loaderLine"
          points="45.127248,54.818182 30.002690,54.818182 30.002690,33 2.729962,33 13.639053,5.727273 46.366326,5.727273 57.275417,33 28.181017,33"
          fill="none"
          fillRule="evenodd"
          stroke="rgb(234,140,52)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDashoffset="60"
          strokeDasharray="60,200"
        />
      </g>
    </Svg>
  );
}

const Svg = styled.svg`
  #loaderLine {
    animation: loaderLine_anim 3000ms linear infinite normal backwards;
  }
  @keyframes loaderLine_anim {
    0% {
      stroke-dashoffset: 60;
    }
    100% {
      stroke-dashoffset: 595;
    }
  }
`;
