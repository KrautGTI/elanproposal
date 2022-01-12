import clsx from "clsx";
import React, { forwardRef } from "react";
import { useSelector } from "react-redux";

import {
  getHelioquoteIframeUrl,
  getIsAuroraDesign,
  getIsHelioquoteDesign,
  getUseAuroraSdk,
} from "../../../lib/selectors";
import { ColorMode } from "../../../types";
import AuroraSdk from "./aurora/AuroraSdk";
import DesignPortalRooftopImage from "./components/DesignPortalRooftopImage";
import PricingBreakdownCard from "./components/PricingBreakdownCard";
import SystemOffsetCard from "./components/SystemOffsetCard";
import SystemSizeCard from "./components/SystemSizeCard";
import HelioquoteDesignWidget from "./interactive-design/HelioquoteDesignWidget";

interface DesignPortalProps {
  open: boolean;
  mode?: ColorMode;
}

const DesignPortal = forwardRef<HTMLDivElement, DesignPortalProps>(({ open }, ref) => {
  const isHelioquoteDesign = useSelector(getIsHelioquoteDesign);
  const isAuroraDesign = useSelector(getIsAuroraDesign);
  const iframeUrl = useSelector(getHelioquoteIframeUrl);
  const usAuroraSdk = useSelector(getUseAuroraSdk);

  const isLoading = useSelector(state => state.proposal.isLoading);

  const { isLocked, lockMessage } = useSelector(state => state.designPortal);

  let designImageComponent = <DesignPortalRooftopImage locked={isLocked || !!isLoading} />;
  if (isHelioquoteDesign) {
    designImageComponent = <HelioquoteDesignWidget url={iframeUrl} locked={isLocked} lockMessage={lockMessage} />;
  }

  if (usAuroraSdk && isAuroraDesign) {
    designImageComponent = <AuroraSdk />;
  }

  return (
    <>
      <div ref={ref} className="flex flex-col xl:flex-row gap-4 sm:px-4 pt-2 pb-6" data-cy="design-portal">
        <div className="flex-grow flex flex-col gap-4">
          <div className={clsx("flex-grow rounded-lg overflow-hidden relative", isHelioquoteDesign && "bg-gray-600")}>
            {designImageComponent}
          </div>
          <div>
            <SystemSizeCard locked={isLocked || !!isLoading} />
          </div>
        </div>
        <div className="flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 xl:flex xl:flex-col gap-4 xl:w-[24rem]">
          <SystemOffsetCard locked={isLocked || !!isLoading} open={open} />
          <PricingBreakdownCard locked={isLocked || !!isLoading} />
        </div>
      </div>
    </>
  );
});

export default DesignPortal;
