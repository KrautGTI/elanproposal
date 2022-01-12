import clsx from "clsx";
import { FC, Fragment, useRef } from "react";
import styled from "styled-components";

import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";

import { TileOptions } from "../types/tile-options";
import ImgNextGen from "./ImgNextGen";

interface BreakdownModalProps {
  tileId: string;
  open: boolean;
  image: TileOptions["image"];
  video: TileOptions["video"];
  onClose: () => void;
}

export const BreakdownModal: FC<BreakdownModalProps> = props => {
  const { children, open, onClose, tileId } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className={clsx("fixed z-modal inset-0 overflow-hidden", open && "open")}
        initialFocus={closeBtnRef}
        open={open}
        onClose={onClose}
        data-cy={`breakdown-dialog--${tileId}`}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity" data-cy="overlay">
            <button ref={closeBtnRef} type="button" className="absolute top-4 left-4 text-3xl" onClick={onClose}>
              <XIcon className="h-6 w-6 text-white text-opacity-90" />
            </button>
          </Dialog.Overlay>
        </Transition.Child>

        <Scaler data-cy="scaler">
          <Transition.Child
            as={Fragment}
            // className="-translate-x-16"
            enter="transform-gpu transition ease-in-out duration-700"
            enterFrom="opacity-0 -translate-x-20 translate-y-4 scale-95"
            enterTo="opacity-100 translate-x-0 translate-y-0 scale-100"
            leave="transform-gpu transition ease-in-out duration-500"
            leaveFrom="opacity-100 translate-x-0 translate-y-0 scale-100"
            leaveTo="opacity-0 -translate-x-20 translate-y-4 scale-95"
          >
            <BackgroundPanelPositioner>
              <div
                className="relative w-full h-full rounded-lg text-left shadow-xl pointer-events-auto overflow-hidden"
                data-cy="background-panel"
              >
                <div className="absolute inset-0">
                  <ImgNextGen className="h-full object-cover" srcWebp={props.image.webp} fallback={props.image.jpg} />
                </div>
                {!!props.video && (
                  <video
                    className="absolute w-full h-full max-w-none max-height-none top-0 left-0 object-cover"
                    ref={videoRef}
                    loop
                    autoPlay
                  >
                    <source src={props.video} type="video/mp4" />
                  </video>
                )}
              </div>
            </BackgroundPanelPositioner>
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transform-gpu transition ease-in-out duration-700"
            enterFrom="opacity-0 -translate-y-28 lg:translate-y-10 scale-x-90 lg:scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transform-gpu transition ease-in-out duration-500"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 -translate-y-28 lg:translate-y-10 scale-x-90 lg:scale-95"
          >
            <ForegroundPanelPositioner>
              <div className="w-full h-full px-8 flex flex-col justify-center lg:justify-start lg:px-0">
                <div className="pointer-events-auto w-full rounded-lg text-left" data-cy="foreground-panel">
                  {children}
                </div>
              </div>
            </ForegroundPanelPositioner>
          </Transition.Child>
        </Scaler>
      </Dialog>
    </Transition>
  );
};

const Scaler = styled.div`
  position: absolute;
  width: calc(var(--deck-width) * 1px);
  height: calc(var(--deck-height) * 1px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(var(--deck-scale));
  margin: auto;
  pointer-events: none;
  overflow: visible;
  z-index: 500;
  text-align: center;
  perspective: 600px;
  perspective-origin: 50% 40%;
`;

const BackgroundPanelPositioner = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;

  ${props => props.theme.breakpoints.up("lg")} {
    top: 5rem;
    left: auto;
    width: 66.666667%;
  }
`;

const ForegroundPanelPositioner = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  min-height: 100%;

  ${props => props.theme.breakpoints.up("lg")} {
    top: 7rem;
    right: auto;
    width: 83.33333%;
  }
`;
