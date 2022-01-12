import clsx from "clsx";
import { FC, forwardRef, HTMLProps } from "react";

export const InputLabel: FC<{ className?: string } & HTMLProps<HTMLLabelElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <label className={clsx("block text-sm font-medium text-gray-800", className)} {...rest}>
      {children}
    </label>
  );
};

export const Input = forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>(({ name, className, ...rest }, ref) => {
  return (
    <input
      ref={ref}
      className={clsx(
        "focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md",
        className
      )}
      type="text"
      name={name}
      {...rest}
    />
  );
});
