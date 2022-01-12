import find from "lodash/find";
import toInteger from "lodash/toInteger";
import React, { useEffect, useMemo } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";

import { WithGlobalDialogProps } from "../../../features/dialogs";
import { getAllPossibleLenders, getLenderRateOptionsMap, getMissingLenderRate } from "../../../lib/selectors";
import { SelectOption } from "../../../types";
import FormErrorMessage from "../../FormErrorMessage";
import ZoomDialog from "../../ZoomDialog";
import { useChangeLenderForm } from "./useChangeLenderForm";

const ManageLenderModal = ({ open, onClose, afterLeave }: WithGlobalDialogProps) => {
  const { form, onSubmit } = useChangeLenderForm({
    onSubmitSuccess: () => {
      onClose();
    },
  });

  const missingLenderRate = useSelector(getMissingLenderRate);
  const lenderOptions = useLenderOptions();

  const selectedLenderId = form.watch("lenderId");
  const rateOptions = useRateOptions(selectedLenderId);

  const selectedRateId = form.watch("lenderRateId");

  const { setValue } = form;

  useEffect(() => {
    if (!rateOptions) return;

    if (!selectedLenderId && !!selectedRateId) {
      setValue("lenderRateId", null);
    } else if (selectedLenderId) {
      if (rateOptions.length === 1) {
        setValue("lenderRateId", toInteger(rateOptions[0].value));
      } else {
        const matchingRate = find(rateOptions, rate => toInteger(rate.value) === selectedRateId);

        if (!matchingRate) {
          setValue("lenderRateId", null);
        }
      }
    }
  }, [selectedLenderId, selectedRateId, rateOptions, setValue]);

  return (
    <ZoomDialog open={open} onClose={onClose} afterLeave={afterLeave} data-cy="change-lender-modal">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col p-4">
            <ZoomDialog.Header title="Change Finance Method" onClose={onClose} />
            {missingLenderRate && (
              <FormErrorMessage
                data-cy="missing-lender"
                title="Missing Lender"
                body="No lender option is selected or the previously selected lender option is no longer available. Please select a lender option."
              />
            )}
            <div className="flex-grow py-4">
              <div className="mb-6">
                <Controller
                  name="lenderId"
                  render={({ field }) => (
                    <>
                      <label htmlFor="lenderId" className="block mb-2 font-bold">
                        Select Finance Method
                      </label>
                      <select
                        {...field}
                        onChange={e => {
                          field.onChange(e.target.value ? toInteger(e.target.value) : undefined);
                        }}
                        value={field.value ? field.value.toString() : undefined}
                        className="w-full"
                        data-cy="select-lender-id"
                      >
                        <option value="">-- Select Lender --</option>
                        {lenderOptions.map(({ value, text }) => (
                          <option key={value} value={value}>
                            {text}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                />
              </div>
              <div className="mb-6">
                <Controller
                  name="lenderRateId"
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="block mb-2 font-bold">
                        Select Loan
                      </label>
                      <select
                        {...field}
                        onChange={e => {
                          field.onChange(e.target.value ? toInteger(e.target.value) : undefined);
                        }}
                        value={field.value ? field.value.toString() : undefined}
                        className="w-full"
                        data-cy="select-lender-rate-id"
                      >
                        <option value="">-- Select Loan Product --</option>
                        {rateOptions.map(({ value, text }) => (
                          <option key={value} value={value}>
                            {text}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="downPayment"
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="block mb-2 font-bold">
                        Downpayment Amount (if applicable)
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          {...field}
                          type="text"
                          className="focus:ring-primary focus:border-primary block w-full pr-4 pl-7 sm:text-sm border-gray-300 rounded-md"
                          placeholder="0.00"
                          data-cy="down-payment-input"
                        />
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
            <div className="text-xl mt-4 pt-4 border-t border-gray-300 text-right">
              <button
                type="button"
                className="bg-gray-500 text-white rounded-md py-3 px-6 font-bold mr-3 disabled:bg-opacity-50 disabled:cursor-not-allowed"
                disabled={form.formState.isSubmitting}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-white rounded-md py-3 px-6 font-bold disabled:bg-opacity-50 disabled:cursor-not-allowed"
                disabled={form.formState.isSubmitting}
                data-cy="change-lender-submit-btn"
              >
                {form.formState.isSubmitting ? "Saving" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </ZoomDialog>
  );
};

export default ManageLenderModal;

const useLenderOptions = () => {
  const possibleLenders = useSelector(getAllPossibleLenders);

  return useMemo<SelectOption[]>(() => {
    return possibleLenders.map(lender => ({ value: lender.id, text: lender.name }));
  }, [possibleLenders]);
};

const useRateOptions = (selectedLenderId: number | undefined) => {
  const lenderRateOptionsMap = useSelector(getLenderRateOptionsMap);

  return useMemo<SelectOption[]>(() => {
    const lenderRates = selectedLenderId ? lenderRateOptionsMap[selectedLenderId] : [];

    return (lenderRates ?? []).map(rate => ({
      value: rate.id,
      text: `${rate.lender.name} - ${rate.term_years}yrs @ ${rate.apr}% (${rate.code})`,
    }));
  }, [lenderRateOptionsMap, selectedLenderId]);
};
