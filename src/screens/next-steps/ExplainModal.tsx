import { Fragment, ReactNode, useRef } from "react";
import styled from "styled-components";

import { faChevronRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";

import ImgNextGen from "../../components/ImgNextGen";

export interface StepDef {
  title: string;
  image: {
    webp: string;
    jpg: string;
  };
  body: string | ReactNode;
}

interface ExplainModalProps extends StepDef {
  open: boolean;
  stepNum: number;
  goNext: () => void;
  onClose: () => void;
}

export const ExplainModal = (props: ExplainModalProps) => {
  const { stepNum, title, image, body, goNext, open, onClose } = props;
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-modal inset-0 overflow-y-auto"
        initialFocus={nextButtonRef}
        open={open}
        onClose={onClose}
        data-cy="explain-dialog"
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
            <div className="transform fixed inset-0 pointer-events-none">
              <Scaler>
                <div className="absolute inset-0 flex justify-center items-center">
                  <div
                    className="flex bg-white rounded-xl pointer-events-auto w-full max-h-full"
                    style={{ height: 804 }}
                  >
                    <div className="flex-grow rounded-l-xl overflow-hidden">
                      <ImgNextGen className="w-full h-full object-cover" srcWebp={image.webp} fallback={image.jpg} />
                    </div>
                    <div className="relative flex-shrink-0 w-1/3 px-6 py-14">
                      <div className="absolute top-4 right-4">
                        <button
                          type="button"
                          onClick={onClose}
                          className="text-gray-500 text-4xl leading-3 w-12 h-12 rounded-lg focus:outline-none focus:ring focus:ring-gray-500 focus:ring-opacity-50"
                          data-cy="close-btn"
                        >
                          &times;
                        </button>
                      </div>
                      <div className="absolute h-16 w-16 top-12 -left-8">
                        <div
                          className="w-full h-full rounded-full flex items-center justify-center bg-secondary-light text-white text-3xl font-bold"
                          data-cy="step-num"
                        >
                          {stepNum}
                        </div>
                      </div>
                      <div className="text-4xl font-bold mb-14 pl-6" data-cy="title">
                        {title}
                      </div>
                      <div className="text-gray-500 text-lg" data-cy="body">
                        {body}
                      </div>
                      <div className="absolute -bottom-10 inset-x-0 flex justify-center">
                        <button
                          ref={nextButtonRef}
                          type="button"
                          className="h-20 w-20 rounded-full bg-primary text-white flex justify-center items-center focus:outline-none focus:ring focus:ring-white"
                          onClick={goNext}
                          autoFocus
                          data-cy="next-btn"
                        >
                          <FontAwesomeIcon icon={faChevronRight} size="2x" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Scaler>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

const Scaler = styled.div`
  position: absolute;
  width: calc(var(--deck-width, 1366) * 1px);
  height: calc(var(--deck-height, 1024) * 1px);
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
