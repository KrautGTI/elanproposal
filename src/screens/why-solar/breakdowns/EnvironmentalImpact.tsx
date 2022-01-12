import { FC } from "react";
import styled from "styled-components";

import { TileOptions } from "../../../types/tile-options";
import { ReactComponent as BreakdownIcon } from "../images/WhyChooseSolar--Breakdown--EcoImpact.svg";
import EnvironmentalImpactJpeg from "../images/WhyChooseSolar--EcoImpact.jpg";
import EnvironmentalImpactWebp from "../images/WhyChooseSolar--EcoImpact.webp";

const EnvironmentalImpactVideo =
  "https://d2a42xgzibz9cq.cloudfront.net/_next/static/videos/EnvironmentalImpact_896-d79f241e7dce74e155037006dea34382.mp4";

const EnvironmentalImpactBreakdown: FC = props => {
  return (
    <BreakdownWrapper className="px-6 lg:px-14 py-32 bg-white rounded-lg shadow-xl">
      <div>
        <div className="mb-8 xl:ml-0 md:flex md:items-start max-w-2xl mx-auto">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-full md:mx-0 md:h-auto md:w-auto">
            <BreakdownIcon />
          </div>
          <div className="mt-3 text-center md:mt-0 md:mx-4 md:text-left">
            <h3 className="text-4xl leading-snug font-bold text-gray-900" id="modal-headline">
              Environmental Impact
            </h3>
            <div className="mt-1">
              <p className="text-lg text-gray-600">
                “We are like tenant farmers, chopping down the fence around our house for fuel, when we should be using
                nature’s inexhaustible sources of energy—sun, wind, and tide.” - Thomas Edison
              </p>
            </div>
          </div>
        </div>
        <div className="mb-6 lg:px-12 px-4 mx-auto lg:ml-16 max-w-prose">
          <div className="text-xl lg:text-2xl font-bold text-gray-800 mb-4">Additional advantages of going solar:</div>
          <ol className="ml-4 list-decimal list-inside text-lg lg:text-xl text-gray-600">
            <li className="leading-9">Uses less water</li>
            <li className="leading-9">Reduces air pollution</li>
            <li className="leading-9">Reduces your household’s carbon footprint</li>
            <li className="leading-9">Reduce reliance on fossil fuels</li>
          </ol>
        </div>
      </div>
    </BreakdownWrapper>
  );
};

export default {
  id: "environmental-impact",
  title: "Environmental Impact",
  subtitle:
    "Your home will harvest clean energy from the sun every day while not contributing to the negative impact of global warming.",
  image: { jpg: EnvironmentalImpactJpeg, webp: EnvironmentalImpactWebp },
  video: EnvironmentalImpactVideo,
  breakdown: EnvironmentalImpactBreakdown,
} as TileOptions;

const BreakdownWrapper = styled.div`
  pointer-events: auto;
  width: 100%;
  min-height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: left;
`;
