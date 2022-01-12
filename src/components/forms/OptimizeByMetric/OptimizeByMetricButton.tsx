import { forwardRef, PropsWithChildren, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { openDialog } from "../../../features/dialogs";
import {
  getIsAuroraDesign,
  getRepDoesAuroraDesigns,
  getShouldPreventUpdates,
  getUseAuroraSdk,
  getUseSimplifiedProductionCalcs,
} from "../../../lib/selectors";
import { OptimizeDesignOperations, OptimizeDesignOperationType } from "../../../types";

interface OptimizeByMetricButtonProps {
  className?: string;
  id?: string;
  metric: OptimizeDesignOperationType;
}

const OptimizeByMetricButton = forwardRef<HTMLButtonElement, PropsWithChildren<OptimizeByMetricButtonProps>>(
  ({ children, className, metric, ...rest }, ref) => {
    const dispatch = useDispatch();

    const shouldPreventUpdates = useSelector(getShouldPreventUpdates);
    const isAuroraDesign = useSelector(getIsAuroraDesign);
    const useAuroraSdk = useSelector(getUseAuroraSdk);
    const repDoesAuroraDesigns = useSelector(getRepDoesAuroraDesigns);

    const useSimplifiedProductionCalcs = useSelector(getUseSimplifiedProductionCalcs);

    const handleClick = useCallback(() => {
      if (shouldPreventUpdates) {
        dispatch(openDialog("DEAL_LOCKED"));
      } else if (isAuroraDesign) {
        if (!useAuroraSdk) {
          if (repDoesAuroraDesigns) {
            dispatch(openDialog("SELECT_AURORA_DESIGN"));
          } else {
            dispatch(openDialog("OPTIMIZE_BY_METRIC", { metric }));
          }
        }
      } else {
        if (useSimplifiedProductionCalcs) {
          if (simplifiedCalcMetric(metric)) {
            dispatch(openDialog("OPTIMIZE_BY_METRIC", { metric }));
          }
        } else {
          dispatch(openDialog("OPTIMIZE_BY_METRIC", { metric }));
        }
      }
    }, [
      dispatch,
      shouldPreventUpdates,
      metric,
      isAuroraDesign,
      useAuroraSdk,
      useSimplifiedProductionCalcs,
      repDoesAuroraDesigns,
    ]);

    return (
      <button
        ref={ref}
        type="button"
        className={className}
        onClick={handleClick}
        data-cy={`optimize-by-${metric}-btn`}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

function simplifiedCalcMetric(metric: keyof OptimizeDesignOperations) {
  return metric === "panelCount";
}

export default OptimizeByMetricButton;
