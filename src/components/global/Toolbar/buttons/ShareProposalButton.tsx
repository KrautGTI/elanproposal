import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";

import { faEnvelope } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { openDialog, useDialogOpen } from "../../../../features/dialogs";
import { ToolbarButton } from "../ToolbarButton";

interface ShareProposalButtonProps {
  disabled?: boolean;
}

const ShareProposalButton = memo(function ShareToolbarToggle({ disabled }: ShareProposalButtonProps) {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(openDialog("SHARE"));
  }, [dispatch]);

  const open = useDialogOpen("SHARE");

  return (
    <>
      <ToolbarButton
        className="share"
        disabled={disabled}
        title="Share"
        onClick={handleClick}
        color={open ? "secondary" : "default"}
        data-cy="toggle-share-modal-btn"
      >
        <FontAwesomeIcon icon={faEnvelope} />
      </ToolbarButton>
    </>
  );
});

export default ShareProposalButton;
