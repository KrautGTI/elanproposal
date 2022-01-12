import clsx from "clsx";
import numeral from "numeral";
import React, { FC } from "react";
import { useSelector } from "react-redux";

import OffsetChart from "../../charts/OffsetChart";
import TitleLayout from "../../components/layouts/TitleLayout";
import RoofImage from "../../components/RoofImage";
import {
  getEstimatedYearlyConsumption,
  getEstimatedYearlyProduction,
  getPanelName,
  getRoofImageUrl,
  getSolarOffset,
  getSystemSizeInKw,
} from "../../lib/selectors";

import type { DeckScreen } from "../../types";

interface HomeDesignProps {
  heading?: string | undefined;
}

const HomeDesign: DeckScreen<HomeDesignProps> = ({ heading, isActive }) => {
  const panelName = useSelector(getPanelName);
  const systemSizeKw = useSelector(getSystemSizeInKw);
  const estimatedProduction = useSelector(getEstimatedYearlyProduction);
  const estimatedConsumption = useSelector(getEstimatedYearlyConsumption);
  const roofImageUrl = useSelector(getRoofImageUrl);
  const solarOffset = useSelector(getSolarOffset);

  return (
    <TitleLayout title={heading ?? "Home Design"}>
      <div className="h-full w-full flex">
        <div className="h-full overflow-hidden flex flex-col mr-6" style={{ width: 479 }}>
          {!!systemSizeKw && (
            <Card title="System Size" className="mb-4">
              <div className="font-bold text-4xl mb-2">
                {systemSizeKw} <span className="text-gray-500 text-4xl">kW</span>
              </div>
            </Card>
          )}
          {!!panelName && (
            <Card title="Panel Type" className="mb-4">
              <div className="font-bold text-4xl mb-2">{panelName}</div>
            </Card>
          )}
          <Card title="Solar Offset" className="flex-grow">
            {!!solarOffset && (
              <div className="relative flex-grow flex flex-col justify-center items-center px-10 py-4 print:pt-0 print:-mt-2 overflow-hidden">
                <div className="w-full flex-grow relative">
                  <OffsetChart className="absolute inset-0" active={isActive} solarOffset={solarOffset} />
                </div>
                <div className="absolute inset-0 text-white text-center flex items-center justify-center pointer-events-none">
                  <div>
                    <span className="text-8xl font-bold">{solarOffset}%</span>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2">
              {!!estimatedProduction && (
                <LegendCard
                  colorClass="bg-green-800"
                  label="Est. Production"
                  kwh={estimatedProduction}
                  suffix="first year"
                />
              )}
              {!!estimatedConsumption && (
                <LegendCard
                  colorClass="bg-green-400"
                  label="Est. Consumption"
                  kwh={estimatedConsumption}
                  suffix="per year"
                />
              )}
            </div>
          </Card>
        </div>
        <div
          className="h-full flex-grow relative rounded-lg bg-gray-600 shadow-md overflow-hidden"
          style={{ width: 771 }}
          data-cy="roof-image-wrapper"
        >
          <RoofImage url={roofImageUrl} />
        </div>
      </div>
    </TitleLayout>
  );
};

export default HomeDesign;

const Card: FC<{ className?: string; title: string }> = ({ children, className, title }) => {
  return (
    <div className={clsx("w-full bg-white rounded-lg shadow-md p-4 flex flex-col", className)}>
      <div className="text-gray-500 mb-4">{title}</div>
      {children}
    </div>
  );
};

const LegendCard = ({
  colorClass,
  label,
  kwh,
  suffix,
}: {
  colorClass: string;
  label: string;
  kwh: number;
  suffix: string;
}) => {
  return (
    <div className="p-2 pb-6 text-center">
      <div className="flex justify-center items-center">
        <span className="text-gray-500 mr-2">{label}</span>{" "}
        <div className={clsx("inline-block h-5 w-5 rounded-sm", colorClass)}></div>
      </div>
      <div className="flex justify-center items-baseline mt-3">
        <span className="font-bold text-4xl mr-2">{numeral(kwh).format("0,0")}</span>
        <span className="font-lg text-gray-500">kWh</span>
      </div>
      <div className="font-lg text-gray-500 mt-2 text-center">{suffix}</div>
    </div>
  );
};
