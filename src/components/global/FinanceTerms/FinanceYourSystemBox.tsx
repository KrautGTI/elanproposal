import React from "react";
import { useSelector } from "react-redux";

import { faChevronRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ManageLenderButton } from "../../../components/forms/ManageLender";
import {
  canUserEditProposal,
  getApplyNowUrl,
  getCurrentLenderInfo,
  getMonthlyPaymentSchedule,
  getSolarMonthlyPayment,
  getNeedFinancedAmount,
  getIsLeaseOrPpa,
  getIsPpa,
  getMissingLenderRate,
  getShowVoluntaryPrepaymentMessage,
} from "../../../lib/selectors";
import { formatDollarsAndCents, formatWholeDollars } from "../../../lib/utils";

function getLenderText(isLeaseOrPpa, isPpa, currentLenderInfo) {
  if (isLeaseOrPpa) {
    return `${isPpa ? "PPA" : "Lease"} provided by`;
  }
  if (currentLenderInfo.isCash) {
    return "Your system will have a one time payment of";
  }
  return "Your new monthly payment will be";
}

const FinanceYourSystemBox = () => {
  const currentLenderInfo = useSelector(getCurrentLenderInfo);

  const canEdit = useSelector(canUserEditProposal);
  const applyNowUrl = useSelector(getApplyNowUrl);
  const needsFinancing = useSelector(getNeedFinancedAmount);
  const monthlyPayment = useSelector(getSolarMonthlyPayment);
  const monthlyPaymentSchedule = useSelector(getMonthlyPaymentSchedule);

  const missingLenderRate = useSelector(getMissingLenderRate);

  const isLeaseOrPpa = useSelector(getIsLeaseOrPpa);
  const isPpa = useSelector(getIsPpa);

  const lenderText = getLenderText(isLeaseOrPpa, isPpa, currentLenderInfo);
  const showVoluntaryPrepaymentMessage = useSelector(getShowVoluntaryPrepaymentMessage);

  return (
    <div className="w-full bg-blue-gray-900 rounded-lg text-center flex flex-col py-8">
      <div className="font-bold text-white text-xl mb-1">{lenderText}</div>
      <div className="flex-shrink-0 mb-8">
        {canEdit ? (
          <ManageLenderButton className="text-primary font-bold text-2xl px-4 py-2" data-cy="finance-manage-lender-btn">
            {!missingLenderRate ? currentLenderInfo.name : "Missing Lender! Please Click Here"}
          </ManageLenderButton>
        ) : (
          <div className="text-primary font-bold text-2xl px-4 py-2">{currentLenderInfo.name}</div>
        )}
      </div>
      {monthlyPayment ? (
        <>
          <div className="text-white font-bold text-8xl mb-2">
            {formatWholeDollars(monthlyPaymentSchedule ? monthlyPaymentSchedule.intro.payment : monthlyPayment)}
            <span className="text-5xl">/mo</span>
          </div>
          {!!monthlyPaymentSchedule && !isLeaseOrPpa && (
            <div className="text-gray-500 font-bold">
              {showVoluntaryPrepaymentMessage
                ? monthlyPaymentSchedule.intro.text
                : "Your monthly payments for the term of the loan"}
            </div>
          )}
          {canEdit ? (
            <div className="flex-shrink-0">
              <a href={applyNowUrl} className="btn btn-primary font-bold py-4 pl-8 pr-5 mt-8">
                Apply Now! <FontAwesomeIcon className="ml-6" icon={faChevronRight} />
              </a>
            </div>
          ) : null}
        </>
      ) : null}
      {currentLenderInfo.isCash && (
        <>
          <div className="text-white font-bold text-7xl mb-2">{formatDollarsAndCents(needsFinancing)}</div>
          <a href={applyNowUrl} className="text-primary font-bold text-2xl px-4 py-2">
            View Agreement
          </a>
        </>
      )}
    </div>
  );
};

export default FinanceYourSystemBox;
