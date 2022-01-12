import clsx from "clsx";
import isEqual from "lodash/isEqual";
import numeral from "numeral";
import React, { FC, useEffect, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { faSync } from "@fortawesome/pro-light-svg-icons";
import { faPlusCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";

import { usePricingCalculator } from "../../../hooks/usePricingCalculator";
import { CalculatePricingPayload, CustomAdder } from "../../../types";
import InputErrorText from "../../InputErrorText";

interface CustomAdderFormProps {
  customAdder?: CustomAdder | null;
  onClose: () => void;
}

const customAdderSchema = yup.object({
  name: yup.string().defined(),
  cost: yup
    .number()
    .defined("Required")
    .positive("Custom products cannot be negative. Use a discount instead.")
    .typeError("Must be a number greater than 0"),
  addDealerFees: yup.boolean().default(() => true),
});

type FormValues = CalculatePricingPayload<"custom-adder">;

const AddCustomAdderForm: FC<CustomAdderFormProps> = ({ customAdder, onClose }) => {
  const defaultValues = useMemo(
    () => ({
      name: customAdder?.name ?? "",
      cost: undefined,
      addDealerFees: customAdder?.addDealerFees ?? true,
    }),
    [customAdder]
  );

  const form = useForm<FormValues>({
    mode: "all",
    defaultValues,
    resolver: yupResolver(customAdderSchema),
  });

  const { getValues, reset } = form;

  useEffect(() => {
    if (isEqual(defaultValues, getValues())) return;

    reset(defaultValues);
  }, [getValues, reset, defaultValues]);

  const { submit: createCustomAdder, isLoading } = usePricingCalculator("custom-adder");

  const onSubmit: SubmitHandler<FormValues> = async values => {
    await createCustomAdder({
      name: values.name,
      cost: values.cost,
      addDealerFees: values.addDealerFees,
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
    <div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} data-cy="custom-adder-form">
          <input
            {...form.register("name")}
            type="text"
            className={clsx(
              "focus:ring-primary focus:border-primary block w-full pr-7 pl-4 sm:text-sm border-gray-300 rounded-md",
              !!form.formState.errors?.name && "border-red-600 focus:ring-red-600 focus:border-red-600"
            )}
            placeholder="Description of custom adder"
          />
          <InputErrorText hasError={!!form.formState.errors?.name} message={form.formState.errors?.name?.message} />
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              {...form.register("cost")}
              type="text"
              className={clsx(
                "focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md",
                !!form.formState.errors?.cost && "border-red-600 focus:ring-red-600 focus:border-red-600"
              )}
              placeholder={numeral(0).format("0,0[.]00")}
            />
          </div>
          <InputErrorText hasError={!!form.formState.errors?.cost} message={form.formState.errors?.cost?.message} />
          <div className="flex items-center my-4">
            <input
              {...form.register("addDealerFees")}
              type="checkbox"
              id="add-dealer-fees"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              data-cy="add-dealer-fees"
            />
            <label htmlFor="add-dealer-fees" className="ml-2 block text-lg text-gray-600">
              Add dealer fees
            </label>
          </div>
          <div className="flex flex-row-reverse mt-2">
            <button
              type="submit"
              className="flex-grow w-full flex border border-gray-300 rounded-md py-3 px-4 mb-4 whitespace-nowrap"
              data-cy="submit-custom-adder"
            >
              <div className="flex-shrink-0 text-primary-dark mr-2">
                <FontAwesomeIcon icon={faPlusCircle} />
              </div>
              <div className="text-primary-dark text-left flex-grow">Save Custom Product</div>
            </button>
            <button
              type="button"
              className="w-full flex border border-gray-300 rounded-md py-3 px-4 mb-4 mr-3"
              onClick={onClose}
              data-cy="cancel-custom-adder"
            >
              <div className="text-gray-500 text-left flex-grow">Cancel</div>
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddCustomAdderForm;
