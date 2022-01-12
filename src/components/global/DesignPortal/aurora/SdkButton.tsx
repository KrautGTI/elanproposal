import clsx from "clsx";
import { FC, MouseEventHandler } from "react";

interface SdkButtonProps {
  disabled: boolean;
  onClick: MouseEventHandler;
  name: string | JSX.Element;
  left: boolean;
  right: boolean;
  active: boolean;
}

const SdkButton: FC<SdkButtonProps> = ({ disabled, onClick, name, left, right, active }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      style={{ boxShadow: "none", outline: "none" }}
      className={clsx(
        "h-10 -ml-px relative inline-flex items-center transition-all px-4 py-1 border text-sm font-medium no-focus-ring",
        active && !disabled
          ? "bg-indigo-700 text-white bg-primary hover:bg-primary-dark"
          : "text-gray-700 border-gray-300 bg-white  hover:bg-gray-50",
        left && "rounded-l-lg",
        right && "rounded-r-lg",
        disabled && "bg-gray-100 cursor-auto hover:bg-gray-100"
      )}
    >
      {name}
    </button>
  );
};

export default SdkButton;
