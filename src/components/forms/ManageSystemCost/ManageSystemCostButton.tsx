import { FC, useCallback } from "react";
import { useDispatch } from "react-redux";

import { openDialog } from "../../../features/dialogs";

interface ManageSystemCostButtonProps {
  className?: string;
  allowOptimize?: boolean;
}

const ManageSystemCostButton: FC<ManageSystemCostButtonProps> = ({ children, className, allowOptimize, ...rest }) => {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(openDialog("MANAGE_SYSTEM_COST", { allowOptimize }));
  }, [dispatch, allowOptimize]);

  return (
    <>
      <button type="button" className={className} onClick={handleClick} {...rest}>
        {children}
      </button>
    </>
  );
};

export default ManageSystemCostButton;
