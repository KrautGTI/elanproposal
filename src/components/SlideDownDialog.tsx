import clsx from "clsx";
import React, { forwardRef, Fragment, PropsWithChildren } from "react";

import { Dialog, Transition } from "@headlessui/react";

interface SlideDownDialogProps {
  open: boolean;
  onClose: () => void;
  afterLeave: () => void;
  appear?: boolean;
  initialFocus?: React.MutableRefObject<HTMLElement | null>;
}

const SlideDownDialog = forwardRef<HTMLDivElement, PropsWithChildren<SlideDownDialogProps>>(
  ({ children, open, onClose, afterLeave, ...rest }, ref) => {
    return (
      <Transition appear show={open} as={Fragment} afterLeave={afterLeave}>
        <Dialog
          {...rest}
          ref={ref}
          as="div"
          className={clsx("fixed inset-0 z-modal overflow-y-auto", open && "open")}
          open={open}
          onClose={onClose}
        >
          <div className="min-h-screen pt-4 px-4 pb-20 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 -translate-y-2/3"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-1/4"
            >
              <div className="inline-block w-full max-w-xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                {children}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  }
);

export default SlideDownDialog;
