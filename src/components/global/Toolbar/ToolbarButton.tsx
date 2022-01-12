import clsx from "clsx";
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef, useMemo } from "react";
import styled from "styled-components";

type ReactButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const BaseToolbarButton = forwardRef<
  HTMLButtonElement,
  { color?: "default" | "primary" | "secondary" } & ReactButtonProps
>(({ color, disabled, ...props }, ref) => {
  const colorClasses = useMemo(() => {
    if (color === "secondary") {
      return "bg-secondary-light text-white";
    } else if (color === "primary") {
      return "bg-primary text-white";
    }

    return "bg-white text-gray-700";
  }, [color]);

  const interactClasses = useMemo(() => {
    if (disabled) {
      return "cursor-not-allowed";
    }

    return "focus:outline-none focus:ring focus:ring-gray-500 focus:ring-opacity-50 hover:ring hover:ring-primary hover:ring-opacity-50";
  }, [disabled]);

  return (
    <button ref={ref} {...props} className={clsx(props.className, colorClasses, interactClasses)} disabled={disabled} />
  );
});

export const ToolbarButton = styled(BaseToolbarButton)`
  text-align: center;
  border: 0;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  margin: 0 4px;
  font-size: initial;
  opacity: 1;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.4;
  }

  .dark & {
    background-color: #424e5a;
    color: #fff;
  }

  svg {
    display: inline-block;
  }
`;
