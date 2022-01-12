import clsx from "clsx";
import { useSelector } from "react-redux";
import styled from "styled-components";

import {
  canUserEditProposal,
  getIsHelioquoteDesign,
  getHasArrayData,
  getUseSimplifiedProductionCalcs,
  canShare,
} from "../../../lib/selectors";
import { ColorMode } from "../../../types";
import DesignToolButton from "./buttons/DesignToolButton";
import DrawModeButton from "./buttons/DrawModeButton";
import GoToDealButton from "./buttons/GoToDealButton";
import GoToFinancingButton from "./buttons/GoToFinancingButton";
import NavigationButton from "./buttons/NavigationButton";
import PrintButton from "./buttons/PrintButton";
import ShareProposalButton from "./buttons/ShareProposalButton";

interface ToolbarProps {
  mode?: ColorMode;
  className?: string;
  onGoLeft?: () => void;
  onSelectScreen: (screenIndex: number) => void;
  onGoRight?: () => void;
}

export const Toolbar = (props: ToolbarProps) => {
  const { onSelectScreen } = props;

  const canEdit = useSelector(canUserEditProposal);
  const showShareButton = useSelector(canShare);
  const drawEnabled = useSelector(state => state.drawMode.enabled);
  const isHelioquoteDesign = useSelector(getIsHelioquoteDesign);
  const hasArrayData = useSelector(getHasArrayData);
  const useSimplifiedProductionCalcs = useSelector(getUseSimplifiedProductionCalcs);

  const colorModeClassName = clsx(props.mode ?? "light");

  if (!canEdit) {
    return (
      <ToolbarWrapper className={colorModeClassName}>
        <NavigationButton onSelectScreen={onSelectScreen} />
      </ToolbarWrapper>
    );
  }

  return (
    <ToolbarWrapper className={colorModeClassName}>
      <GoToDealButton disabled={drawEnabled} />
      <ToolbarSeparator />
      {(isHelioquoteDesign || hasArrayData || useSimplifiedProductionCalcs) && (
        <>
          <DesignToolButton disabled={drawEnabled} />
          <ToolbarSeparator />
        </>
      )}
      <NavigationButton onSelectScreen={onSelectScreen} disabled={drawEnabled} />
      <DrawModeButton disabled={false} />
      <ToolbarSeparator />
      {showShareButton && <ShareProposalButton disabled={drawEnabled} />}
      <PrintButton disabled={drawEnabled} />
      <GoToFinancingButton disabled={drawEnabled} />
    </ToolbarWrapper>
  );
};

const ToolbarWrapper = styled.div`
  display: flex;
`;

const ToolbarSeparator = styled.div.attrs({ className: "mx-2 lg:mx-3" })`
  width: 1px;
  height: 30px;
  margin-top: 5px;
  background-color: #dee2e7;

  .dark & {
    background-color: #424e5a;
  }
`;
