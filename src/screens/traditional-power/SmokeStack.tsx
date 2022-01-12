import { forwardRef, SVGProps } from "react";
import styled from "styled-components";

interface SmokeStackProps {
  className?: string;
}

const SmokeStack = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement> & SmokeStackProps>((props, ref) => {
  return (
    <Svg
      id="smokeStack"
      xmlns="http://www.w3.org/2000/svg"
      width="58.846"
      height="31.387"
      viewBox="0 0 58.846 31.387"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      {...props}
      ref={ref}
    >
      <g id="smokeClouds" transform="translate(-90.526 -4.074)">
        <path
          id="s2c5"
          d="M4.183,2.706c1.531,0,4.929-.961,4.4-1.907S4.756.307,3.225.307c-.745,0-.5-.691-1.93,0S0,1.218,0,1.421C0,1.818,2.652,2.706,4.183,2.706Z"
          transform="translate(131.661 32.756)"
          fill="#384550"
          opacity="0.477"
        />
        <path
          id="s2c4"
          d="M8.029,3.647c1.924,0,.5-1.083,4.093-1.279s2.947-.421,2.947-.83C15.068.745,11.85.1,7.881.1S-2.037-.57.693,1.539,4.059,3.647,8.029,3.647Z"
          transform="translate(127.963 28.648)"
          fill="#384550"
          opacity="0.477"
        />
        <path
          id="s2c3"
          d="M11.348,4.709c2.387.3,12.747.572,10.781-2.471-.563-.871-3.142.093-6.339-.428C13.027,1.36,15.314,0,9.359,0S3.811.455.567,2.238,8.961,4.408,11.348,4.709Z"
          transform="translate(124.496 22.918)"
          fill="#384550"
          opacity="0.477"
        />
        <path
          id="s2c2"
          d="M13.394,7.188c7.939,0,10.49-2.106,10.49-3.269,0-.834,3.405-3.572-1.4-3.913-1.893-.134-6.848,2.131-9.092,2.131-2.345,0-7.637-.906-9.592-.76C-.863,1.724-.666,4.322,1.363,4.889,4.492,5.762,5.455,7.188,13.394,7.188Z"
          transform="translate(122.449 14.375)"
          fill="#384550"
          opacity="0.7"
        />
        <path
          id="s2c1"
          d="M-7.479,8.863c-9.527,0-12.588-2.527-12.588-3.922,0-1-4.086-4.287,1.677-4.7C-16.119.084-10.172,2.8-7.479,2.8-6.094,2.8-3.551.492-1.353.245-.334.131,4.483-.437,6.958.682,10,2.055,10.408,5.248,6.958,6.1,3.018,7.084,2.048,8.863-7.479,8.863Z"
          transform="translate(139.978 4.074)"
          fill="#384550"
        />
        <path
          id="s1c5"
          d="M4.183,2.706c1.531,0,4.929-.961,4.4-1.907S4.756.307,3.225.307c-.745,0-.5-.691-1.93,0S0,1.218,0,1.421C0,1.818,2.652,2.706,4.183,2.706Z"
          transform="translate(98.599 32.756)"
          fill="#384550"
          opacity="0.3"
        />
        <path
          id="s1c4"
          d="M8.029,3.647c1.924,0,.5-1.083,4.093-1.279s2.947-.421,2.947-.83C15.068.745,11.85.1,7.881.1S-2.037-.57.693,1.539,4.059,3.647,8.029,3.647Z"
          transform="translate(94.9 28.648)"
          fill="#384550"
          opacity="0.5"
        />
        <path
          id="s1c3"
          d="M10.021,4.158c2.108.266,11.257.505,9.521-2.182-.5-.769-2.775.082-5.6-.378C11.5,1.2,13.524,0,8.265,0S3.366.4.5,1.977,7.914,3.892,10.021,4.158Z"
          transform="translate(92.741 23.489)"
          fill="#384550"
          opacity="0.6"
        />
        <path
          id="s1c2"
          d="M12.081,5.755c6.351,0,9.893-.429,9.893-1.359C21.975,3.73,23.2.283,19.355.01c-1.514-.107-5.478,1.7-7.274,1.7-1.876,0-8.06-1.826-9.625-1.709C-1.276.284-.06,5.3,1.564,5.755,4.067,6.454,5.73,5.755,12.081,5.755Z"
          transform="translate(90.526 15.807)"
          fill="#384550"
          opacity="0.7"
        />
        <path
          id="s1c1"
          d="M-5.7,7.622c-6.18,0-8.166-1.64-8.166-2.545,0-.649,0-5.077,4.145-5.077,5.7,0,6.569,2.191,8,2.031.661-.074,4.8-1.248,6.77-.357s.859,3.6-1.379,4.159C1.109,6.468.481,7.622-5.7,7.622Z"
          transform="translate(105.643 6.753)"
          fill="#384550"
        />
      </g>
    </Svg>
  );
});

