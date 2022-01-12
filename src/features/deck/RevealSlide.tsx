import clsx from "clsx";
import kebabCase from "lodash/kebabCase";
import React, { memo, PropsWithChildren, useMemo, useRef } from "react";
import styled from "styled-components";

import { ColorMode, LogoPosition, RevealSectionProps } from "../../types";

interface DeckSlideProps {
  id: string;
  className?: string;
  hideId?: boolean;
  dataProps?: RevealSectionProps & {
    colorMode?: ColorMode;
    logoPosition?: LogoPosition;
  };
}

const RevealSlide = memo<PropsWithChildren<DeckSlideProps>>(({ id, className, hideId, dataProps, children }) => {
  const ref = useRef<HTMLDivElement>(null);

  const htmlDataProps = useMemo(
    () =>
      Object.keys(dataProps ?? {}).reduce((acc, key) => {
        acc[`data-${kebabCase(key)}`] = dataProps?.[key];
        return acc;
      }, {}),
    [dataProps]
  );

  return (
    <section
      ref={ref}
      id={hideId ? undefined : id}
      className={clsx("slide h-full w-full", className)}
      // custom
      data-slide-id={id}
      {...htmlDataProps}
    >
      <SlideFrame className="slide-frame">{children}</SlideFrame>
    </section>
  );
});

export default RevealSlide;

const SlideFrame = styled.div`
  position: relative;
  width: calc(var(--deck-width, 1366) * 1px);
  height: calc(var(--deck-height, 1024) * 1px);
`;
