import numeral from "numeral";
import React, { useMemo, useRef } from "react";
import { useSelector } from "react-redux";

import EmptyLayout from "../../components/layouts/EmptyLayout";
import { getEnvironmentalImpactStats } from "../../lib/selectors";
import { ReactComponent as EcoImpactCoal } from "./images/EcoImpact--Coal.svg";
import { ReactComponent as EcoImpactOil } from "./images/EcoImpact--Oil.svg";
import { ReactComponent as EcoImpactPlanted } from "./images/EcoImpact--Planted.svg";
import { ReactComponent as EcoImpactTrees } from "./images/EcoImpact--Trees.svg";
import { ReactComponent as BreakdownIcon } from "./images/WhyChooseSolar--Breakdown--EcoImpact.svg";

import type { DeckScreen } from "../../types";

const EnvironmentalImpactVideo =
  "https://d2a42xgzibz9cq.cloudfront.net/_next/static/videos/EnvironmentalImpact_798x894-09127ce4f9ba488729b897ae994dd39e.mp4";

interface EcoImpactStat {
  title: string;
  icon: any;
  value: number;
}

const EnvironmentalImpact: DeckScreen = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const environmentalImpact = useSelector(getEnvironmentalImpactStats);

  const ecoImpactStats: EcoImpactStat[] = useMemo(
    () => [
      {
        title: "Acres of Forest",
        icon: EcoImpactTrees,
        value: environmentalImpact?.acresForest ?? 0,
      },
      {
        title: "Trees Planted",
        icon: EcoImpactPlanted,
        value: environmentalImpact?.treesPlanted ?? 0,
      },
      {
        title: "Barrels of Oil",
        icon: EcoImpactOil,
        value: environmentalImpact?.barrelsOil ?? 0,
      },
      {
        title: "Pounds of Coal",
        icon: EcoImpactCoal,
        value: environmentalImpact?.poundsCoal ?? 0,
      },
    ],
    [environmentalImpact]
  );

  return (
    <EmptyLayout>
      <div className="absolute inset-0 left-auto w-7/12">
        <div className="relative w-full h-full rounded-lg text-left shadow-xl pointer-events-auto overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gray-700 rounded-lg">
            <video className="w-full h-full object-cover" ref={videoRef} loop muted data-autoplay>
              <source data-src={EnvironmentalImpactVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
      <div className="absolute top-8 left-0 right-auto">
        <div className="bg-white h-full w-full z-10 text-left rounded-lg shadow-xl overflow-hidden">
          <div className="px-12 py-10 flex flex-col justify-between items-center pointer-events-auto">
            <div className="mb-10 ml-0 flex items-start max-w-2xl">
              <div className="flex-shrink-0 flex items-center justify-center rounded-full mt-2 mx-0">
                <BreakdownIcon />
              </div>
              <div className="mt-0 mx-4 text-left">
                <h3 className="text-5xl leading-snug font-bold text-gray-900 mb-2" id="modal-headline">
                  Environmental Impact
                </h3>
                <div className="max-w-5xl">
                  <p className="text-base text-gray-600">
                    Your home will harvest clean energy from the sun every day while not contributing to the negative
                    impact of global warming.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-rows-2 grid-cols-2 gap-12 mb-14">
                {ecoImpactStats.map(stat => (
                  <div key={stat.title} className="flex">
                    <div className="flex-initial mr-6 text-primary-light">
                      <stat.icon />
                    </div>
                    <div className="flex-grow">
                      <div className="font-bold text-4xl">{numeral(stat.value).format("0,0")}</div>
                      <div className="mt-2 text-base text-gray-600">{stat.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </EmptyLayout>
  );
};

export default EnvironmentalImpact;
