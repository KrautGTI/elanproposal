import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";

import { usePricingCalculator } from "../../../hooks/usePricingCalculator";
import { getCurrentLenderInfo, getCurrentLenderRateInfo, getDownPayment } from "../../../lib/selectors";
import { CalculatePricingPayload } from "../../../types";
import { useMemo } from "react";

interface UseChangeLenderFormOptions {
  onSubmitSuccess: () => void;
}

interface UseChangeLenderFormMethods {
  form: UseFormReturn<yup.Asserts<typeof lenderSchema>>;
  onSubmit: SubmitHandler<FormValues>;
}

const lenderSchema = yup.object({
  lenderId: yup.number().defined(),
  lenderRateId: yup.number().nullable().defined(),
  downPayment: yup.number().defined(),
});

type FormValues = { lenderId: number } & CalculatePricingPayload<"change-loan">;

export const useChangeLenderForm = ({ onSubmitSuccess }: UseChangeLenderFormOptions): UseChangeLenderFormMethods => {
  const currentLender = useSelector(getCurrentLenderInfo);
  const currentLenderRate = useSelector(getCurrentLenderRateInfo);
  const downPayment = useSelector(getDownPayment);

  const defaultValues = useMemo(
    () => ({
      lenderId: currentLender?.id,
      lenderRateId: currentLenderRate?.id,
      downPayment: downPayment,
    }),
    [currentLender, currentLenderRate, downPayment]
  );

  const form = useForm<yup.Asserts<typeof lenderSchema>>({
    mode: "all",
    defaultValues,
    resolver: yupResolver(lenderSchema),
  });

  const { submit: changeLoan } = usePricingCalculator("change-loan");

  const onSubmit: SubmitHandler<FormValues> = async values => {
    await changeLoan({
      lenderRateId: values.lenderRateId,
      downPayment: values.downPayment ?? 0,
    });

    onSubmitSuccess();
  };

  return {
    form,
    onSubmit,
  };
};
