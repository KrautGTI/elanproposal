import { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openDialog } from "../../../features/dialogs";

import { getCanChangeRateSchedule } from "../../../lib/selectors";

interface ManageUtilityRateScheduleButtonProps {
  className?: string;
}

const ManageUtilityRateScheduleButton: FC<ManageUtilityRateScheduleButtonProps> = ({
  children,
  className,
  ...rest
}) => {
  const canChangeRateSchedule = useSelector(getCanChangeRateSchedule);

  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(openDialog("MANAGE_UTILITY_RATE_SCHEDULE"));
  }, [dispatch]);

  if (!canChangeRateSchedule) {
    return <div className={className}>{children}</div>;
  }

  return (
    <>
      <button type="button" className={className} onClick={handleClick} {...rest}>
        {children}
      </button>
    </>
  );
};

export default ManageUtilityRateScheduleButton;
