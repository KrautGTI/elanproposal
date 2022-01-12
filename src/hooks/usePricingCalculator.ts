import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { recalculatePricing } from "../features/proposal";
import { CalculatePricingPayload, PricingOperation } from "../types";

export const usePricingCalculator = <T extends PricingOperation>(operation: T) => {
  const dispatch = useDispatch();

  const isLoading = useSelector(
    state => !!state.proposal.isRecalculatingPrice && state.proposal.activePricingOperation === operation
  );

  const submit = useCallback(
    async (payload: CalculatePricingPayload<T>) => {
      await dispatch(
        recalculatePricing({
          type: operation,
          data: payload,
        })
      );
    },
    [dispatch, operation]
  );

  return useMemo(() => {
    return {
      isLoading,
      submit,
    };
  }, [isLoading, submit]);
};
