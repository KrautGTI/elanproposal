import clsx from "clsx";
import { FC, Fragment } from "react";

import { Transition } from "@headlessui/react";

interface FadeProps {
  show: boolean;
  duration?: keyof typeof durationMap;
  unmount?: boolean;
}

const durationMap = {
  75: "duration-75",
  100: "duration-100",
  150: "duration-150",
  200: "duration-200",
  300: "duration-300",
  500: "duration-500",
  700: "duration-700",
  1000: "duration-1000",
};

const Fade: FC<FadeProps> = ({ children, show, duration = 150, unmount }) => {
  return (
    <Transition
      as={Fragment}
      show={show}
      enter={clsx("transition-opacity", durationMap[duration])}
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave={clsx("transition-opacity", durationMap[duration])}
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      unmount={unmount}
    >
      {children}
    </Transition>
  );
};

export default Fade;
