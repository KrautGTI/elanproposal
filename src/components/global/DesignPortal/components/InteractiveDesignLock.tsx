import { Transition } from "@headlessui/react";

import { PingAnimation } from "../../../PingAnimation";

interface InteractiveDesignLockProps {
  show: boolean;
  message?: string;
}

const InteractiveDesignLock = ({ show = false, message }: InteractiveDesignLockProps) => {
  return (
    <Transition
      appear
      unmount
      show={show}
      className="absolute inset-0 bg-white flex flex-col justify-center items-center"
      style={{ zIndex: 10 }}
      enter="transition-opacity duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-500"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div data-cy="interactive-design-lock" className="text-primary flex flex-col justify-center items-center">
        <div className="mb-4">
          <PingAnimation width={80} height={80} />
        </div>
        <div className="text-3xl font-bold">{message}</div>
      </div>
    </Transition>
  );
};

export default InteractiveDesignLock;
