import numeral from "numeral";
import React, { useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";

import { faSync } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";

import { WithGlobalDialogProps } from "../../../features/dialogs";
import { usePricingCalculator } from "../../../hooks/usePricingCalculator";
import { SystemCostCalculator, TransformCurrency } from "../../../lib/form-helpers";
import { getGrossPpw, getGrossSystemCost, getSystemSizeInWatts } from "../../../lib/selectors";
import { CalculatePricingPayload } from "../../../types";
import ZoomDialog from "../../ZoomDialog";

const grossSystemCostSchema = yup.object({
  ppw: yup.number().defined(),
  systemCost: yup.number().defined(),
});

type FormValues = CalculatePricingPayload<"change-gross-price">;

const ManageGrossSystemCostModal = ({ open, onClose, afterLeave }: WithGlobalDialogProps) => {
  const [ppwFocused, setPpwFocused] = useState(false);
  const [costFocused, setCostFocused] = useState(false);

  const grossPpw = useSelector(getGrossPpw);
  const grossSystemCost = useSelector(getGrossSystemCost);
  const systemSizeInWatts = useSelector(getSystemSizeInWatts);

  const defaultValues = useMemo(
    () => ({
      systemCost: grossSystemCost ?? 0,
      ppw: grossPpw ?? 0,
    }),
    [grossSystemCost, grossPpw]
  );

  const { submit: resetPrice, isLoading: isResettingPrice } = usePricingCalculator("reset-price");
  const { submit: changeGrossPrice } = usePricingCalculator("change-gross-price");

  const formMethods = useForm<FormValues>({
    mode: "all",
    defaultValues,
    resolver: yupResolver(grossSystemCostSchema),
  });

  const onSubmit = async ({ systemCost, ppw }) => {
    await changeGrossPrice({ systemCost, ppw });

    onClose();
  };

  const handleReset = async () => {
    await resetPrice();

    onClose();
  };

  const isLoading = formMethods.formState.isSubmitting || isResettingPrice;

  return (
    <ZoomDialog open={open} onClose={onClose} afterLeave={afterLeave} data-cy="manage-gross-cost-modal">
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <div className="flex flex-col p-4">
            <ZoomDialog.Header title="Gross Price Override" onClose={onClose} />
            <div className="flex-grow p-4 text-base">
              <div className="mb-5">
                Changing the price below will override all calculations and make this your final system price. NOTE:
                Line items may not add up after you make this change.
              </div>
              <div className="flex justify-center items-center pb-4 border-b border-gray-300 mb-4">
                <div className="w-1/2 font-bold text-base">Final PPW</div>
                <div className="w-1/2">
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Controller
                      name="ppw"
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          autoComplete="off"
                          autoCorrect="off"
                          className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder={numeral(grossPpw).format("0,0[.]00")}
                          disabled={isLoading}
                          onChange={e => {
                            let val = TransformCurrency.output(e);
                            field.onChange(val);

                            if (typeof val === "number") {
                              formMethods.setValue(
                                "systemCost",
                                SystemCostCalculator.ppwToCost(val, systemSizeInWatts),
                                {
                                  shouldValidate: true,
                                  shouldDirty: false,
                                }
                              );
                            }
                          }}
                          onFocus={() => {
                            setPpwFocused(true);
                          }}
                          onBlur={() => {
                            field.onBlur();
                            setPpwFocused(false);
                          }}
                          value={TransformCurrency.input(field.value, { focused: ppwFocused })}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center mb-4">
                <div className="w-1/2 font-bold text-base">Final System Cost</div>
                <div className="w-1/2">
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Controller
                      name="systemCost"
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          autoComplete="off"
                          autoCorrect="off"
                          className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder={numeral(grossSystemCost).format("0,0[.]00")}
                          disabled={isLoading}
                          onChange={e => {
                            let val = TransformCurrency.output(e);
                            field.onChange(val);

                            if (typeof val === "number") {
                              formMethods.setValue("ppw", SystemCostCalculator.costToPpw(val, systemSizeInWatts), {
                                shouldValidate: true,
                                shouldDirty: false,
                              });
                            }
                          }}
                          onFocus={() => {
                            setCostFocused(true);
                          }}
                          onBlur={() => {
                            field.onBlur();
                            setCostFocused(false);
                          }}
                          value={TransformCurrency.input(field.value, { focused: costFocused })}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xl pt-4 border-t border-gray-300 flex flex-row-reverse">
              <div className="flex flex-row-reverse">
                <button type="submit" className="btn-primary rounded-md py-3 px-6 font-bold" disabled={isLoading}>
                  {formMethods.formState.isSubmitting ? <FontAwesomeIcon icon={faSync} spin /> : "Save"}
                </button>
                <button type="button" className="btn-gray rounded-md py-3 px-6 font-bold mr-3" onClick={onClose}>
                  Cancel
                </button>
              </div>
              <div className="flex-grow">
                <button
                  type="button"
                  className="btn border border-gray-500 text-gray-500 rounded-md py-3 px-6 font-bold"
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  {isResettingPrice ? <FontAwesomeIcon icon={faSync} spin /> : "Reset"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </ZoomDialog>
  );
};

export default ManageGrossSystemCostModal;
