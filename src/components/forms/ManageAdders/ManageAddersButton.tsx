import { FC, useCallback } from "react";
import { useDispatch } from "react-redux";

import { openDialog } from "../../../features/dialogs";

interface ManageAddersButtonProps {
  className?: string;
}

const ManageAddersButton: FC<ManageAddersButtonProps> = ({ children, className, ...rest }) => {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(openDialog("MANAGE_ADDERS_DRAWER"));
  }, [dispatch]);

  return (
    <>
      <button type="button" className={className} onClick={handleClick} data-cy="manage-adders-btn" {...rest}>
        {children}
      </button>
    </>
  );
};

export default ManageAddersButton;
