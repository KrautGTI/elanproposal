import { FC } from "react";

import clsx from "clsx";

interface SlideProps {
  in: boolean;
  timeout?: keyof typeof durationMap;
  className?: string;
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

const Slide: FC<SlideProps> = ({ children, in: show, className, timeout = 150 }) => {
  return (
    <div
      className={clsx("transition-transform", className, durationMap[timeout], {
        "translate-y-0": show,
        "translate-y-[-115%]": !show,
      })}
    >
      {children}
    </div>
  );
};

export default Slide;
