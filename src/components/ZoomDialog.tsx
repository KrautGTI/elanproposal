import clsx from "clsx";
import React, { FC, Fragment, ReactNode } from "react";

import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";

interface ZoomDialogProps {
  open: boolean;
  onClose: () => void;
  afterLeave: () => void;
  initialFocus?: React.MutableRefObject<HTMLElement | null>;
}

interface IZoomDialog extends FC<ZoomDialogProps> {
  Header: typeof ZoomDialogHeader;
}

const ZoomDialog: IZoomDialog = ({ children, open, onClose, afterLeave, ...rest }) => {
  return (
    <Transition appear show={open} as={Fragment} afterLeave={afterLeave}>
      <Dialog
        data-cy="zoom-dialog"
        as="div"
        {...rest}
        static
        className={clsx("fixed z-modal inset-0 overflow-y-auto", open && "open")}
        open={open}
        onClose={onClose}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" data-cy="overlay" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-10 sm:translate-y-0 sm:scale-75"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-10 sm:translate-y-0 sm:scale-75"
          >
            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

const ZoomDialogHeader = ({ onClose, title }: Pick<ZoomDialogProps, "onClose"> & { title: ReactNode }) => {
  return (
    <div className="text-xl pb-4 border-b border-gray-300 flex justify-between items-center">
      <div>{title}</div>
      <button className="px-2 rounded-md" type="button" onClick={onClose} data-cy="close-btn">
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

ZoomDialog.Header = ZoomDialogHeader;

export default ZoomDialog;
