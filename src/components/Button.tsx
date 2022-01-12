import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";
import clsx from "clsx";

const SIZE_CLASSES = {
  sm: "h-8 px-4 text-sm",
  md: "h-10 px-5",
  lg: "h-12 px-6 text-lg",
  xl: "h-14 px-8 text-xl",
  "2xl": "h-20 px-8 text-2xl",
};

type ReactButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

interface ButtonProps {
  children?: any;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  square?: boolean;
  color?: "gray" | "primary" | "secondary";
  transitionColors?: boolean;
  type?: ReactButtonProps["type"];
}

export const Button: FC<ButtonProps & Omit<ReactButtonProps, "size">> = props => {
  const { children, className, color, transitionColors = false, size = "md", square = false, ...rest } = props;

  const classes = clsx(
    "btn",
    color === "gray" && "btn-gray",
    color === "primary" && "btn-primary",
    color === "secondary" && "btn-secondary",
    SIZE_CLASSES[size],
    transitionColors && "transition-colors duration-150",
    !square && size !== "sm" && "rounded-lg",
    !square && size === "sm" && "rounded-md",
    `focus:shadow-outline`,
    className
  );

  return (
    <button className={classes} {...rest} type={rest.type ?? "button"}>
      {children}
    </button>
  );
};
