import max from "lodash/max";
import min from "lodash/min";
import round from "lodash/round";
import numeral from "numeral";
import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import OffsetChart from "../../../charts/OffsetChart";
import ImgNextGen from "../../../components/ImgNextGen";
import TitleLayout from "../../../components/layouts/TitleLayout";
import RoofImage from "../../../components/RoofImage";
import SpringSlider from "../../../components/SpringSlider";
import StaticRoofImage from "../../../components/StaticRoofImage";
import Toggle from "../../../components/Toggle";
import {
  getEstimatedYearlyConsumption,
  getEstimatedYearlyProduction,
  getFirstYearChartData,
  getFirstYearConsumptionData,
  getHeatMapOffImageUrl,
  getPanelCount,
  getPanelName,
  getRoofImageUrl,
  getSolarOffset,
  getSystemSizeInKw,
} from "../../../lib/selectors";
import { colors } from "../constants";
import PanelJpg from "./images/Panel.jpg";
import PanelWebp from "./images/Panel.webp";

import type { DeckScreen } from "../../../types";

interface HomeDesignProps {
  heading?: string | undefined;
}

const HomeDesign: DeckScreen<HomeDesignProps> = ({ heading, isActive }) => {
  const panelName = useSelector(getPanelName);
  const systemSizeKw = useSelector(getSystemSizeInKw);
  const estimatedProduction = useSelector(getEstimatedYearlyProduction);
  const estimatedConsumption = useSelector(getEstimatedYearlyConsumption);
  const roofImageUrl = useSelector(getRoofImageUrl);
  const roofHeatMapOffImageUrl = useSelector(getHeatMapOffImageUrl);

  const [useHeatMapImage, setHeatMapImage] = useState(false);
  const toggleRoofImages = () => {
    setHeatMapImage(!useHeatMapImage);
  };

  const solarOffset = useSelector(getSolarOffset);
  const activePanels = useSelector(getPanelCount);
  const firstYearData = useSelector(getFirstYearChartData);

  const minBill = min(firstYearData);
  const maxBill = max(firstYearData);

  const displayBill =
    minBill === maxBill
      ? numeral(maxBill).format("$0,0")
      : `${numeral(minBill).format("$0,0")}-${numeral(maxBill).format("$0,0")}`;

  const monthlyProduction = useSelector(getEstimatedYearlyProduction) / 12;
  const highestConsumption = max(useSelector(getFirstYearConsumptionData));

  const offset = highestConsumption ? round((monthlyProduction / highestConsumption) * 100, 1) : solarOffset;

  const displayOffset =
    offset === solarOffset
      ? numeral(solarOffset / 100).format("0,0%")
      : `${numeral(offset / 100).format("0,0%")}-${numeral(solarOffset / 100).format("0,0%")}`;

  return (
    <TitleLayout title={heading ?? "Home Design"} className="bg-gray-100">
      <div className="h-full w-full flex">
        <div className="h-full overflow-hidden flex flex-col mr-6" style={{ width: 420 }}>
          <LeftWrapper className="h-full rounded-lg px-8">
            <div className="flex w-full mt-6">
              {!!systemSizeKw && (
                <Card title="System Size" className="py-4 pr-6 border-r-2 border-gray-700">
                  <div className="font-bold text-5xl text-primary">{systemSizeKw} kW</div>
                </Card>
              )}
              {!!panelName && (
                <Card title="Panels" className="p-4 flex-grow">
                  <div className="font-bold text-5xl text-primary">{activePanels}</div>
                </Card>
              )}
            </div>
            <Divider />
            <div className="flex">
              <div className="w-2/5 pr-4">
                <h3 className="text-blue-gray-300 text-2xl">Panel Type</h3>
                <p className="text-white text-3xl mt-3">{panelName}</p>
              </div>
              <div className="w-3/5">
                <ImgNextGen className="h-full w-full object-cover rounded-lg" srcWebp={PanelWebp} fallback={PanelJpg} />
              </div>
            </div>
            <Divider />
            <div>
              <div className="flex justify-between text-xl">
                <span className="text-blue-gray-500">kWh consumed last year</span>
                <span className="pl-20 text-white">{numeral(estimatedConsumption).format("0,0")}</span>
              </div>
              <div className="flex justify-between text-xl mt-4">
                <span className="text-blue-gray-500">kWh being produced by solar per year</span>
                <span className="pl-20 text-primary">{numeral(estimatedProduction).format("0,0")}</span>
              </div>
            </div>

            <div className="bg-blue-gray-500 rounded-2xl p-2 mt-4 -ml-2" style={{ width: "105%" }}>
              <div className="flex text-white justify-between text-xl">
                <span className="">Current Electric Bill</span>
                <span className="pl-20">{displayBill}</span>
              </div>
            </div>
            <Divider className="mb-0" />
            {!!offset && (
              <>
                <div className="h-48 relative flex-grow flex flex-col justify-center items-center px-10 print:pt-0 print:-mt-2 overflow-hidden">
                  <div className="w-full flex-grow relative">
                    <OffsetChart borderWidth={0} className="absolute inset-0" active={isActive} solarOffset={offset} />
                  </div>
                </div>
                <p className="text-blue-gray-500 text-center">
                  Estimated offest {displayOffset} assuming no additional changes, and assuming that the customer has provided an accurate electricity consumption
                </p>
              </>
            )}
          </LeftWrapper>
        </div>

        <div className="flex flex-col items-center">
          <div
            className="h-full flex-grow relative rounded-lg bg-gray-600 shadow-md overflow-hidden mb-4"
            style={{ width: 920 }}
            data-cy="roof-image-wrapper"
          >
            {!!roofHeatMapOffImageUrl ? (
              <SpringSlider activeIndex={useHeatMapImage ? 1 : 0} slidesAtOnce={1}>
                <StaticRoofImage url={roofHeatMapOffImageUrl} />
                <StaticRoofImage url={roofImageUrl} />
              </SpringSlider>
            ) : (
              <RoofImage url={roofImageUrl} />
            )}
          </div>

          {!!roofHeatMapOffImageUrl && <Toggle enabled={useHeatMapImage} toggle={toggleRoofImages} />}

          <p className="w-full pt-4 text-gray-600">
            The system design may change based on a detailed engineering site audit.
          </p>
        </div>
      </div>
    </TitleLayout>
  );
};

const LeftWrapper = styled.div`
  background-color: ${colors.darkBg};
`;

export default HomeDesign;

type DividerProps = {
  className?: string;
};

const Divider: FC<DividerProps> = ({ className = "" }) => (
  <hr className={`text-gray-700 border-gray-700 border-t-2 mx-14 my-6 ${className}`} />
);

const Card: FC<{ className?: string; title: string }> = ({ children, className, title }) => {
  return (
    <div className={className}>
      {children}
      <div className="text-white text-lg">{title}</div>
    </div>
  );
};
