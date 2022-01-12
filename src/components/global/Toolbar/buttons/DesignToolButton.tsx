import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { openDialog } from "../../../../features/dialogs";
import { useDialogOpen } from "../../../../features/dialogs";
import { ReactComponent as SolarDesignIcon } from "../svgs/SolarDesignIcon.svg";
import { ToolbarButton } from "../ToolbarButton";

interface DesignToolButtonProps {
  disabled?: boolean;
}

const DesignToolButton = ({ disabled }: DesignToolButtonProps) => {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(openDialog("DESIGN_PORTAL"));
  }, [dispatch]);

  const open = useDialogOpen("DESIGN_PORTAL");

  return (
    <>
      <ToolbarButton
        className="open-solar-design"
        color={open ? "secondary" : "default"}
        // When open, clicking anywhere in the toolbar will be considered external and close
        // setting to undefined when open because the click propagates through the external event and reopens it immediately
        onClick={handleClick}
        disabled={disabled}
        title="Optimus Design Tool"
        data-cy="toggle-design-portal-btn"
      >
        <SolarDesignIcon />
      </ToolbarButton>
    </>
  );
};

export default DesignToolButton;
