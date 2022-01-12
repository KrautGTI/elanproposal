import React, { FC } from "react";
import ZoomDialog from "../ZoomDialog";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import dialogsSlice from "../../features/dialogs/dialogs.slice";
import { GlobalDialogProps } from "../../features/dialogs";

const ConfirmActionModal: FC<Omit<GlobalDialogProps, "onClose">> = ({ open, afterLeave }) => {
  const dispatch = useDispatch();

  const cancel = () => dispatch(dialogsSlice.actions.cancel());
  const confirm = () => dispatch(dialogsSlice.actions.confirm());

  const { confirmation } = useSelector(state => state.dialogs);

  return (
    <ZoomDialog open={open} afterLeave={afterLeave} onClose={cancel}>
      <div className="flex flex-col p-4">
        <div className="text-2xl px-2 pb-4 border-b border-gray-300 flex justify-between items-center">
          <div>{confirmation.headerText}</div>
          <button type="button" onClick={cancel} data-cy="close-btn" className="px-2 rounded">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        {confirmation.bodyText && <div className="mb-4 text-gray-700 mt-6 leading-5">{confirmation.bodyText}</div>}
        <button
          type="button"
          className="btn-primary w-full rounded-md py-3 font-bold mt-4"
          data-cy="submit-modify-system-cost"
          onClick={confirm}
        >
          {confirmation.confirmButtonText ? confirmation.confirmButtonText : "Confirm"}
        </button>
        <button
          type="button"
          className="btn-gray w-full rounded-md py-3 mt-4 font-bold text-center cursor-pointer"
          data-cy="submit-modify-system-cost"
          onClick={cancel}
        >
          Cancel
        </button>
      </div>
    </ZoomDialog>
  );
};

export default ConfirmActionModal;
