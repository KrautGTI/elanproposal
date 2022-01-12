import clsx from "clsx";
import numeral from "numeral";
import React, { FC, useState } from "react";
import { useSelector } from "react-redux";

import { faEdit } from "@fortawesome/pro-duotone-svg-icons";
import { faInfoSquare } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Caret } from "../../components/Caret";
import { ManageAddersButton } from "../../components/forms/ManageAdders";
import { ManageDiscountsButton } from "../../components/forms/ManageDiscounts";
import { ManageGrossSystemCostButton } from "../../components/forms/ManageGrossSystemCost";
import { ManageSystemCostButton } from "../../components/forms/ManageSystemCost";
import { FullPriceBreakdownButton } from "../../components/global/FullPriceBreakdownDrawer";
import HideLocked from "../../components/HideLocked";
import {
  canUserEditGrossPrice,
  canUserManageDiscounts,
  canUserEditProposal,
  getAllActiveAdders,
  getAllActiveDiscounts,
  getAllNetRebatesAndCredits,
  getAllGrossRebatesAndCredits,
  getCalculatedSystemCost,
  getDiscountsTotal,
  getDownPayment,
  getEstimatedYearlyProduction,
  getNeedFinancedAmount,
  getIsProposalLocked,
  getNetSystemCost,
  getPanelCount,
  getNetRebatesAndCreditsTotal,
  getSolarOffset,
  getSystemAddersTotal,
  getSystemSizeInKw,
  getGrossCostRebatesTotal,
  getHideValueAddersPriceFromCustomer,
  getIsLeaseOrPpa,
  getIsPpa,
  getLoanTermYears,
  getEscalator,
  getLenderFootnote,
} from "../../lib/selectors";
import { formatDollarsAndCents, getCostForAdder, getFormattedDiscountAmount, showAdderPrice } from "../../lib/utils";

