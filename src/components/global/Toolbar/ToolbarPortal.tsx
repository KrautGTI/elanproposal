import React, { memo, useCallback, VFC } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { gotoIndex, gotoNext, gotoPrev } from "../../../features/deck";
import { Toolbar } from "./Toolbar";

export const ToolbarPortal: VFC = memo(() => {
  const dispatch = useDispatch();
  const mode = useSelector(state => state.deck.colorMode || "light");

  const handleGoLeft = useCallback(() => {
    dispatch(gotoPrev);
  }, [dispatch]);

  const handleSelectScreen = useCallback(
    (indexh: number) => {
      dispatch(gotoIndex(indexh));
    },
    [dispatch]
  );

  const handleGoRight = useCallback(() => {
    dispatch(gotoNext);
  }, [dispatch]);

  return (
    <ToolbarPortalWrapper className="toolbar-portal" data-mode={mode} data-toolbar-layout="top-right">
      <Toolbar mode={mode} onGoLeft={handleGoLeft} onSelectScreen={handleSelectScreen} onGoRight={handleGoRight} />
    </ToolbarPortalWrapper>
  );
});

const ToolbarPortalWrapper = styled.div`
  z-index: 99;
  position: absolute;
  top: 1rem;
  left: 1rem;

  &[data-toolbar-layout="top-right"] {
    left: auto;
    right: 1rem;
  }

  ${props => props.theme.breakpoints.up("lg")} {
    left: 2rem;

    &[data-toolbar-layout="top-right"] {
      right: 2rem;
      left: auto;
    }
  }
`;
