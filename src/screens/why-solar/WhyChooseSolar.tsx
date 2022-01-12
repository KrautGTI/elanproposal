import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { BreakdownModal } from "../../components/BreakdownModal";
import ImgNextGen from "../../components/ImgNextGen";
import TitleLayout from "../../components/layouts/TitleLayout";
import { getCanShowSolarSavings } from "../../lib/selectors";
import Control from "./breakdowns/Control";
import EnvironmentalImpact from "./breakdowns/EnvironmentalImpact";
import HomeValue from "./breakdowns/HomeValue";
import SavingsAndStability from "./breakdowns/SavingsAndStability";

import type { DeckScreen } from "../../types";
interface WhyChooseSolarProps {
  heading?: string | undefined;
}

const WhyChooseSolar: DeckScreen<WhyChooseSolarProps> = ({ heading, isActive }) => {
  const canShowSolarSavings = useSelector(getCanShowSolarSavings);

  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const handleCloseModal = useCallback(() => setSelectedTile(null), []);

  const title = heading ?? "Why Choose Solar?";

  useEffect(() => {
    if (!!selectedTile && !isActive) {
      handleCloseModal();
    }
  }, [selectedTile, isActive, handleCloseModal]);

  const tiles = useMemo(
    () => [
      { className: "row-span-2 col-span-3", config: Control },
      { className: "col-span-2", config: EnvironmentalImpact },
      {
        className: "col-span-2",
        config: canShowSolarSavings
          ? SavingsAndStability
          : {
              ...SavingsAndStability,
              title: "Stability",
            },
      },
      { className: "col-span-4", config: HomeValue },
    ],
    [canShowSolarSavings]
  );

  return (
    <TitleLayout title={title}>
      <div className="h-full w-full grid grid-rows-2 grid-cols-7 gap-6">
        {tiles.map(({ className, config }) => (
          <div key={config.id} className={className} data-cy={`tile--${config.id}`}>
            <div
              className="rounded-lg bg-center cursor-pointer relative w-full h-full overflow-hidden focus:ring focus:ring-primary focus:outline-none"
              onClick={() => setSelectedTile(config.id)}
              tabIndex={0}
              role="button"
              aria-expanded={config.id === selectedTile}
              aria-label={`Open ${config.title} Breakdown`}
              onKeyUp={e => {
                if (e.key === "Enter") {
                  setSelectedTile(config.id);
                }
              }}
            >
              <div className="absolute inset-0">
                <ImgNextGen
                  className="w-full h-full object-cover"
                  srcWebp={config.image.webp}
                  fallback={config.image.jpg}
                />
              </div>
              <div
                className="text-white p-4 pt-6 absolute inset-0 top-auto"
                style={{ backgroundImage: "linear-gradient(to bottom, transparent, rgba(9, 15, 19, 0.8))" }}
              >
                <h3 className="text-3xl font-bold mb-2" data-cy="title">
                  {config.title}
                </h3>
                <h4 className="text-base opacity-70" data-cy="subtitle">
                  {config.subtitle}
                </h4>
              </div>
            </div>
            <BreakdownModal
              tileId={config.id}
              open={!!selectedTile && selectedTile === config.id}
              onClose={handleCloseModal}
              image={config.image}
              video={config.video}
            >
              <config.breakdown />
            </BreakdownModal>
          </div>
        ))}
      </div>
    </TitleLayout>
  );
};

export default WhyChooseSolar;
