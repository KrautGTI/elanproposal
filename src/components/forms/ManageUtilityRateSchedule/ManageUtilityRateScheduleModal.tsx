import every from "lodash/every";
import find from "lodash/find";
import React, { FC, useCallback, useEffect, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import { ExclamationIcon } from "@heroicons/react/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import { createSelector } from "@reduxjs/toolkit";

import { WithGlobalDialogProps } from "../../../features/dialogs";
import { fetchRateScheduleOptions, recalculatePricing } from "../../../features/proposal";
import { ParsedApiError } from "../../../lib/api/proposal-api";
import { getUtilityCompany } from "../../../lib/selectors";
import { RootState } from "../../../rootReducer";
import { CalculatePricingPayload, SelectOption } from "../../../types";
import ZoomDialog from "../../ZoomDialog";

const utilityRateScheduleSchema = yup.object({
  rateSchedule: yup.string().defined(),
});

type FormValues = CalculatePricingPayload<"change-utility-rate-schedule">;

const ManageUtilityRateScheduleModal = ({ open, onClose, afterLeave }: WithGlobalDialogProps) => {
  const dispatch = useDispatch();

  const { options, loading, error } = useSelector(getRateScheduleState);

  const currentRateScheduleValue = useSelector(getCurrentRateScheduleValue);

  const defaultValues = useMemo(
    () => ({
      rateSchedule: currentRateScheduleValue ?? "",
    }),
    [currentRateScheduleValue]
  );

  const form = useForm<FormValues>({
    mode: "all",
    defaultValues,
    resolver: yupResolver(utilityRateScheduleSchema),
  });

  const { reset, watch } = form;

  useEffect(() => {
    reset({ rateSchedule: currentRateScheduleValue ?? "" });
  }, [reset, currentRateScheduleValue]);

  useEffect(() => {
    if (options?.length || loading) return;

    dispatch(fetchRateScheduleOptions());
  }, [dispatch, options, loading]);

  const onSubmit: SubmitHandler<FormValues> = async values => {
    if (!values.rateSchedule) return;

    await dispatch(
      recalculatePricing({
        type: "change-utility-rate-schedule",
        data: {
          rateSchedule: values.rateSchedule,
        },
      })
    );

    onClose();
  };

  const selectedRateSchedule = watch("rateSchedule");

  return (
    <ZoomDialog open={open} onClose={onClose} afterLeave={afterLeave} data-cy="change-utility-rate-schedule-modal">
      <FormProvider {...form}>
        <form className="p-4" onSubmit={form.handleSubmit(onSubmit)}>
          <ZoomDialog.Header title="Change Utility Rate Schedule" onClose={onClose} />
          <div className="flex-grow py-4">
            <div className="mb-6">
              <RateScheduleSelectControl loading={loading} options={options ?? []} error={error} />
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
              disabled={form.formState.isSubmitting || !selectedRateSchedule}
              data-cy="change-lender-submit-btn"
            >
              {form.formState.isSubmitting ? "Saving" : "Save"}
            </button>
          </div>
        </form>
      </FormProvider>
    </ZoomDialog>
  );
};

export default ManageUtilityRateScheduleModal;

const getRateScheduleState = createSelector(
  (state: RootState) => state.proposal.rateSchedules,
  rateSchedules => ({
    options: rateSchedules.options,
    loading: rateSchedules.loading || false,
    error: rateSchedules.error,
  })
);

const getCurrentRateScheduleValue = createSelector(
  [getUtilityCompany, (state: RootState) => state.proposal.rateSchedules.options],
  ({ rateSchedule }, options) => {
    if (!options?.length) return undefined;

    // We don't get the rate schedule UUID from the quote, so we have to
    // compare it to the string value of each option to get the UUID
    return find(options, x => x.text === rateSchedule)?.value as string;
  }
);

function RateScheduleSelectControl({
  loading,
  error,
  options,
}: {
  loading?: boolean;
  error?: ParsedApiError;
  options: SelectOption[];
}) {
  const form = useFormContext();
  const dispatch = useDispatch();

  const handleRetry = useCallback(() => {
    dispatch(fetchRateScheduleOptions());
  }, [dispatch]);

  const allOptionsNull = useMemo(() => every(options, option => option.value === null), [options]);

  const utilityCompany = useSelector(getUtilityCompany);

  const emptyValueText = loading
    ? "-- Loading Options --"
    : allOptionsNull
    ? "No Rate Schedules Available"
    : "-- Select Rate Schedule --";

  return (
    <>
      <label htmlFor="rateSchedule" className="block mb-2 font-bold">
        Rate Schedule
      </label>
      <select
        {...form.register("rateSchedule")}
        className="w-full mb-4"
        data-cy="select-rate-schedule-uuid"
        disabled={loading}
      >
        <option value="">{emptyValueText}</option>
        {options.map(({ value, text }) => (
          <option key={`${value}-${text}`} value={value} disabled={!value}>
            {text}
          </option>
        ))}
      </select>
      {!loading && !!allOptionsNull && (
        <OptionsWarning>"{utilityCompany.name}" does not appear to have any active Rate Schedules.</OptionsWarning>
      )}
      {!!error && (
        <OptionsWarning>
          {error.message}{" "}
          {error.statusCode === 404 && (
            <button
              type="button"
              onClick={handleRetry}
              className="font-medium underline text-yellow-700 hover:text-yellow-600"
            >
              Click here to try again.
            </button>
          )}
        </OptionsWarning>
      )}
    </>
  );
}

const OptionsWarning: FC = ({ children }) => {
  return (
    <div className="bg-yellow-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">{children}</p>
        </div>
      </div>
    </div>
  );
};
