import clsx from "clsx";
import {
  createRef,
  DetailedHTMLProps,
  forwardRef,
  Fragment,
  HTMLAttributes,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";

import useActiveScreens from "../../../features/deck/useActiveScreens";
import ImgNextGen from "../../ImgNextGen";
import { DeckScreenConfig } from "../../../types";

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

interface MainNavigationProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  onSelectScreen: (screenIndex: number) => void;
}

export const MainNavigation = forwardRef<HTMLDivElement, MainNavigationProps & ReactDivProps>(
  ({ open, onClose, onSelectScreen, ...rest }, ref) => {
    const screens = useActiveScreens();
    const currentSlideIndex = useSelector(state => state.deck.currentSlideIndex);

    const handleScreenSelection = useCallback(
      (indexh: number) => {
        onClose();
        onSelectScreen(indexh);
      },
      [onClose, onSelectScreen]
    );

    const [buttonRefs, setButtonRefs] = useState<MutableRefObject<HTMLButtonElement>[]>([]);
    const buttonCount = screens.length;

    useEffect(() => {
      setButtonRefs(elRefs =>
        Array(buttonCount)
          .fill(undefined)
          .map((_, i) => elRefs[i] || createRef())
      );
    }, [buttonCount]);

    return (
      <Transition appear show={open} as={Fragment}>
        <Dialog
          data-cy="main-navigation-dialog"
          as="div"
          {...rest}
          className={clsx("fixed z-modal inset-0 overflow-y-auto", open && "open")}
          open={open}
          onClose={onClose}
          initialFocus={buttonRefs[currentSlideIndex]}
        >
          <div className="flex items-center justify-center min-h-screen text-center pt-4 px-4 pb-20 sm:block sm:pb-4">
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
              leaveTo="opacity-0 translate-y-10 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-middle bg-white text-left overflow-hidden transform transition-all w-full rounded-lg shadow-xl lg:max-w-6xl 2xl:max-w-7xl">
                <div ref={ref} {...rest} className={clsx("flex flex-col bg-cool-gray-800 text-white", rest.className)}>
                  <div className="w-full sm:flex sm:justify-between items-center pt-6 pl-6 pr-20 mb-6">
                    <h2 className="mb-2 sm:mb-0 font-bold text-4xl text-white">Main navigation</h2>
                    <div className="text-gray-500 text-xl mr-6">
                      Slide {(currentSlideIndex ?? 0) + 1}/{screens.length}
                    </div>
                    <CloseButton onClick={onClose}>
                      <XIcon />
                    </CloseButton>
                  </div>
                  <div className="flex-grow px-6 pt-1 pb-4 overflow-y-auto">
                    <div className="grid grid-flow-row grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-y-4 2xl:grid-cols-5">
                      {screens?.map((screen, indexh) => {
                        return (
                          <SlideTile
                            key={screen.id}
                            ref={buttonRefs[indexh]}
                            active={indexh === currentSlideIndex}
                            screen={screen}
                            onClick={() => handleScreenSelection(indexh)}
                          >
                            {
                              screen.screenshot ? (
                                <ImgNextGen
                                  srcWebp={screen.screenshot.jpg}
                                  fallback={screen.screenshot.webp}
                                  className="rounded-lg shadow-lg"
                                />
                              ) : screen.id === "custom-image" ? (
                                <img
                                  alt={screen.config?.title || screen.config?.heading || screen.title}
                                  src={screen.config?.url}
                                  className="img-fluid rounded-lg shadow-lg"
                                />
                              ) : null // <img src={screen} />
                            }
                          </SlideTile>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  }
);

const CloseButton = styled.button.attrs({
  className:
    "absolute top-5 right-6 bg-cool-gray-900 border-none rounded-md flex items-center justify-center h-12 w-14 p-3 focus:ring-white focus:ring-opacity-30",
})`
  font-size: 2.5rem;
`;

interface SlideTileProps {
  active: boolean;
  screen: DeckScreenConfig;
  onClick: () => void;
}

const SlideTile = forwardRef<HTMLButtonElement, PropsWithChildren<SlideTileProps>>(
  ({ children, active, screen, onClick }, ref) => {
    const title = screen.config?.title || screen.config?.heading || screen.title;

    return (
      <div className="relative w-full h-full bg-cool-gray-900 rounded-lg">
        <button
          ref={ref}
          type="button"
          className="w-full h-full rounded-lg"
          onClick={onClick}
          autoFocus={active}
          data-screen-id={screen.id}
        >
          <div className="w-full h-full p-3 pb-2 flex flex-col rounded-lg">
            <div className="w-full rounded-lg overflow-hidden bg-cool-gray-700 aspect-w-4 aspect-h-3 mb-2">
              {children}
            </div>
            <div className="w-full flex-grow flex justify-center items-end p-1">
              <span className="text-xs sm:text-sm text-primary font-bold overflow-x-hidden whitespace-nowrap overflow-ellipsis">
                {title}
              </span>
            </div>
          </div>
        </button>
      </div>
    );
  }
);
