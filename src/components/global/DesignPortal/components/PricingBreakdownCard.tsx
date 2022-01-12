import clsx from "clsx";
import map from "lodash/map";
import numeral from "numeral";
import React, { FC, useState } from "react";
import { useSelector } from "react-redux";

import { faEdit } from "@fortawesome/pro-duotone-svg-icons";
import { faInfoCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  canUserAdjustTaxCredit,
  canUserEditGrossPrice,
  canUserEditProposal,
  canUserManageDiscounts,
  getAllActiveAdders,
  getCalculatedSystemCost,
  getCurrentLenderInfo,
  getDiscountsTotal,
  getDownPayment,
  getFederalTaxCredit,
  getGrossPpw,
  getGrossSystemCost,
  getNetPpw,
  getNetSystemCost,
  getSelectedLoanProductName,
  getSolarMonthlyPayment,
  getSystemAddersTotal,
  getUtilityCompany,
  getUtilityMonthlyPayment,
  getIsProposalLocked,
  getHideValueAddersPriceFromCustomer,
} from "../../../../lib/selectors";
import { formatDollarsAndCents, getCostForAdder, showAdderPrice } from "../../../../lib/utils";
import { Caret } from "../../../Caret";
import EditLockToggler from "../../../EditLockToggler";
import { ManageAddersButton } from "../../../forms/ManageAdders";
import { ManageDiscountsButton } from "../../../forms/ManageDiscounts";
import { ManageGrossSystemCostButton } from "../../../forms/ManageGrossSystemCost";
import { ManageLenderButton } from "../../../forms/ManageLender";
import { ManageSystemCostButton } from "../../../forms/ManageSystemCost";
import { ManageTaxCreditsButton } from "../../../forms/ManageTaxCredits";
import { ManageUtilityRateScheduleButton } from "../../../forms/ManageUtilityRateSchedule";
import { OptimizeByMetricButton } from "../../../forms/OptimizeByMetric";
import HideLocked from "../../../HideLocked";
import { FullPriceBreakdownButton } from "../../FullPriceBreakdownDrawer";
import TransparentBoxLock from "./TransparentBoxLock";

const paymentButtonClasses = "pt-4 px-2 flex flex-col justify-start items-center";
interface PricingBreakdownCardProps {
  locked: boolean;
}

const PricingBreakdownCard: FC<PricingBreakdownCardProps> = ({ locked }) => {
  const canEdit = useSelector(canUserEditProposal);

  const utilityPayment = useSelector(getUtilityMonthlyPayment);
  const { rateSchedule } = useSelector(getUtilityCompany);
  const grossPpw = useSelector(getGrossPpw);
  const grossSystemCost = useSelector(getGrossSystemCost);
  const federalItc = useSelector(getFederalTaxCredit);
  const solarPayment = useSelector(getSolarMonthlyPayment);
  const systemCost = useSelector(getCalculatedSystemCost);
  const systemDiscounts = useSelector(getDiscountsTotal);
  const { name: lenderName, isCash } = useSelector(getCurrentLenderInfo);
  const netPpw = useSelector(getNetPpw);
  const netSystemCost = useSelector(getNetSystemCost);
  const loanProduct = useSelector(getSelectedLoanProductName);
  const downPayment = useSelector(getDownPayment);

  const canEditDiscounts = useSelector(canUserManageDiscounts);
  const canEditGrossPrice = useSelector(canUserEditGrossPrice);
  const canAdjustTaxCredit = useSelector(canUserAdjustTaxCredit);

  return (
    <div className="relative flex flex-col bg-white rounded-lg">
      <TransparentBoxLock show={locked} />
      <div className="border-b border-gray-300">
        <div className="grid grid-cols-2">
          <ManageUtilityRateScheduleButton
            className={clsx(paymentButtonClasses, "border-r border-gray-300 rounded-tl-lg")}
            data-cy="manage-utility-rate-schedule-btn"
          >
            <PaymentButtonContents label="Utility Payment" cost={utilityPayment}>
              <div className="w-full text-xs text-center text-gray-500 mb-1 truncate">
                {rateSchedule ? <span title={rateSchedule}>Rate Schedule: {rateSchedule}</span> : undefined}
              </div>
            </PaymentButtonContents>
          </ManageUtilityRateScheduleButton>
          <OptimizeByMetricButton metric="payment" className={clsx(paymentButtonClasses, "rounded-tr-lg")}>
            <PaymentButtonContents label="Solar Payment" cost={solarPayment} />
          </OptimizeByMetricButton>
        </div>
      </div>
      <div className="flex-grow flex items-center mt-2 px-4 xl:px-8">
        <table className="table-auto w-full text-sm">
          <tbody>
            {!!systemCost && (
              <tr className="border-b border-gray-300">
                <td className="text-left py-2">
                  Calculated System Cost
                  <HideLocked>
                    <ManageSystemCostButton allowOptimize className="ml-2 px-1" data-cy="edit-system-cost-btn">
                      <FontAwesomeIcon className="text-primary-light" icon={faEdit} />
                    </ManageSystemCostButton>
                  </HideLocked>
                </td>
                <td className="text-right py-2">{numeral(systemCost).format("$0,0.00")}</td>
              </tr>
            )}
            <AdditionalItems />
            <tr className="border-b border-t border-gray-300">
              <td className="text-left py-2">
                Discounts
                {!!canEditDiscounts && (
                  <HideLocked>
                    <ManageDiscountsButton className="ml-2 px-1" data-cy="edit-discounts-btn">
                      <FontAwesomeIcon className="text-primary-light" icon={faEdit} />
                    </ManageDiscountsButton>
                  </HideLocked>
                )}
              </td>
              <td className="text-right py-2">{numeral(systemDiscounts).format("$0,0.00")}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="text-left py-2">
                Gross System Cost
                {canEditGrossPrice ? (
                  <HideLocked>
                    <ManageGrossSystemCostButton className="ml-2 px-1">
                      <FontAwesomeIcon className="text-primary-light" icon={faEdit} />
                    </ManageGrossSystemCostButton>
                  </HideLocked>
                ) : null}
              </td>
              <td className="text-right py-2">{numeral(grossSystemCost).format("$0,0.00")}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="text-left py-2">Gross PPW</td>
              <td className="text-right py-2">{numeral(grossPpw).format("$0,0.00")}</td>
            </tr>
            <tr className="border-b border-gray-300">
              <td className="text-left py-2">
                Federal ITC
                {isCash && canAdjustTaxCredit && (
                  <HideLocked>
                    <ManageTaxCreditsButton className="ml-2 px-1">
                      <FontAwesomeIcon className="text-primary-light" icon={faEdit} />
                    </ManageTaxCreditsButton>
                  </HideLocked>
                )}
              </td>
              <td className="text-right py-2">{numeral(federalItc).format("$0,0.00")}</td>
            </tr>
            {!!downPayment && (
              <tr className="border-b border-gray-300">
                <td className="py-2">Down Payment</td>
                <td className="py-2 text-right">{formatDollarsAndCents(downPayment * -1)}</td>
              </tr>
            )}
            <tr className="border-b border-gray-300">
              <td className="text-left py-2">Cost After Rebates</td>
              <td className="text-right py-2">{numeral(netSystemCost).format("$0,0.00")}</td>
            </tr>
            <tr>
              <td className="text-left py-2">PPW After Rebates</td>
              <td className="text-right py-2">{numeral(netPpw).format("$0,0.00")}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {canEdit ? (
        <div className="w-full flex justify-center items-center gap-3 py-2">
          <EditLockToggler />{" "}
          <FullPriceBreakdownButton className="ml-3">
            <FontAwesomeIcon className="text-gray-500" icon={faInfoCircle} size="lg" />
          </FullPriceBreakdownButton>
        </div>
      ) : null}
      <div className="mt-3 border-t border-gray-300">
        <ManageLenderButton className="w-full text-center py-4" data-cy="edit-lender-btn">
          <div className="font-light text-gray-700 mb-2">Loan Product</div>
          <div className="font-bold text-xl">{lenderName === "Cash" ? "Cash" : loanProduct}</div>
        </ManageLenderButton>
      </div>
    </div>
  );
};

