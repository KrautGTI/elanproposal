import React from "react";
import { useSelector } from "react-redux";

import EditLockToggler from "../../components/EditLockToggler";
import FinanceYourSystemBox from "../../components/global/FinanceTerms/FinanceYourSystemBox";
import LenderDisclaimer from "../../components/global/FinanceTerms/LenderDisclaimer";
import MonthlyPaymentScheduleCard from "../../components/global/FinanceTerms/MonthlyPaymentScheduleCard";
import PricingDisclaimers from "../../components/global/FinanceTerms/PricingDisclaimers";
import TitleLayout from "../../components/layouts/TitleLayout";
import { canUserEditProposal, getMonthlyPaymentSchedule, getLenderCap } from "../../lib/selectors";
import PricingBreakdownCard from "./PricingBreakdownCard";
import FormWarningMessage from "../../components/FormWarningMessage";

import type { DeckScreen } from "../../types";

interface FinanceTermsProps {
  heading?: string | undefined;
}

const FinanceTerms: DeckScreen<FinanceTermsProps> = ({ heading }) => {
  const canEdit = useSelector(canUserEditProposal);
  const monthlyPaymentSchedule = useSelector(getMonthlyPaymentSchedule);
  const lenderCap = useSelector(getLenderCap);

  return (
    <TitleLayout title={heading ?? "Finance Terms"}>
      <div className="w-full h-full flex">
        <div className="flex flex-col w-1/2 px-20 overflow-y-auto">
          <div className="mb-4">
            <FinanceYourSystemBox />
          </div>
          {!!monthlyPaymentSchedule && (
            <div className="mb-4">
              <MonthlyPaymentScheduleCard />
            </div>
          )}
          <LenderDisclaimer />
        </div>
        <div className="flex flex-col w-1/2 overflow-y-auto">
          <div className="flex-grow px-20">
            {lenderCap?.locked ? (
              <div className="py-3 px-3 my-2">
                <FormWarningMessage
                  data-cy="lender-cap-exceded"
                  title="Lender Cap Exceded"
                  body={lenderCap.warning_message}
                />
              </div>
            ) : null}
            {canEdit ? (
              <div className="text-right mb-3 mr-1">
                <EditLockToggler />
              </div>
            ) : null}
            <PricingBreakdownCard className="mb-6" />
          </div>
          <PricingDisclaimers />
        </div>
      </div>
    </TitleLayout>
  );
};

export default FinanceTerms;
