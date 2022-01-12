import clsx from "clsx";
import { memo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { boardCreated } from "../../../features/drawMode";

interface AnnotationBoardProps {
  id: string;
  show: boolean;
}

const AnnotationBoard = memo(function AnnotationBoard({ id, show }: AnnotationBoardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!ref.current) return;
    dispatch(boardCreated(id));
  }, [dispatch, id]);

  return (
    <Board ref={ref} className={clsx("drawing-board", !show && "invisible")} aria-hidden={!show} data-board-id={id} />
  );
});

export default function AnnotationsOverlay() {
  const { enabled, boards } = useSelector(state => state.drawMode);
  const currentSlideId = useSelector(state => state.deck.currentSlideId);

  return (
    <Wrapper id="annotation-overlay" className={clsx(enabled && "active")}>
      <InnerWrapper className="boards">
        {Object.keys(boards).map(id => (
          <AnnotationBoard key={id} id={id} show={id === currentSlideId} />
        ))}
      </InnerWrapper>
      <div className="saved-annotations"></div>
    </Wrapper>
  );
}

const Board = styled.div`
  --margin-factor: calc(var(--deck-margin, 0) + 1);
  position: absolute;
  width: calc(var(--deck-width) * var(--deck-scale, 1) * var(--margin-factor, 1) * 1px);
  height: calc(var(--deck-height) * var(--deck-scale, 1) * var(--margin-factor, 1) * 1px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 98;
  transition: opacity 250ms ease;
  pointer-events: none;

  &.active {
    pointer-events: auto;
  }
`;

const InnerWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  overflow: visible;
  z-index: 1;
  text-align: center;
`;
