import clsx from "clsx";
import { AnchorHTMLAttributes, DetailedHTMLProps, forwardRef, useMemo } from "react";
import styled from "styled-components";

interface ToolbarButtonLinkProps extends DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  color?: "default" | "primary" | "secondary";
  disabled?: boolean;
}

const BaseToolbarButtonLink = forwardRef<HTMLAnchorElement, ToolbarButtonLinkProps>(
  ({ color, disabled, ...props }, ref) => {
    const colorClasses = useMemo(() => {
      if (color === "secondary") {
        return "bg-secondary text-white";
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

    if (disabled) {
      return (
        <button disabled className={clsx(props.className, colorClasses, interactClasses)}>
          {props.children}
        </button>
      );
    }

    return (
      <a {...props} className={clsx(props.className, colorClasses, interactClasses)}>
        {props.children}
      </a>
    );
  }
);

export const ToolbarButtonLink = styled(BaseToolbarButtonLink)`
  display: flex;
  justify-content: center;
  align-items: center;
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
