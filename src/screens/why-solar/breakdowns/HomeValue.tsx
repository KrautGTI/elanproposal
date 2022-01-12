import { FC } from "react";
import styled from "styled-components";

import { TileOptions } from "../../../types/tile-options";
import { ReactComponent as BreakdownIcon } from "../images/WhyChooseSolar--Breakdown--HomeValue.svg";
import TileJpg from "../images/WhyChooseSolar--SelfReliance.jpg";
import TileWebp from "../images/WhyChooseSolar--SelfReliance.webp";

const HomeValueBreakdown: FC = props => (
  <BreakdownWrapper className="px-6 lg:px-14 py-14 bg-white rounded-lg shadow-xl items-start justify-center">
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 xl:ml-0 md:flex md:items-start">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-full md:mx-0 md:h-auto md:w-auto">
          <BreakdownIcon />
        </div>
        <div className="mt-3 text-center md:mt-0 md:mx-4 md:text-left">
          <h3 className="text-4xl leading-snug font-bold text-gray-900" id="modal-headline">
            Home Value
          </h3>
          <div className="mt-1">
            <p className="text-lg lg:text-xl text-gray-600 leading-normal max-w-prose">
              Solar is classified as a home improvement; it is an energy producing asset on the home. There are a few
              calculations when determining the value of homes with solar:
            </p>
          </div>
        </div>
      </div>
      <div className="mb-6 px-4 max-w-prose">
        {items.map((stat, i) => (
          <div key={i} className={`py-4 ${i === items.length - 1 ? "pb-0" : ""}`}>
            <div className="text-lg xl:text-xl font-bold text-gray-800 mb-1">{stat.title}</div>
            <div className="text-md xl:text-lg text-gray-600 leading-snug">{stat.description}</div>
          </div>
        ))}
      </div>
    </div>
  </BreakdownWrapper>
);

export default {
  id: "home-value",
  title: "Home Value",
  subtitle: "According to Zillow, on average, a solar home adds 4.1% to the value of a home",
  image: { jpg: TileJpg, webp: TileWebp },
  breakdown: HomeValueBreakdown,
} as TileOptions;

const BreakdownWrapper = styled.div`
  pointer-events: auto;
  width: 100%;
  min-height: 90%;
  display: flex;
  flex-direction: column;
  text-align: left;
`;

interface HomeValueItem {
  title: string;
  description: string;
}

const items: HomeValueItem[] = [
  {
    title: "SOLAR PRODUCTION",
    description: "What the system’s actual yearly production is.",
  },
  {
    title: "CURRENT COST OF GRID POWER",
    description:
      "What the avoided cost of the utility is by having converted to solar energy.  In other words, what is the cost of current power rates if there wasn’t solar installed at the property.",
  },
  {
    title: "SYSTEM COST",
    description: "What is left to have the solar system paid completely off.",
  },
  {
    title: "COMPARABLES",
    description: "What is the relative value of homes that also have solar sold for in the area.",
  },
];
