import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";

import { BreakdownModal } from "../../../components/BreakdownModal";
import ImgNextGen from "../../../components/ImgNextGen";
import TitleLayout from "../../../components/layouts/TitleLayout";
import HomeAppeal from "./breakdowns/HomeAppeal";
import OwnYourPower from "./breakdowns/OwnYourPower";
import WhatsNext from "./breakdowns/WhatsNext";

import type { DeckScreen } from "../../../types";

const tiles = [
  { className: "row-span-2 col-span-3", config: OwnYourPower },
  { className: "col-span-3", config: WhatsNext },
  { className: "col-span-3", config: HomeAppeal },
];

interface WhyChooseSolarProps {
  heading?: string | undefined;
}

const WhyChooseSolar: DeckScreen<WhyChooseSolarProps> = ({ id, heading, isActive }) => {
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const handleCloseModal = useCallback(() => setSelectedTile(null), []);

  const title = heading ?? "Why Choose Solar?";

  useEffect(() => {
    if (!!selectedTile && !isActive) {
      handleCloseModal();
    }
  }, [selectedTile, isActive, handleCloseModal]);

  return (
    <TitleLayout title={title}>
      <div className="h-full w-full grid grid-rows-2 grid-cols-6 gap-6">
        {tiles.map(({ className, config }) => (
          <div key={config.id} className={className} data-cy={`tile--${config.id}`}>
            <div
              className={clsx(
                "rounded-lg bg-center relative w-full h-full overflow-hidden",
                config.hasModal && "cursor-pointer focus:ring focus:ring-primary focus:outline-none"
              )}
              onClick={() => setSelectedTile(config.id)}
              tabIndex={0}
              role={config.hasModal ? "button" : "item"}
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
                className="text-white p-4 pt-6 absolute inset-0 top-auto pr-44"
                style={{ backgroundImage: "linear-gradient(to bottom, transparent, rgba(9, 15, 19, 0.8))" }}
              >
                <h3 className="text-3xl font-bold mb-2" data-cy="title">
                  {config.title}
                </h3>
                <h4 className="text-white leading-normal" data-cy="subtitle">
                  {config.subtitle}
                </h4>
              </div>
            </div>
            {config.hasModal && (
              <BreakdownModal
                tileId={config.id}
                open={!!selectedTile && selectedTile === config.id}
                onClose={handleCloseModal}
                image={config.image}
                video={config.video}
              >
                <config.breakdown />
              </BreakdownModal>
            )}
          </div>
        ))}
      </div>
    </TitleLayout>
  );
};

export default WhyChooseSolar;
