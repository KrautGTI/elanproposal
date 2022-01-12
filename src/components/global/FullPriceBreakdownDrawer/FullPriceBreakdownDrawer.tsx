import clsx from "clsx";
import isNil from "lodash/isNil";
import map from "lodash/map";
import numeral from "numeral";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { faSync } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { WithGlobalDialogProps } from "../../../features/dialogs";
import { usePricingCalculator } from "../../../hooks/usePricingCalculator";
import { canUserEditProposal, getFullPricingBreakdown } from "../../../lib/selectors";
import BaseDrawer from "../../BaseDrawer";

const BreakdownTable = styled.table`
  tr > td {
    --tw-border-opacity: 1;
    border-color: rgba(224, 224, 224, var(--tw-border-opacity));
    border-top-width: 1px;
    border-bottom-width: 1px;
  }

  tr:nth-child(odd) > td {
    --tw-bg-opacity: 1;
    background-color: rgba(238, 238, 238, var(--tw-bg-opacity));
  }

  td {
    padding: 0.75rem 1rem;
  }
`;

const toCurrency = (num: string | number | undefined) => (isNil(num) ? null : numeral(num).format("$0,0.00"));

const FullPriceBreakdownDrawer = ({ open, onClose }: WithGlobalDialogProps) => {
  const canEdit = useSelector(canUserEditProposal);
  const pricingBreakdown = useSelector(getFullPricingBreakdown);

  let systemOverrideType = (pricingBreakdown) => {
    if (pricingBreakdown?.systemCostOverride === true) {
      return <span className="text-cost-dark">(System cost override)</span>;
    } else if (pricingBreakdown?.grossCostOverride === true) {
      return <span className="text-cost-dark">(Gross system override)</span>;
    } else {
      return <></>;
    }
  }



  const { submit: resetPrice, isLoading: isResettingPrice } = usePricingCalculator("reset-price");

  return (
    <BaseDrawer open={open} onClose={onClose} title="Pricing & Installer Adders" data-cy="full-price-breakdown-drawer">
      <div className="flex flex-col p-4">
        <BreakdownTable className="w-full table-auto text-sm sm:text-base">
          <tbody>
            <tr className="border-t border-b border-gray-300">
              <td>Base PPW</td>
              <td className="text-right">{toCurrency(pricingBreakdown?.startingPpwBase)}</td>
            </tr>
            <tr className="border-b-4 border-gray-500">
              <td>Base System Cost</td>
              <td className="text-right">{toCurrency(pricingBreakdown?.startingBaseCost)}</td>
            </tr>
            {map(pricingBreakdown?.adders, ({ name, value, cost }) => (
              <tr key={`${name}${value}${cost}`}>
                <td>
                  {name}: {value}
                </td>
                <td className="text-right">{toCurrency(cost)}</td>
              </tr>
            ))}

            <tr>
              <td>Total Sales Adders</td>
              <td className="text-right">{toCurrency(pricingBreakdown?.totalCostBeforeFees)}</td>
            </tr>

            <tr>
              <td>PPW System &amp; Adders</td>
              <td className="text-right">{toCurrency(pricingBreakdown?.ppwNet)}</td>
            </tr>

            <tr>
              <td>Total System Cost + Adders</td>
              <td className="text-right">{toCurrency(pricingBreakdown?.totalSystemCostBeforeFees)}</td>
            </tr>

            {(pricingBreakdown?.dealerFeePercent ?? 0) > 0 && !pricingBreakdown?.hideDealerFees ? (
              <tr className="border-b-4 border-gray-500">
                <td>Lender Dealer Fees</td>
                <td className="text-right">
                  <LenderDealerFeeText>
                    {toCurrency(pricingBreakdown?.calculatedDealerFees)} ({pricingBreakdown?.dealerFeePercent}%)
                  </LenderDealerFeeText>
                </td>
              </tr>
            ) : null}
            <tr>
              <td>Final PPW&nbsp;
                { systemOverrideType(pricingBreakdown) }
              </td>
              <td className="text-right">
                {toCurrency(pricingBreakdown?.ppwFull)}</td>
            </tr>
            <tr>
              <td>Final Cost after Fees &amp; Adders</td>
              <td className="text-right">{toCurrency(pricingBreakdown?.totalSystemCost)}</td>
            </tr>
          </tbody>
        </BreakdownTable>
        <div className={clsx("flex pt-4 px-3 border-t border-gray-300", canEdit ? "justify-between" : "justify-end")}>
          {canEdit && (
            <button
              type="button"
              className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-xl font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => resetPrice()}
              disabled={isResettingPrice}
            >
              {isResettingPrice ? <FontAwesomeIcon icon={faSync} spin /> : "Reset"}
            </button>
          )}
          <button type="button" className="btn-gray rounded-md text-xl py-3 px-6 font-bold" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </BaseDrawer>
  );
};

export default FullPriceBreakdownDrawer;

const LenderDealerFeeText = styled.span`
  white-space: nowrap !important;
`;
