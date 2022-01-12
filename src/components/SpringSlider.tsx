import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { animated, useSprings } from "@react-spring/web";

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledSlider = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

const StyledSlide = styled.div`
  width: 100%;
  height: 100%;
  will-change: transform;
  user-select: none;
`;

interface SpringSliderProps {
  activeIndex?: number;
  auto?: number;
  children?: React.ReactNode[];
  onSlideChange?: (slide: number) => void;
  setSlideCustom?: (slide: number) => number;
  slidesAtOnce?: number;
}

const SpringSlider: React.FunctionComponent<SpringSliderProps> = ({
  activeIndex = 0,
  auto = 0,
  children = [],
  onSlideChange = () => undefined,
  setSlideCustom = undefined,
  slidesAtOnce = 1,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [slide, setSlideOriginal] = useState(0);
  const setSlide = setSlideCustom ? (index: number) => setSlideOriginal(setSlideCustom(index)) : setSlideOriginal;

  // Initialize slides with spring
  const [springs, api] = useSprings(children.length, index => ({
    offset: index,
    width: 100 / slidesAtOnce,
  }));

  // Triggered on slide change
  useEffect(() => {
    api.start(index => ({ offset: index - slide, width: 100 / slidesAtOnce }));
    onSlideChange(slide);

    return () => {
      api.stop();
    };
  }, [slide, slidesAtOnce, api, onSlideChange]);

  // Effect for autosliding
  useEffect(() => {
    let interval: number;

    if (auto > 0) {
      interval = window.setInterval(() => {
        const targetIndex = (slide + 1) % children.length;
        setSlide(targetIndex);
      }, auto);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, children.length, slide]);

  // Jump to slide index when prop changes
  useEffect(() => {
    setSlide(activeIndex % children.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, children.length]);

  // Sets pointer events none to every child and preserves styles
  const childs = children.map((child, index) => (
    <StyledSlide key={index}>{child}</StyledSlide> // eslint-disable-line react/no-array-index-key
  ));

  return (
    <StyledWrapper ref={sliderRef}>
      <StyledSlider>
        {springs.map(({ offset, width }, index) => (
          <animated.div
            key={index} // eslint-disable-line react/no-array-index-key
            className="slider__slide"
            style={{
              transform: offset.to(offsetX => `translate3d(${offsetX * 100}%, 0, 0)`),
              position: "absolute",
              width: width.to(percentWidth => `${percentWidth}%`),
              height: "100%",
              willChange: "transform, width",
            }}
            data-cy={`spring-slide--${index}`}
          >
            {childs[index]}
          </animated.div>
        ))}
      </StyledSlider>
    </StyledWrapper>
  );
};

export default SpringSlider;
