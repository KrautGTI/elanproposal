import { useDispatch, useSelector } from "react-redux";

import { faHighlighter as faHighlighterOff, faPenAlt as faPenAltOff } from "@fortawesome/pro-light-svg-icons";
import { faUndoAlt } from "@fortawesome/pro-regular-svg-icons";
import { faHighlighter as faHighlighterOn, faPenAlt as faPenAltOn, faTrash } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { changePenType, clearDrawing, toggleDrawingBoard, undoDrawing } from "../../../../features/drawMode";
import { ToolbarButton } from "../ToolbarButton";
import { useCallback } from "react";

interface DrawModeButtonProps {
  disabled?: boolean;
}

const DrawModeButton = function DrawModeToolbarToggle({ disabled }: DrawModeButtonProps) {
  const dispatch = useDispatch();
  const { enabled: drawEnabled, penType } = useSelector(state => state.drawMode);

  const isMarker = penType === "marker";

  const onClickMarker = useCallback(() => {
    if (!drawEnabled || isMarker) {
      dispatch(toggleDrawingBoard());
    } else {
      dispatch(changePenType("marker"));
    }
  }, [dispatch, drawEnabled, isMarker]);

  const markerButton = (
    <ToolbarButton
      className="marker"
      onClick={onClickMarker}
      color={drawEnabled && isMarker ? "secondary" : "default"}
      title="Start Drawing"
      disabled={disabled}
      data-cy="toggle-draw-mode-btn"
    >
      <FontAwesomeIcon icon={drawEnabled && isMarker ? faPenAltOn : faPenAltOff} />
    </ToolbarButton>
  );

  const onClickHighlighter = useCallback(() => {
    if (!drawEnabled || !isMarker) {
      toggleDrawingBoard();
    } else {
      dispatch(changePenType("highlighter"));
    }
  }, [dispatch, drawEnabled, isMarker]);

  const highlighterButton = (
    <ToolbarButton
      className="enable-drawing"
      color={drawEnabled && !isMarker ? "secondary" : "default"}
      onClick={onClickHighlighter}
      disabled={disabled}
      data-cy="draw-highlighter-btn"
    >
      <FontAwesomeIcon icon={drawEnabled && !isMarker ? faHighlighterOn : faHighlighterOff} />
    </ToolbarButton>
  );

  const defaultButton = isMarker ? markerButton : highlighterButton;

  return (
    <>
      {drawEnabled && (
        <>
          <ToolbarButton
            className="clear"
            onClick={() => dispatch(clearDrawing())}
            title="Clear"
            data-cy="drawing-clear-btn"
          >
            <FontAwesomeIcon icon={faTrash} />
          </ToolbarButton>
          <ToolbarButton
            className="undo-drawing"
            onClick={() => dispatch(undoDrawing())}
            title="Undo"
            data-cy="draw-undo-btn"
          >
            <FontAwesomeIcon icon={faUndoAlt} />
          </ToolbarButton>
          {highlighterButton}
          {markerButton}
        </>
      )}
      {!drawEnabled && defaultButton}
    </>
  );
};

export default DrawModeButton;
