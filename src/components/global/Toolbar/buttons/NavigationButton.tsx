import React, { memo, useCallback, useState } from "react";

import { PropsOf } from "@headlessui/react/dist/types";

import { MainNavigation } from "../../MainNavigation";
import { ReactComponent as MainMenuIcon } from "../svgs/MainMenuIcon.svg";
import { ToolbarButton } from "../ToolbarButton";

interface NavigationButtonProps {
  disabled?: boolean;
  onSelectScreen: PropsOf<typeof MainNavigation>["onSelectScreen"];
}

const NavigationButton = memo(function NavigationToolbarToggle({ onSelectScreen, disabled }: NavigationButtonProps) {
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <ToolbarButton
        id="navigation-toggle"
        color={open ? "secondary" : "default"}
        className="open-navigation"
        disabled={disabled}
        title="Open Overview"
        data-cy="toggle-navigation-btn"
        onClick={handleClick}
      >
        <MainMenuIcon />
      </ToolbarButton>
      {/* <Popover.Overlay className={clsx("bg-black", open ? "opacity-30 fixed inset-0 z-50" : "opacity-0")} /> */}
      <MainNavigation open={open} onClose={onClose} onSelectScreen={onSelectScreen} />
    </>
  );
});

export default NavigationButton;
