import map from "lodash/map";
import numeral from "numeral";
import React, { FC, useCallback, useState } from "react";
import { useSelector } from "react-redux";

import { faCircle, faSync } from "@fortawesome/pro-light-svg-icons";
import { faCheckCircle, faPlusCircle, faTrash } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { usePricingCalculator } from "../../../hooks/usePricingCalculator";
import {
  getAdderOptions,
  getCustomAdder,
  getHideValueAddersPriceFromCustomer,
  getIsProposalLocked,
  canAddCustomAdders,
} from "../../../lib/selectors";
import { getCostForAdder, showAdderPrice } from "../../../lib/utils";
import { Adder, CustomAdder } from "../../../types";
import BaseDrawer from "../../BaseDrawer";
import AddCustomAdderForm from "./AddCustomAdderForm";
import { WithGlobalDialogProps } from "../../../features/dialogs";

interface AdderRowProps<T = Adder> {
  adder: T;
  onToggle: () => Promise<void>;
  isLoading: boolean;
}

const ManagedAdderRow: FC<AdderRowProps> = props => {
  const { adder, onToggle, isLoading } = props;

  const isProposalLocked = useSelector(getIsProposalLocked);
  const hideValueAddersPriceFromCustomer = useSelector(getHideValueAddersPriceFromCustomer);

  const buttonIcon = adder.active ? faCheckCircle : faCircle;

  return (
    <div
      className="flex items-center border border-gray-800 text-gray-800 rounded-md py-3 px-4 mb-4"
      data-cy="adder-row"
    >
      <div className="flex-grow" data-cy="adder-description">
        {adder.name}
        {adder.allowQuantity ? (
          <span className="ml-2" data-cy="adder-quantity">
            x{" " + adder.quantity}
          </span>
        ) : null}
      </div>
      <div className="text-gray-900 font-bold pr-6" data-cy="adder-price">
        {showAdderPrice(adder, {
          isProposalLocked,
          hideAddersPriceFromCustomerEpcSetting: hideValueAddersPriceFromCustomer,
          isRepOnlyView: true,
        })
          ? numeral(getCostForAdder(adder)).format("$0,0")
          : null}
      </div>
      <div className="w-1/12 flex-shrink-0 text-right">
        <button
          type="button"
          onClick={onToggle}
          className={adder.active ? "text-primary-light" : "text-gray-600"}
          data-cy="adder-action-btn"
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={isLoading ? faSync : buttonIcon} size="lg" spin={isLoading} />
        </button>
      </div>
    </div>
  );
};

const CustomAdderRow: FC<AdderRowProps<CustomAdder>> = props => {
  const { adder, isLoading, onToggle } = props;

  return (
    <div
      className="flex items-center border border-gray-800 text-gray-800 rounded-md py-3 px-4 mb-4"
      data-cy="adder-row"
    >
      <div className="flex-grow" data-cy="adder-name">
        {adder.name}
      </div>
      <div className="text-gray-900 font-bold pr-6" data-cy="adder-price">
        {numeral(getCostForAdder(adder)).format("$0,0")}
      </div>
      <div className="w-1/12 flex-shrink-0 text-right">
        <button type="button" onClick={() => onToggle()} className={"text-red-600"} data-cy="adder-action-btn">
          <FontAwesomeIcon icon={isLoading ? faSync : faTrash} size="lg" spin={isLoading} />
        </button>
      </div>
    </div>
  );
};

const ManageAddersDrawer = ({ open, onClose }: WithGlobalDialogProps) => {
  const adders = useSelector(getAdderOptions);
  const customAdder = useSelector(getCustomAdder);
  const allowCustomAdders = useSelector(canAddCustomAdders);
  const [activeAdderId, setActiveAdderId] = useState<number | null>(null);
  const [showCustomAdderForm, setShowCustomAdderForm] = useState(false);

  const { isLoading, submit: toggleAdder } = usePricingCalculator("toggle-adder");

  const handleAdderToggle = useCallback(
    async (id: number) => {
      setActiveAdderId(id);
      await toggleAdder({ id });
      setActiveAdderId(null);
    },
    [toggleAdder]
  );

  const { isLoading: isCustomAdderLoading, submit: removeCustomAdder } = usePricingCalculator("remove-custom-adder");

  const handleCustomAdderToggle = useCallback(async () => removeCustomAdder(), [removeCustomAdder]);

  return (
    <BaseDrawer open={open} onClose={onClose} title="System and Sales Additional Items" data-cy="manage-adders-drawer">
      <div className="px-4 sm:px-6">
        <div className="flex flex-col">
          <div className="flex-grow text-base">
            <div className="mb-4 text-gray-700">
              Add all custom products or jobs that need to be added to the total price, including a description that
              will show up on the customer agreement.
            </div>

            <div className="mb-6">
              {map(adders, adder => (
                <ManagedAdderRow
                  key={adder.id}
                  adder={adder}
                  onToggle={() => handleAdderToggle(adder.id)}
                  isLoading={isLoading && adder.id === activeAdderId}
                />
              ))}

              {customAdder && (
                <CustomAdderRow
                  adder={customAdder}
                  isLoading={isCustomAdderLoading}
                  onToggle={handleCustomAdderToggle}
                />
              )}

              {allowCustomAdders && showCustomAdderForm && (
                <AddCustomAdderForm
                  customAdder={customAdder}
                  onClose={() => {
                    setShowCustomAdderForm(false);
                  }}
                />
              )}
              {allowCustomAdders && !showCustomAdderForm && (
                <button
                  type="button"
                  className="w-full flex border border-gray-300 rounded-md py-3 px-4 mb-4"
                  onClick={() => setShowCustomAdderForm(true)}
                  data-cy="show-custom-adder-btn"
                >
                  <div className="flex-shrink-0 text-primary-dark mr-2">
                    <FontAwesomeIcon icon={faPlusCircle} />
                  </div>
                  {/* todo disabled if survey is locked */}
                  <div className="text-primary-dark text-left flex-grow">
                    {customAdder ? "Update" : "Add"} Custom Product
                  </div>
                </button>
              )}
            </div>
          </div>
          <div className="text-xl pt-4 border-t border-gray-300 text-right">
            <button type="button" className="btn-gray rounded-md py-3 px-6 font-bold" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </BaseDrawer>
  );
};

export default ManageAddersDrawer;