export default PricingBreakdownCard;

const PaymentButtonContents: FC<{ label: string; cost: number }> = ({ children, label, cost }) => {
  return (
    <>
      <div className="mb-3 font-light text-gray-700">{label}</div>
      <div className="mb-2 flex-grow text-2xl font-bold">
        {numeral(cost).format("$0,0")} <small className="text-sm">/mo</small>
      </div>
      {children}
    </>
  );
};

const AdditionalItems = () => {
  const [showAdders, setShowAdders] = useState(false);

  const activeAdders = useSelector(getAllActiveAdders);
  const systemAddersTotal = useSelector(getSystemAddersTotal);
  const hasAdders = !!activeAdders.length;
  const isProposalLocked = useSelector(getIsProposalLocked);
  const hideValueAddersPriceFromCustomer = useSelector(getHideValueAddersPriceFromCustomer);

  return (
    <>
      <tr className="adders">
        <td className={clsx("text-left pt-2", hasAdders && showAdders ? "pb-1" : "pb-2")}>
          Additional Items
          {hasAdders ? (
            <button type="button" className="no-focus-ring" onClick={() => setShowAdders(!showAdders)}>
              <Caret className="mx-3" direction={showAdders ? "down" : "right"} />
            </button>
          ) : null}
          <HideLocked>
            <ManageAddersButton className="ml-2 px-1" data-cy="edit-adders-btn">
              <FontAwesomeIcon className="text-primary-light" icon={faEdit} />
            </ManageAddersButton>
          </HideLocked>
        </td>
        <td className={clsx("text-right pt-2", showAdders ? "pb-1" : "pb-2")}>
          {numeral(systemAddersTotal).format("$0,0.00")}
        </td>
      </tr>
      {showAdders && (
        <>
          {map(activeAdders, (adder, i) => {
            const last = i + 1 === activeAdders!.length;

            return (
              <tr key={adder["id"] ?? `custom_${i}`} className="adders">
                <td className={clsx("pl-3 text-xs", last && "pb-2")}>{adder.name}</td>
                <td className={clsx("font-bold text-right text-secondary text-xs", last && "pb-2")}>
                  {showAdderPrice(adder, {
                    isProposalLocked,
                    hideAddersPriceFromCustomerEpcSetting: hideValueAddersPriceFromCustomer,
                    isRepOnlyView: true,
                  })
                    ? formatDollarsAndCents(getCostForAdder(adder))
                    : null}
                </td>
              </tr>
            );
          })}
        </>
      )}
    </>
  );
};
