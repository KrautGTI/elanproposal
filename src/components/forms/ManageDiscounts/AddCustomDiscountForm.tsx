import clsx from "clsx";
import isEqual from "lodash/isEqual";
import numeral from "numeral";
import React, { FC, useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { faSync } from "@fortawesome/pro-light-svg-icons";
import { faPlusCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";

import { usePricingCalculator } from "../../../hooks/usePricingCalculator";
import InputErrorText from "../../InputErrorText";
import { CalculatePricingPayload, Discount } from "../../../types";

interface AddCustomDiscountFormProps {
  customDiscount?: Discount | null;
  onClose: () => void;
}

const customDiscountSchema = yup.object({
  name: yup.string().defined("Required"),
  amount: yup
    .number()
    .defined("Required")
    .positive("Use a positive number here")
    .typeError("Must be a number greater than 0"),
});

type FormValues = CalculatePricingPayload<"custom-discount">;

const AddCustomDiscountForm: FC<AddCustomDiscountFormProps> = ({ customDiscount, onClose }) => {
  const defaultValues = useMemo(
    () => ({
      name: customDiscount?.name ?? "",
      amount: undefined,
    }),
    [customDiscount]
  );

  const form = useForm<FormValues>({
    mode: "all",
    defaultValues,
    resolver: yupResolver(customDiscountSchema),
  });

  const { getValues, reset } = form;

  useEffect(() => {
    if (isEqual(defaultValues, getValues())) return;

    reset(defaultValues);
  }, [getValues, reset, defaultValues]);

  const { submit: submitCustomDiscount, isLoading } = usePricingCalculator("custom-discount");

  const onSubmit: SubmitHandler<FormValues> = async args => {
    await submitCustomDiscount({
      name: args.name,
      amount: args.amount,
    });
    onClose();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <FontAwesomeIcon icon={faSync} spin />
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} data-cy="custom-discount-form">
      <input
        {...form.register("name")}
        type="text"
        className={clsx(
          "focus:ring-primary focus:border-primary block w-full pr-7 pl-4 sm:text-sm border-gray-300 rounded-md",
          !!form.formState.errors?.name && "border-red-600 focus:ring-red-600 focus:border-red-600"
        )}
        placeholder="Description of custom discount"
        data-cy="custom-discount-description-input"
      />
      <InputErrorText hasError={!!form.formState.errors?.name} message={form.formState.errors?.name?.message} />
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">$</span>
        </div>
        <input
          {...form.register("amount")}
          type="text"
          className={clsx(
            "focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md",
            !!form.formState.errors?.amount && "border-red-600 focus:ring-red-600 focus:border-red-600"
          )}
          placeholder={numeral(0).format("0,0[.]00")}
          data-cy="custom-discount-amount-input"
        />
      </div>
      <InputErrorText hasError={!!form.formState.errors?.amount} message={form.formState.errors?.amount?.message} />
      <div className="flex flex-row-reverse mt-2">
        <button
          type="submit"
          className="w-full flex border border-gray-300 rounded-md py-3 px-4 mb-4"
          data-cy="submit-custom-discount"
        >
          <div className="flex-shrink-0 text-primary-dark mr-2">
            <FontAwesomeIcon icon={faPlusCircle} />
          </div>
          <div className="text-primary-dark text-left flex-grow">Save</div>
        </button>
        <button
          type="button"
          className="w-full flex border border-gray-300 rounded-md py-3 px-4 mb-4 mr-3"
          onClick={onClose}
          data-cy="cancel-custom-discount"
        >
          <div className="text-gray-500 text-left flex-grow">Cancel</div>
        </button>
      </div>
    </form>
  );
};

export default AddCustomDiscountForm;
