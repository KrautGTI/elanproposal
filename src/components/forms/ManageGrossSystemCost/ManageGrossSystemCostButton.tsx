import { FC, useCallback } from "react";
import { useDispatch } from "react-redux";

import { openDialog } from "../../../features/dialogs";

interface ManageGrossSystemCostButtonProps {
  className?: string;
}

const ManageGrossSystemCostButton: FC<ManageGrossSystemCostButtonProps> = ({ children, className, ...rest }) => {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(openDialog("MANAGE_GROSS_SYSTEM_COST"));
  }, [dispatch]);

  return (
    <>
      <button type="button" className={className} onClick={handleClick} {...rest}>
        {children}
      </button>
    </>
  );
};

export default ManageGrossSystemCostButton;
