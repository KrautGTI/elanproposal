import clsx from "clsx";
import { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { faLockAlt, faLockOpenAlt } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { openDialog } from "../features/dialogs";
import { toggleLock } from "../features/proposal";
import { canUserEditProposal, getIsProposalLocked, getShouldPreventUpdates } from "../lib/selectors";

const EditLockToggler: FC<{ className?: string }> = ({ className }) => {
  const dispatch = useDispatch();
  const locked = useSelector(getIsProposalLocked);
  const canEdit = useSelector(canUserEditProposal);
  const shouldPreventUpdates = useSelector(getShouldPreventUpdates);

  const handleClick = useCallback(() => {
    if (shouldPreventUpdates) {
      dispatch(openDialog("DEAL_LOCKED"));
    } else {
      dispatch(toggleLock());
    }
  }, [dispatch, shouldPreventUpdates]);

  if (!canEdit) return null;

  let title = locked ? "Unlock for changes" : "Lock for changes";
  if (shouldPreventUpdates) {
    title = "Locked by Agreement";
  }

  let icon = locked ? faLockAlt : faLockOpenAlt;
  if (shouldPreventUpdates) {
    icon = faLockAlt;
  }

  return (
    <button
      type="button"
      className={clsx("text-gray-600", className)}
      onClick={handleClick}
      title={title}
      data-cy="edit-lock-toggler"
      data-locked={!!locked}
    >
      <FontAwesomeIcon icon={icon} size="lg" />
    </button>
  );
};

export default EditLockToggler;
