import { useRef } from "react";
import { useSelector } from "react-redux";

import { Dialog } from "@headlessui/react";
import { LockClosedIcon } from "@heroicons/react/outline";

import { WithGlobalDialogProps } from "../../../features/dialogs";
import { getDealLockStatus } from "../../../lib/selectors";
import ZoomDialog from "../../ZoomDialog";

const DealLockedModal = ({ open, onClose, afterLeave }: WithGlobalDialogProps) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const dealLockStatus = useSelector(getDealLockStatus);

  const { actionButtonText, actionButtonUrl, description } = dealLockStatus ?? {};

  return (
    <ZoomDialog open={open} onClose={onClose} afterLeave={afterLeave} initialFocus={cancelButtonRef}>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <LockClosedIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div className="mt-6 mx-4 text-center sm:mt-0 sm:text-left">
            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
              Deal Locked
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse">
        {!!actionButtonText && !!actionButtonUrl && (
          <a
            href={actionButtonUrl}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-secondary text-base font-medium text-white hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            {actionButtonText}
          </a>
        )}
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={onClose}
          ref={cancelButtonRef}
        >
          Close
        </button>
      </div>
    </ZoomDialog>
  );
};

export default DealLockedModal;
