import { FC } from "react";
import styled from "styled-components";

import WhatsNextJpeg from "../images/WhyChooseSolar--OwnYourPower.jpg";
import WhatsNextWebp from "../images/WhyChooseSolar--OwnYourPower.webp";
import { TileOptions } from "../../../../types/tile-options";

const OwnYourPower: FC = () => (
  <BreakdownWrapper className="px-6 lg:px-14 py-14 bg-white rounded-lg shadow-xl">
    <div className="grid grid-cols-2 pb-24">
      <div className="mb-8 xl:ml-0 md:flex md:items-start max-w-2xl mx-auto">
        <div className="mt-3 text-center md:mt-0 md:mx-4 md:text-left">
          <h3 className="text-3xl lg:text-4xl leading-snug font-bold text-gray-900" id="modal-headline">
            Own your own power.
          </h3>
          <div className="mt-1 pr-16">
            <p className="text-lg lg:text-xl text-gray-600 leading-normal max-w-prose">
              Instead of having a variable bill that fluctuates all the time, have a steady and fixed, predictable cost
              of energy with no surprises all year long for 25+ years.
            </p>
          </div>
        </div>
      </div>
      <div className="mb-6 lg:px-12 px-4 max-w-prose">
        {blocks.map((stat, i) => (
          <div key={i} className={`py-4 ${i === blocks.length - 1 ? "pb-0" : ""}`}>
            <div className="text-lg lg:text-xl font-bold text-gray-800 mb-1">{stat.title}</div>
            <div className="text-md lg:text-lg text-gray-600">{stat.description}</div>
          </div>
        ))}
      </div>
    </div>
  </BreakdownWrapper>
);

export default {
  id: "own-your-power",
  title: "Own your own power.",
  subtitle:
    "Instead of having a variable bill and renting your power from the utility company, have a steady and fixed, predictable cost of energy with no surprises all year.",
  image: { jpg: WhatsNextJpeg, webp: WhatsNextWebp },
  breakdown: OwnYourPower,
  hasModal: true,
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

interface ContentBlock {
  title: string;
  description: string;
}

const blocks: ContentBlock[] = [
  {
    title: "Bill Replacement.",
    description:
      "Your solar payment will take the place of your old utility payment. Only this time will be fixed and transparent, grandfathering you in for the long haul.",
  },
  {
    title: "Protection",
    description: "Nothing will be left to chance, if the utility company raises their rates, you are protected.",
  },
  {
    title: "Flat & Predictable",
    description:
      "When you open your bill every month, it will be the same flat and predictable bill as last month – no surprises and you'll know exactly what it will be to the penny.",
  },
];
