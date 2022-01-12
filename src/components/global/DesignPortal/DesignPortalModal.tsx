import clsx from "clsx";
import React, { FC, Fragment, useRef } from "react";
import { XIcon } from "@heroicons/react/solid";
import { Dialog, Transition } from "@headlessui/react";

import DesignPortal from "./DesignPortal";
import { getIsHelioquoteDesign } from "../../../lib/selectors";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as HqLogo } from "./images/helio-logo.svg";
import { GlobalDialogProps, closeDesignPortal } from "../../../features/dialogs";

const DesignPortalModal: FC<Omit<GlobalDialogProps, "afterLeave" | "onClose">> = ({ children, open }) => {
  const dispatch = useDispatch();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const isHelioquoteDesign = useSelector(getIsHelioquoteDesign);

  const closeAction = () => dispatch(closeDesignPortal());

  return (
    <Transition show={open} as={Fragment} appear unmount={false}>
      <Dialog
        as="div"
        // static
        unmount={false}
        className={clsx("fixed z-modal inset-0 overflow-y-auto", open && "open")}
        open={open}
        onClose={closeAction}
        initialFocus={closeBtnRef}
        data-cy="design-portal-modal"
      >
        <div className="flex items-end justify-center min-h-screen text-center sm:block">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0 translate-y-full md:-translate-y-full"
            enterTo="opacity-100 translate-y-0"
            leave="ease-out duration-500"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-full md:-translate-y-full"
            unmount={false}
          >
            <div
              className="inline-block align-bottom bg-white py-4 text-left overflow-hidden transform transition-all w-full min-h-screen"
              style={{ background: "rgb(var(--rgb-body-bg))" }}
            >
              <div className="w-full flex justify-between items-center px-4 mb-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <Dialog.Title className="font-bold text-3xl md:text-4xl xl:text-5xl">System Design</Dialog.Title>
                  {isHelioquoteDesign && (
                    <div className="w-44 ">
                      <HqLogo />
                    </div>
                  )}
                </div>
                <button ref={closeBtnRef} type="button" onClick={closeAction} data-cy="close-btn">
                  <XIcon className="h-8 w-8 text-gray-800 text-opacity-90" />
                </button>
              </div>
              <DesignPortal open={open} />
            </div>
          </Transition.Child>
        </div>
        {children}
      </Dialog>
    </Transition>
  );
};

export default DesignPortalModal;
