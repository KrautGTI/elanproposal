import endsWith from "lodash/endsWith";
import numeral from "numeral";
import { ChangeEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { toFixedNumber } from "./utils";

export function setServerErrors<T extends FieldValues>(form: UseFormReturn<T>, errors: Record<keyof T, string[]>) {
  Object.keys(errors).forEach(key => {
    form.setError(key as Path<T>, {
      type: "server",
      message: errors[key].join(". "),
    });
  });
}

export const TransformCurrency = {
  input: (val: string | number, { focused = true }: { focused?: boolean } = {}) => {
    if (!focused) return val ? numeral(val).format("0,0[.]00") : val;

    return val ?? "";
  },
  output: (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    if (!val) return val;
    if (endsWith(val, ".")) return val;

    return toFixedNumber(val.replace(",", ""), 2);
  },
};

export const TransformSystemSize = {
  toKw: (val: number) => {
    return toFixedNumber(val / 1000, 3);
  },
  toWatts: (e: ChangeEvent<HTMLInputElement>) => {
    let val = parseFloat(e.target.value);

    return val * 1000;
  },
};

export const SystemCostCalculator = {
  ppwToCost(ppw: number, systemSize: number) {
    return toFixedNumber(ppw * systemSize, 2);
  },
  costToPpw(cost: number, systemSize: number) {
    return toFixedNumber(cost / systemSize, 2);
  },
};
