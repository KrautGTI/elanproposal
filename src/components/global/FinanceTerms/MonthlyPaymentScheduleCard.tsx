import React from "react";
import { useSelector } from "react-redux";

import {
  getAppliedTaxCredits,
  getMonthlyPaymentSchedule,
  getShowVoluntaryPrepaymentMessage,
  canUserAdjustTaxCredit,
  getIsLeaseOrPpa,
} from "../../../lib/selectors";
import { formatDollarsAndCents } from "../../../lib/utils";
import { ManageTaxCreditsButton } from "../../forms/ManageTaxCredits";

const MonthlyPaymentScheduleCard = () => {
  const creditsApplied = useSelector(getAppliedTaxCredits);

  const schedule = useSelector(getMonthlyPaymentSchedule);
  const showVoluntaryPrepaymentMessage = useSelector(getShowVoluntaryPrepaymentMessage);
  const canAdjustTaxCredit = useSelector(canUserAdjustTaxCredit);

  const isLeaseOrPpa = useSelector(getIsLeaseOrPpa);

  if (!schedule || isLeaseOrPpa || !showVoluntaryPrepaymentMessage) return null;

  return (
    <div className="w-full p-4 text-gray-600 border border-gray-300 rounded-md">
      <div className="mb-4">
        <span>When you apply </span>
        {canAdjustTaxCredit ? (
          <ManageTaxCreditsButton className="text-primary font-bold text-lg" data-cy="manage-tax-credits-btn">
            {formatDollarsAndCents(creditsApplied)}
          </ManageTaxCreditsButton>
        ) : (
          <span className="font-bold">{formatDollarsAndCents(creditsApplied)}</span>
        )}
        <span> to your loan by Month {schedule.intro_period + 1}</span>
      </div>
      <div className="font-bold mb-1 py-2">Your Monthly Payment...</div>
      <table className="w-full text-base">
        <tbody>
          <tr>
            <td className="mb-2 pt-1 pb-2 pr-3 text-sm">{schedule.intro.text}</td>
            <td className="mb-2 text-right pt-1 pb-2">
              <strong>{formatDollarsAndCents(schedule.intro.payment)}/mo</strong>
            </td>
          </tr>
          {showVoluntaryPrepaymentMessage && (
            <>
              <tr>
                <td className="mb-2 pt-1 pb-2 pr-3 text-sm">{schedule.after_buydown.text}</td>
                <td className="mb-2 text-right pt-1 pb-2">
                  <strong>{formatDollarsAndCents(schedule.after_buydown.payment)}/mo</strong>
                </td>
              </tr>
              <tr>
                <td className="mb-2 pt-1 pb-2 pr-3 text-sm">{schedule.sans_buydown.text}</td>
                <td className="mb-2 text-right pt-1 pb-2">
                  <strong>{formatDollarsAndCents(schedule.sans_buydown.payment)}/mo</strong>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyPaymentScheduleCard;
