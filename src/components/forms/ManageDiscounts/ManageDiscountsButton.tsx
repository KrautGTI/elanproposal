import { FC, useCallback } from "react";
import { useDispatch } from "react-redux";

import { openDialog } from "../../../features/dialogs";

interface ManageDiscountsButtonProps {
  className?: string;
}

const ManageDiscountsButton: FC<ManageDiscountsButtonProps> = ({ children, className, ...rest }) => {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(openDialog("MANAGE_DISCOUNTS_DRAWER"));
  }, [dispatch]);

  return (
    <>
      <button type="button" className={className} onClick={handleClick} data-cy="manage-discounts-btn" {...rest}>
        {children}
      </button>
    </>
  );
};

export default ManageDiscountsButton;
