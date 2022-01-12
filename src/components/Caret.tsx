import React, { FC } from "react";

import { faCaretSquareDown, faCaretSquareRight, IconDefinition } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type CaretDirections = "right" | "down";

interface CaretProps {
  className?: string;
  direction: CaretDirections;
}

const iconMap: Record<CaretDirections, IconDefinition> = {
  right: faCaretSquareRight,
  down: faCaretSquareDown,
};

export const Caret: FC<CaretProps> = ({ direction, className }) => {
  const icon = iconMap[direction];

  if (!icon) return null;

  return <FontAwesomeIcon className={className} icon={icon} />;
};
