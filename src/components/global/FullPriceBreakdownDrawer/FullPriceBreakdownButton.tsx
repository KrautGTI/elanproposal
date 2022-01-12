import { FC, useCallback } from "react";
import { useDispatch } from "react-redux";

import { openDialog } from "../../../features/dialogs";

interface FullPriceBreakdownButtonProps {
  className?: string;
}

const FullPriceBreakdownButton: FC<FullPriceBreakdownButtonProps> = ({ children, className, ...rest }) => {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(openDialog("FULL_PRICE_BREAKDOWN_DRAWER"));
  }, [dispatch]);

  return (
    <>
      <button {...rest} type="button" className={className} onClick={handleClick}>
        {children}
      </button>
    </>
  );
};

export default FullPriceBreakdownButton;
