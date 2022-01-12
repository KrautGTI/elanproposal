import clsx from "clsx";
import numeral from "numeral";
import React, { FC, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import useComponentSize from "../../../../hooks/useComponentSize";
import {
  getCanChangeInverter,
  getInverterName,
  getIsHelioquoteDesign,
  getMaxPanelCount,
  getPanelCount,
  getPanelName,
  getPanelWatts,
  getShowArrayDataPopup,
  getSystemSizeInKw,
  getInverterManufacturerName,
  getIsAuroraDesign,
} from "../../../../lib/selectors";
import { OptimizeDesignOperationType } from "../../../../types";
import { OptimizeByMetricButton } from "../../../forms/OptimizeByMetric";
import ArrayDataTable from "./ArrayDataTable";
import TransparentBoxLock from "./TransparentBoxLock";

interface SystemSizeCardProps {
  locked: boolean;
}

const SystemSizeCard: FC<SystemSizeCardProps> = ({ locked }) => {
  const maxPanelCount = useSelector(getMaxPanelCount);
  const panelCount = useSelector(getPanelCount);
  const panelName = useSelector(getPanelName);
  const inverterName = useSelector(getInverterName);
  const inverterManufacturerName = useSelector(getInverterManufacturerName);
  const panelWatts = useSelector(getPanelWatts);
  const systemSizeKw = useSelector(getSystemSizeInKw);
  const isHelioquoteDesign = useSelector(getIsHelioquoteDesign);
  const canChangeInverter = useSelector(getCanChangeInverter);

  const showInverter = isHelioquoteDesign && canChangeInverter;

  const containerRef = useRef(null);
  const { height } = useComponentSize(containerRef, { debounceTime: 20 });
  const showArrayDataPopup = useSelector(getShowArrayDataPopup);

  const showMaxPanels = !useSelector(getIsAuroraDesign);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative bg-white rounded-lg p-4 grid grid-cols-4 gap-4 z-10",
        showInverter ? "md:grid-cols-8" : "md:grid-cols-6"
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      <TransparentBoxLock show={locked} />
      <OptimizeButton id="modify-system-size-btn" metric="systemSize" title="System Size" className="col-span-2">
        <ValueBox>{systemSizeKw} kW</ValueBox>
      </OptimizeButton>
      <OptimizeButton
        id="modify-active-panels-btn"
        metric="panelCount"
        title="Active Panels"
        className={clsx("col-span-2", showArrayDataPopup && "md:relative")}
      >
        {showArrayDataPopup && <ArrayDataTable parentHeight={height} isLocked={locked} />}
        {showMaxPanels ? (
          <ValueBox>
            {numeral(panelCount).format("0,0")}{" "}
            <SecondaryValue>/ {numeral(maxPanelCount).format("0,0")}</SecondaryValue>
          </ValueBox>
        ) : (
          <ValueBox>{numeral(panelCount).format("0,0")} </ValueBox>
        )}
      </OptimizeButton>
      <OptimizeButton
        id="modify-panel-type-btn"
        metric="panel"
        className={clsx("pb-2 md:col-span-2", showInverter ? "col-span-2" : "col-span-4")}
        title="Current Panel"
      >
        <ValueBox>
          {numeral(panelWatts || 0).format("0,0")} <span className="text-sm">watts</span>
        </ValueBox>
        <SecondaryValue>{panelName}</SecondaryValue>
      </OptimizeButton>
      {showInverter && (
        <OptimizeButton id="modify-inverter-btn" metric="inverter" className="pb-2 col-span-2" title="Current Inverter">
          {inverterManufacturerName === "n/a" ? (
            <ValueBox>{inverterName}</ValueBox>
          ) : (
            <>
              <ValueBox>{inverterManufacturerName}</ValueBox>
              <SecondaryValue>{inverterName}</SecondaryValue>
            </>
          )}
        </OptimizeButton>
      )}
    </div>
  );
};

export default SystemSizeCard;

const SecondaryValue = styled.span.attrs({
  className: "text-xs font-light text-gray-700 whitespace-nowrap overflow-hidden overflow-ellipsis",
})``;
const ValueBox = styled.div.attrs({ className: "font-bold text-2xl" })``;

const OptimizeButton: FC<{ className?: string; id: string; metric: OptimizeDesignOperationType; title: string }> = ({
  children,
  className,
  id,
  metric,
  title,
}) => {
  return (
    <OptimizeByMetricButton
      id={id}
      metric={metric}
      className={clsx(
        "border border-gray-300",
        "w-full text-center rounded-lg white-spacenowrap",
        "flex flex-col items-center justify-start p-4",
        className
      )}
      data-cy={`optimize-by-${metric}-btn`}
    >
      <div className="font-light text-gray-700 mb-2">{title}</div>
      {children}
    </OptimizeByMetricButton>
  );
};
