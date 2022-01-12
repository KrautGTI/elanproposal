import clsx from "clsx";
import includes from "lodash/includes";
import map from "lodash/map";
import React, { FC, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { faCircle, faSync } from "@fortawesome/pro-light-svg-icons";
import { faCheckCircle, faPlusCircle, faTrash } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { WithGlobalDialogProps } from "../../../features/dialogs";
import { usePricingCalculator } from "../../../hooks/usePricingCalculator";
import {
  canAddCustomDiscounts,
  getActiveDiscountIds,
  getCustomDiscount,
  getDiscountOptions
} from "../../../lib/selectors";
import { getFormattedDiscountAmount } from "../../../lib/utils";
import { Discount } from "../../../types";
import BaseDrawer from "../../BaseDrawer";
import AddCustomDiscountForm from "./AddCustomDiscountForm";

interface DiscountRowProps {
  discount: Discount;
  enabled: boolean;
  isLoading: boolean;
  onToggle: () => void;
  custom?: boolean;
}

const DiscountRow: FC<DiscountRowProps> = ({ discount, enabled, isLoading, onToggle, custom }) => {
  const { actionIcon, actionClass } = useMemo(() => {
    if (custom) {
      return { actionIcon: faTrash, actionClass: "text-red-600" };
    }

    return {
      actionIcon: enabled ? faCheckCircle : faCircle,
      actionClass: enabled ? "text-primary-light" : "text-gray-600",
    };
  }, [custom, enabled]);

  return (
    <div
      className="flex items-center border border-gray-800 text-gray-800 rounded-md py-3 px-4 mb-4 cursor-pointer"
      data-cy="discount-row"
    >
      <div className="flex-grow" data-cy="discount-name">
        {discount.name}
      </div>
      <div className="text-savings-dark font-bold pr-6" data-cy="discount-amount">
        -{getFormattedDiscountAmount(discount)}
      </div>
      <div className={clsx("w-1/12 flex-shrink-0 text-right", actionClass)}>
        {isLoading ? (
          <FontAwesomeIcon icon={faSync} spin data-cy="discount-loading" />
        ) : (
          <button type="button" onClick={onToggle} data-cy="discount-action-btn">
            <FontAwesomeIcon icon={actionIcon} size="lg" />
          </button>
        )}
      </div>
    </div>
  );
};

const ManageDiscountsDrawer = ({ open, onClose }: WithGlobalDialogProps) => {
  const [showCustomDiscountForm, setShowCustomDiscountForm] = useState(false);

  const { isLoading: isSelecting, submit: applyDiscount } = usePricingCalculator("apply-discount");
  const { isLoading: isRemoving, submit: removeDiscount } = usePricingCalculator("remove-discount");
  const { isLoading: isLoadingCustom, submit: submitCustomDiscount } = usePricingCalculator("custom-discount");

  const isLoading = isSelecting || isRemoving;

  const discounts = useSelector(getDiscountOptions);
  const activeDiscountIds = useSelector(getActiveDiscountIds);
  const customDiscount = useSelector(getCustomDiscount);
  const allowCustomDiscounts = useSelector(canAddCustomDiscounts);

  const handleClickDiscount = id => {
    if (includes(activeDiscountIds, id)) {
      removeDiscount({ id });
    } else {
      applyDiscount({ id });
    }
  };

  return (
    <BaseDrawer open={!!open} onClose={onClose} title="Discounts" data-cy="manage-discounts-drawer">
      <div className="flex flex-col">
        <div className="flex-grow p-4 text-base">
          {map(discounts, (discount, i) => (
            <DiscountRow
              key={discount.id ?? i}
              discount={discount}
              enabled={includes(activeDiscountIds, discount.id)}
              isLoading={isLoading}
              onToggle={() => handleClickDiscount(discount.id)}
            />
          ))}

          {!!customDiscount && (
            <DiscountRow
              discount={customDiscount}
              enabled
              isLoading={isLoadingCustom}
              onToggle={() => submitCustomDiscount({ ...customDiscount, amount: 0 })}
              custom
            />
          )}

          {allowCustomDiscounts && showCustomDiscountForm && (
            <AddCustomDiscountForm customDiscount={customDiscount} onClose={() => setShowCustomDiscountForm(false)} />
          )}
          {allowCustomDiscounts && !showCustomDiscountForm && (
            <button
              type="button"
              className="w-full flex border border-gray-300 rounded-md py-3 px-4 mb-4"
              onClick={() => setShowCustomDiscountForm(true)}
              data-cy="show-custom-discount-btn"
            >
              <div className="flex-shrink-0 text-primary-dark mr-2">
                <FontAwesomeIcon icon={faPlusCircle} />
              </div>
              {/* todo disabled if survey is locked */}
              <div className="text-primary-dark text-left flex-grow">
                {customDiscount ? "Update" : "Add"} Custom Discount
              </div>
            </button>
          )}
        </div>
        <div className="text-xl pt-4 border-t border-gray-300 text-right">
          <button type="button" className="btn-gray rounded-md py-3 px-6 font-bold mr-3" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </BaseDrawer>
  );
};

export default ManageDiscountsDrawer;