export default SmokeStack;

const Svg = styled.svg`
  #s2c5 {
    animation: e6c1v1mu44lb3_c_o 4000ms linear infinite normal forwards;
  }
  @keyframes e6c1v1mu44lb3_c_o {
    0% {
      opacity: 0;
    }
    15% {
      opacity: 1;
    }
    32.500000% {
      opacity: 1;
    }
    45% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
  #s2c4 {
    animation: e6c1v1mu44lb4_c_o 4000ms linear infinite normal forwards;
  }
  @keyframes e6c1v1mu44lb4_c_o {
    0% {
      opacity: 0;
    }
    7.500000% {
      opacity: 0;
    }
    22.500000% {
      opacity: 1;
    }
    37.500000% {
      opacity: 1;
    }
    47.500000% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
  #s2c3 {
    animation: e6c1v1mu44lb5_c_o 4000ms linear infinite normal forwards;
  }
  @keyframes e6c1v1mu44lb5_c_o {
    0% {
      opacity: 0;
    }
    15% {
      opacity: 0;
    }
    30% {
      opacity: 1;
    }
    42.500000% {
      opacity: 1;
    }
    52.500000% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
  #s2c2 {
    animation: e6c1v1mu44lb6_c_o 4000ms linear infinite normal forwards;
  }
  @keyframes e6c1v1mu44lb6_c_o {
    0% {
      opacity: 0;
    }
    22.500000% {
      opacity: 0;
    }
    37.500000% {
      opacity: 1;
    }
    55% {
      opacity: 1;
    }
    62.500000% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
  #s2c1 {
    animation: e6c1v1mu44lb7_c_o 4000ms linear infinite normal forwards;
  }
  @keyframes e6c1v1mu44lb7_c_o {
    0% {
      opacity: 0;
    }
    30% {
      opacity: 0;
    }
    45% {
      opacity: 1;
    }
    60% {
      opacity: 1;
    }
    70% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
  #s1c5 {
    animation: e6c1v1mu44lb8_c_o 4000ms linear infinite normal forwards;
  }
  @keyframes e6c1v1mu44lb8_c_o {
    0% {
      opacity: 0;
    }
    20% {
      opacity: 0;
    }
    35% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    60% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
  #s1c4 {
    animation: e6c1v1mu44lb9_c_o 4000ms linear infinite normal forwards;
  }
  @keyframes e6c1v1mu44lb9_c_o {
    0% {
      opacity: 0;
    }
    30% {
      opacity: 0;
    }
    45% {
      opacity: 1;
    }
    62.500000% {
      opacity: 1;
    }
    70% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
  #s1c3 {
    animation: e6c1v1mu44lb10_c_o 4000ms linear infinite normal forwards;
  }
  @keyframes e6c1v1mu44lb10_c_o {
    0% {
      opacity: 0;
    }
    37.500000% {
      opacity: 0;
    }
    52.500000% {
      opacity: 1;
    }
    67.500000% {
      opacity: 1;
    }
    77.500000% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
  #s1c2 {
    animation: e6c1v1mu44lb11_c_o 4000ms linear infinite normal forwards;
  }
  @keyframes e6c1v1mu44lb11_c_o {
    0% {
      opacity: 0;
    }
    45% {
      opacity: 0;
    }
    60% {
      opacity: 1;
    }
    72.500000% {
      opacity: 1;
    }
    82.500000% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
  #s1c1 {
    animation: e6c1v1mu44lb12_c_o 4000ms linear infinite normal forwards;
  }
  @keyframes e6c1v1mu44lb12_c_o {
    0% {
      opacity: 0;
    }
    52.500000% {
      opacity: 0;
    }
    67.500000% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    92.500000% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
`;
