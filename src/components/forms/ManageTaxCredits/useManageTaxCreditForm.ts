import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import { useDebounceCallback } from "@react-hook/debounce";

import { recalculatePricing } from "../../../features/proposal";
import {
  getAppliedTaxCredits,
  getAvailableTaxCredits,
  getPaydownApplied,
  getPercentTaxCredits,
} from "../../../lib/selectors";
import { CalculatePricingPayload } from "../../../types";

interface UseManageTaxCreditFormOptions {
  onSubmitSuccess: () => void;
}

const taxCreditSchema = yup.object({
  creditsApplied: yup.number().defined(),
  paydownApplied: yup.number().defined(),
  creditsPercent: yup.number().defined(),
});

type FormValues = {
  creditsPercent: number;
} & CalculatePricingPayload<"change-credits">;

export const useManageTaxCreditForm = ({ onSubmitSuccess }: UseManageTaxCreditFormOptions) => {
  const dispatch = useDispatch();

  const paydownApplied = useSelector(getPaydownApplied);
  const creditsAvailable = useSelector(getAvailableTaxCredits);
  const creditsApplied = useSelector(getAppliedTaxCredits);
  const creditsPercent = useSelector(getPercentTaxCredits);

  const defaultValues = useMemo(
    () => ({
      creditsApplied,
      paydownApplied,
      creditsPercent,
    }),
    [creditsApplied, paydownApplied, creditsPercent]
  );

  const formMethods = useForm<FormValues>({
    mode: "all",
    defaultValues,
    resolver: yupResolver(taxCreditSchema),
  });

  const { reset, setValue, getValues } = formMethods;

  const handleCreditsChange = useDebounceCallback(
    (value: string) => {
      const credit = parseFloat(value);
      if (isNaN(credit)) return;
      const paydown = getValues("paydownApplied");

      console.log("credit changed", credit);

      const nextPercent = (credit + paydown) / creditsAvailable;

      setValue("creditsPercent", nextPercent, { shouldValidate: true, shouldDirty: true });
    },
    250,
    false
  );

  const handlePaydownChange = useDebounceCallback(
    (value: string) => {
      const paydown = parseFloat(value);
      if (isNaN(paydown)) return;
      const credit = getValues("creditsApplied");

      console.log("paydown changed", paydown);

      const nextPercent = (credit + paydown) / creditsAvailable;

      setValue("creditsPercent", nextPercent, { shouldValidate: true, shouldDirty: true });
    },
    250,
    false
  );

  const onSubmit = async ({ paydownApplied, creditsApplied, creditsPercent }) => {
    await dispatch(
      recalculatePricing({
        type: "change-credits",
        data: { paydownApplied, creditsApplied, creditsAppliedPercent: creditsPercent },
      })
    );

    onSubmitSuccess();
  };

  useEffect(() => {
    // you can do async server request and fill up form
    setTimeout(() => {
      reset(defaultValues);
    }, 100);
  }, [reset, defaultValues]);

  return {
    form: formMethods,
    handleCreditsChange,
    handlePaydownChange,
    onSubmit,
  };
};
