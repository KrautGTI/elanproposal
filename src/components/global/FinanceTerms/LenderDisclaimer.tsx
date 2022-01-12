import React from "react";
import { useSelector } from "react-redux";

import {
  getCurrentLenderInfo,
  getLenderDisclaimer,
} from "../../../lib/selectors";

const LenderDisclaimer = () => {
  const currentLenderInfo = useSelector(getCurrentLenderInfo);

  return (
    <>
      {!currentLenderInfo.isCash && (
        <div
          className="disclaimers text-gray-500 text-xs overflow-y-auto py-1 px-3"
          data-cy="financing-disclaimers"
        >
          <div className="mb-4">
            Any monthly payments shown are estimations only and do not guarantee financing. Your actual payment
            could vary based on your credit profile and being approved by the financial institution. Lender rates,
            fees or programs are subject to change without notice.
          </div>
          <Disclaimer />
        </div>
      )}
    </>
  )
}

const Disclaimer = () => {
  const lenderDisclaimer = useSelector(getLenderDisclaimer);

  if (!lenderDisclaimer) return null;

  return <div dangerouslySetInnerHTML={{ __html: lenderDisclaimer }} />;
};

export default LenderDisclaimer;
