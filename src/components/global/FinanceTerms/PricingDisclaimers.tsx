import clsx from "clsx";
import React, { FC } from "react";
import { useSelector } from "react-redux";

import {
  getCurrentLenderInfo,
  getIsLeaseOrPpa,
  getItcPercentage,
  getLenderFootnote,
  getNeedFinancedAmount,
} from "../../../lib/selectors";

type PricingDisclaimersProps = {
  className?: string;
};

const PricingDisclaimers: FC<PricingDisclaimersProps> = ({ className }) => {
  const currentLenderInfo = useSelector(getCurrentLenderInfo);
  const lenderFootnote = useSelector(getLenderFootnote);
  const itcPercentage = useSelector(getItcPercentage);
  const needFinancedAmount = useSelector(getNeedFinancedAmount);
  const isLeaseOrPpa = useSelector(getIsLeaseOrPpa);

  const taxIncentiveDisclaimer = currentLenderInfo.isCash
    ? "*Tax incentives subject to availability."
    : `*Tax incentives subject to availability. ${currentLenderInfo.name} does not offer tax advice. Please consult a
  tax professional.`;

  return (
    <div className={clsx("px-6", className)} data-cy="pricing-disclaimers">
      {!isLeaseOrPpa && (
        <div className="mb-6">
          {!!lenderFootnote && (
            <div className="text-gray-500 font-bold text-xs mb-2">
              <sup>1</sup>
              {lenderFootnote}
            </div>
          )}
          <div className="text-gray-500 font-bold text-xs mb-2">
            <sup>{!!lenderFootnote && !!needFinancedAmount ? 2 : 1}</sup>
            Federal tax credit {itcPercentage ?? 22}% of the total system cost, after utility rebates
          </div>
        </div>
      )}
      <div className="text-gray-500 font-bold text-xs mb-2">{taxIncentiveDisclaimer}</div>
      <div className="text-gray-500 font-bold text-xs">**Additional State &amp; local incentives may also apply</div>
    </div>
  );
};

export default PricingDisclaimers;
