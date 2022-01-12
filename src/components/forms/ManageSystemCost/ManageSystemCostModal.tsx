import clsx from "clsx";
import numeral from "numeral";
import React, { useMemo, useState } from "react";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import { faSync } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { createSelector } from "@reduxjs/toolkit";

import { WithGlobalDialogProps } from "../../../features/dialogs";
import { submitOptimization } from "../../../features/proposal";
import { usePricingCalculator } from "../../../hooks/usePricingCalculator";
import { setServerErrors, SystemCostCalculator, TransformCurrency } from "../../../lib/form-helpers";
import { getFullPricingBreakdown, getSystemSizeInWatts } from "../../../lib/selectors";
import { CalculatePricingPayload } from "../../../types";
import ZoomDialog from "../../ZoomDialog";

interface ChangeSystemCostModalProps {
  allowOptimize?: boolean;
}

const systemCostSchema = yup.object({
  ppw: yup.number().defined(),
  systemCost: yup.number().defined(),
  optimizeDesign: yup.boolean().defined(),
});

type FormValues = { optimizeDesign: boolean } & CalculatePricingPayload<"change-price">;

const ManageSystemCostModal = ({
  open,
  onClose,
  afterLeave,
  allowOptimize,
}: WithGlobalDialogProps<ChangeSystemCostModalProps>) => {
  const dispatch = useDispatch();

  const [ppwFocused, setPpwFocused] = useState(false);
  const [costFocused, setCostFocused] = useState(false);

  const startingPpw = useSelector(getStartingPpw);
  const startingCost = useSelector(getStartingCost);
  const systemSizeInWatts = useSelector(getSystemSizeInWatts);

  const defaultValues = useMemo(
    () => ({
      systemCost: startingCost,
      ppw: startingPpw,
      optimizeDesign: false,
    }),
    [startingCost, startingPpw]
  );

  const form = useForm<FormValues>({
    mode: "all",
    defaultValues,
    resolver: yupResolver(systemCostSchema),
  });

  const { submit: changePrice } = usePricingCalculator("change-price");

  const onSubmit: SubmitHandler<FormValues> = async values => {
    if (values.optimizeDesign) {
      const { payload } = (await dispatch(
        submitOptimization({
          type: "systemCost",
          data: {
            systemCost: values.systemCost,
            ppw: values.ppw,
          },
        })
      )) as any;

      if (payload.errors) {
        setServerErrors(form, payload.errors);
      } else {
        onClose();
      }
    } else {
      await changePrice({
        systemCost: values.systemCost,
        ppw: values.ppw,
      });

      onClose();
    }
  };

  return (
    <ZoomDialog open={open} onClose={onClose} afterLeave={afterLeave} data-cy="change-system-cost-modal">
      <div className="flex flex-col p-4">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ZoomDialog.Header
              title={
                allowOptimize ? (
                  <div>
                    Modify <span className="font-bold text-primary-500">System Cost</span>
                    <span className="ml-2 text-sm text-gray-500">(before fees)</span>
                  </div>
                ) : (
                  <div>Change Base System Pricing</div>
                )
              }
              onClose={onClose}
            />
            <div className="flex-grow p-4 text-base">
              {!allowOptimize && (
                <div className="mb-4 text-gray-700">
                  Change the base system price (before fees) &amp; save to recalculate.
                </div>
              )}
              <div className={clsx("flex items-center p-1", !allowOptimize && "border-t border-gray-300")}>
                <div className="p-2 w-1/2 font-bold">
                  <div>Base PPW</div>
                  <div className="text-xs font-normal" data-cy="current-ppw">
                    Current: {numeral(startingPpw).format("$0,0[.]00")}
                  </div>
                </div>
                <div className="p-2 w-1/2 font-bold">
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Controller
                      name="ppw"
                      render={({ field, formState }) => (
                        <input
                          {...field}
                          type="text"
                          autoComplete="off"
                          autoCorrect="off"
                          className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder="0.30"
                          disabled={formState.isSubmitting}
                          onChange={e => {
                            let val = TransformCurrency.output(e);
                            field.onChange(val);

                            if (typeof val === "number") {
                              form.setValue("systemCost", SystemCostCalculator.ppwToCost(val, systemSizeInWatts), {
                                shouldValidate: true,
                                shouldDirty: false,
                              });
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
                          data-cy="ppw-input"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center border-t border-gray-300 p-1">
                <div className="p-2 w-1/2 font-bold">
                  <div>New System Cost</div>
                  <div className="text-xs font-normal">Current: {numeral(startingCost).format("$0,0[.]00")}</div>
                </div>
                <div className="p-2 w-1/2 font-bold">
                  <Controller
                    name="systemCost"
                    render={({ field, formState }) => (
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          {...field}
                          type="text"
                          autoComplete="off"
                          autoCorrect="off"
                          className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder={numeral(startingCost).format("0,0[.]00")}
                          disabled={formState.isSubmitting}
                          onChange={e => {
                            let val = TransformCurrency.output(e);
                            field.onChange(val);

                            if (typeof val === "number") {
                              form.setValue("ppw", SystemCostCalculator.costToPpw(val, systemSizeInWatts), {
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
                          data-cy="system-cost-input"
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
              {!!allowOptimize && (
                <div className="flex items-center px-1 pt-4">
                  <Controller
                    name="optimizeDesign"
                    render={({ field, formState }) => (
                      <div className="flex items-center">
                        <input
                          {...field}
                          type="checkbox"
                          checked={field.value}
                          id="optimize_design"
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          disabled={formState.isSubmitting}
                          onChange={e => {
                            field.onChange(e.target.checked);
                          }}
                          data-cy="optimize-checkbox"
                        />
                        <label htmlFor="optimize_design" className="ml-2 block text-xs text-gray-600">
                          I want the system to be resized to closely match this new system cost
                        </label>
                      </div>
                    )}
                  />
                </div>
              )}
            </div>
            <div className="text-xl pt-2 border-b border-gray-300">
              <button
                type="submit"
                className="btn-primary w-full rounded-md py-3 font-bold"
                disabled={form.formState.isSubmitting}
                data-cy="submit-modify-system-cost"
              >
                {form.formState.isSubmitting ? <FontAwesomeIcon icon={faSync} spin /> : <>Save</>}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </ZoomDialog>
  );
};

export default ManageSystemCostModal;

// todo move these numbers into solarCosts since they are no longer only being used in pricingBreakdown
const getStartingPpw = createSelector([getFullPricingBreakdown], pricingBreakdown => pricingBreakdown?.startingPpwBase);

// todo why is this a string 🙄
const getStartingCost = createSelector([getFullPricingBreakdown], pricingBreakdown =>
  typeof pricingBreakdown?.startingBaseCost === "string"
    ? parseFloat(pricingBreakdown?.startingBaseCost.replace(/,/g, "") ?? "0")
    : pricingBreakdown?.startingBaseCost ?? 0
);