const PricingBreakdownCard: FC<{ className?: string }> = ({ className }) => {
  const canManageDiscounts = useSelector(canUserManageDiscounts);
  const canEditGrossPrice = useSelector(canUserEditGrossPrice);
  const canEditProposal = useSelector(canUserEditProposal);
  const isProposalLocked = useSelector(getIsProposalLocked);

  const activeAdders = useSelector(getAllActiveAdders);
  const activeDiscounts = useSelector(getAllActiveDiscounts);
  const annualProduction = useSelector(getEstimatedYearlyProduction);
  const discountsTotal = useSelector(getDiscountsTotal);
  const downPayment = useSelector(getDownPayment);
  const needFinancedAmount = useSelector(getNeedFinancedAmount);
  const netSystemCost = useSelector(getNetSystemCost);
  const panelCount = useSelector(getPanelCount);
  const rebatesAndCredits = useSelector(getAllNetRebatesAndCredits);
  const rebatesAndCreditsTotal = useSelector(getNetRebatesAndCreditsTotal);
  const grossCostRebatesTotal = useSelector(getGrossCostRebatesTotal);
  const solarOffset = useSelector(getSolarOffset);
  const systemAddersTotal = useSelector(getSystemAddersTotal);
  const systemCost = useSelector(getCalculatedSystemCost);
  const systemSizeKw = useSelector(getSystemSizeInKw);
  const grossCostRebates = useSelector(getAllGrossRebatesAndCredits);
  const hideValueAddersPriceFromCustomer = useSelector(getHideValueAddersPriceFromCustomer);
  const escalator = useSelector(getEscalator);

  const showDiscountsRow = !isProposalLocked || discountsTotal > 0;

  const isLeaseOrPpa = useSelector(getIsLeaseOrPpa);
  const isPpa = useSelector(getIsPpa);
  const loanTermYers = useSelector(getLoanTermYears);

  const lenderFootnote = useSelector(getLenderFootnote);

  const showEscalator = escalator !== null && isLeaseOrPpa;

  return (
    <div
      className={clsx("border border-gray-900 border-opacity-20 shadow-lg rounded-md overflow-hidden", className)}
      data-cy="pricing-breakdown-card"
    >
      <table className="w-full">
        <thead className="text-xl border-b border-gray-400">
          <tr className="bg-gray-200">
            <td className="px-4 py-4">
              Price Summary
              {!!canEditProposal && (
                <FullPriceBreakdownButton className="ml-2 px-1" data-cy="full-price-breakdown-btn">
                  <FontAwesomeIcon className="text-gray-500" icon={faInfoSquare} />
                </FullPriceBreakdownButton>
              )}
            </td>
            <td className="px-4 py-4 text-right" data-cy="system-size">
              <span className="text-secondary mr-2">{systemSizeKw} kW</span>{" "}
              <span className="text-gray-600">System</span>
            </td>
          </tr>
        </thead>
        <tbody className="text-lg bg-white text-gray-700">
          <tr>
            <td className="px-4 py-3">Year 1 System Production</td>
            <td className="px-4 py-3 text-right text-gray-600" data-cy="first-year-production">
              {numeral(annualProduction ?? 0).format("0,0")} kWh
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3">Solar Offset</td>
            <td className="px-4 py-3 text-right text-gray-600" data-cy="solar-offset">
              {solarOffset}%
            </td>
          </tr>
          {!!panelCount && (
            <tr>
              <td className="px-4 py-3">Number of Panels</td>
              <td className="px-4 py-3 text-right text-gray-600" data-cy="panel-count">
                {numeral(panelCount).format("0,0")}
              </td>
            </tr>
          )}
          {!isLeaseOrPpa && !!systemCost && (
            <tr className="border-t border-gray-400">
              <td className="px-4 py-3">
                System Cost
                <HideLocked>
                  <ManageSystemCostButton className="ml-2 px-1">
                    <FontAwesomeIcon className="text-primary-light" icon={faEdit} />
                  </ManageSystemCostButton>
                </HideLocked>
              </td>
              <td className="px-4 py-3 font-bold text-right text-cost" data-cy="calculated-system-cost">
                {formatDollarsAndCents(systemCost)}
              </td>
            </tr>
          )}

          {isLeaseOrPpa ? null : (
            <>
              <CollapseableRows
                label="Additional Items"
                value={
                  hideValueAddersPriceFromCustomer && isProposalLocked ? "" : formatDollarsAndCents(systemAddersTotal)
                }
                qaId="additional-items"
                valueClassName="text-cost"
                renderEditButton={() => (
                  <ManageAddersButton className="ml-2 px-1">
                    <FontAwesomeIcon className="text-primary-light" icon={faEdit} />
                  </ManageAddersButton>
                )}
                items={activeAdders}
                renderDetailRow={(adder, idx) => (
                  <tr key={adder["id"] ?? `custom_${idx}`} data-cy={`adders-row-${idx}`}>
                    <td className="pl-8 py-0 text-base">{adder.name}
                      {"allowQuantity" in adder && adder.allowQuantity ? <span data-cy="adder-quantity">{` x ${adder.quantity}`}</span> : null}
                    </td>
                    <td className="px-4 py-0 text-right text-gray-600 text-base">
                      {showAdderPrice(adder, {
                        isProposalLocked,
                        hideAddersPriceFromCustomerEpcSetting: hideValueAddersPriceFromCustomer,
                        isRepOnlyView: false,
                      })
                        ? formatDollarsAndCents(getCostForAdder(adder))
                        : null}
                    </td>
                  </tr>
                )}
              />

              {showDiscountsRow && (
                <CollapseableRows
                  label="Discounts"
                  value={formatDollarsAndCents(discountsTotal * -1)}
                  qaId="discounts"
                  valueClassName="text-savings-dark"
                  renderEditButton={() =>
                    canManageDiscounts ? (
                      <ManageDiscountsButton className="ml-2 px-1">
                        <FontAwesomeIcon className="text-primary-light" icon={faEdit} />
                      </ManageDiscountsButton>
                    ) : null
                  }
                  items={activeDiscounts}
                  renderDetailRow={(discount, idx) => (
                    <tr key={discount["id"] ?? `custom_${idx}`} data-cy={`discounts-row-${idx}`}>
                      <td className="pl-8 py-0 text-base">{discount.name}</td>
                      <td className="px-4 py-0 text-right text-gray-600 text-base">
                        -{getFormattedDiscountAmount(discount)}
                      </td>
                    </tr>
                  )}
                />
              )}

              {grossCostRebates.length > 0 && (
                <CollapseableRows
                  label="Gross Cost Rebates or Credits"
                  value={formatDollarsAndCents(grossCostRebatesTotal * -1)}
                  qaId="gross-cost-rebates"
                  valueClassName="text-savings-dark"
                  items={grossCostRebates}
                  renderDetailRow={(credit, idx) => (
                    <tr key={credit.name + credit.value} data-cy={`gross-cost-rebates-row-${idx}`}>
                      <td className="pl-8 py-0 text-base">{credit.name}</td>
                      <td className="px-4 py-0 text-right text-gray-600 text-base">
                        {formatDollarsAndCents(credit.value * -1)}
                      </td>
                    </tr>
                  )}
                />
              )}

              {!!needFinancedAmount && (
                <tr>
                  <td className="px-4 py-3">
                    Gross System Cost {!!lenderFootnote && <sup>1</sup>}
                    {canEditGrossPrice ? (
                      <HideLocked>
                        <ManageGrossSystemCostButton className="ml-2 px-1" data-cy="manage-gross-system-cost-btn">
                          <FontAwesomeIcon className="text-primary-light" icon={faEdit} />
                        </ManageGrossSystemCostButton>
                      </HideLocked>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 font-bold text-right text-cost" data-cy="gross-sytem-cost">
                    {formatDollarsAndCents(needFinancedAmount)}
                  </td>
                </tr>
              )}

              <CollapseableRows
                label={
                  <span>
                    Net Cost Rebates or Credits {!!lenderFootnote && !!needFinancedAmount ? <sup>2</sup> : <sup>1</sup>}
                  </span>
                }
                value={formatDollarsAndCents(rebatesAndCreditsTotal * -1)}
                qaId="net-cost-rebates"
                valueClassName="text-savings-dark"
                items={rebatesAndCredits}
                renderDetailRow={(credit, idx) => (
                  <tr key={credit.name + credit.value} data-cy={`net-cost-rebates-row-${idx}`}>
                    <td className="pl-8 py-0 text-base">{credit.name}</td>
                    <td className="px-4 py-0 text-right text-gray-600 text-base">
                      {formatDollarsAndCents(credit.value * -1)}
                    </td>
                  </tr>
                )}
              />

              {!!downPayment && (
                <tr>
                  <td className="px-4 py-3">Down Payment</td>
                  <td className="px-4 py-3 font-bold text-right text-gray-600" data-cy="down-payment">
                    {formatDollarsAndCents(downPayment * -1)}
                  </td>
                </tr>
              )}
            </>
          )}
          {showEscalator && (
            <tr className="border-t border-gray-400">
              <td className="px-4 py-3">$/kwH Escalator</td>
              <td className="px-4 py-3 font-bold text-right" data-cy="rate-escalator">
                {escalator}%
              </td>
            </tr>
          )}
        </tbody>
        {isLeaseOrPpa ? (
          <tfoot className="text-lg bg-white">
            <tr className="border-t border-gray-400">
              <td className="px-4 py-4">{`${isPpa ? "PPA" : "Lease"} Term`}</td>
              <td className="px-4 py-4 font-bold text-right" data-cy="loan-term-years">
                {loanTermYers} Yrs
              </td>
            </tr>
          </tfoot>
        ) : (
          <tfoot className="text-lg bg-white">
            <tr className="border-t border-gray-400">
              <td className="px-4 py-4">Net System Cost</td>
              <td className="px-4 py-4 font-bold text-right" data-cy="net-system-cost">
                {formatDollarsAndCents(netSystemCost, "Could not calculate")}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default PricingBreakdownCard;

interface CollapseableRowsProps<T> {
  label: string | JSX.Element;
  value: string;
  valueClassName: string;
  items: T[] | undefined;
  renderEditButton?: () => JSX.Element | null;
  renderDetailRow: (item: T, idx: number) => JSX.Element;
  defaultExpanded?: boolean;
  qaId: string;
}

function CollapseableRows<T>({
  label,
  value,
  valueClassName,
  items,
  renderEditButton,
  renderDetailRow,
  defaultExpanded = false,
  qaId,
}: CollapseableRowsProps<T>) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <>
      <tr className={clsx({ open: expanded })} data-cy={qaId}>
        <td className="px-4 pb-1" data-cy={`${qaId}-label`}>
          {label}
          {items?.length ? (
            <button
              type="button"
              className="no-focus-ring"
              onClick={() => setExpanded(prev => !prev)}
              data-cy={`${qaId}-caret`}
            >
              <Caret className="mx-3" direction={expanded ? "down" : "right"} />
            </button>
          ) : null}
          {!!renderEditButton && <HideLocked>{renderEditButton()}</HideLocked>}
        </td>
        <td className={clsx("px-4 py-3 font-bold text-right", valueClassName)} data-cy={`${qaId}-total`}>
          {value}
        </td>
      </tr>
      {expanded && items?.map(renderDetailRow)}
    </>
  );
}
