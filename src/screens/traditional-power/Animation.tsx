import { addEventListener, removeEventListener } from "dom-helpers";
import { FC, useEffect, useRef } from "react";
import styled from "styled-components";

import traditionalPowerImage from "./images/TraditionalPower.png";
import SmokeStack from "./SmokeStack";
import TraditionalPowerOverlay from "./TraditionalPowerOverlay";

interface AnimationProps {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
}

const Animation: FC<AnimationProps> = ({ activeIndex, setActiveIndex }) => {
  const mainSvgRef = useRef<SVGSVGElement | null>(null);
  const width = 1296.41;
  const height = 665.86;

  useEffect(() => {
    const svg = mainSvgRef.current;

    if (!svg) {
      return;
    }

    const listeners = [
      { selectors: ["#collection", "text#collectionLabel"], cb: () => setActiveIndex(0) },
      { selectors: ["#generation", "text#generationLabel"], cb: () => setActiveIndex(1) },
      { selectors: ["#transference", "text#transferenceLabel"], cb: () => setActiveIndex(2) },
      { selectors: ["#distribution", "text#distributionLabel"], cb: () => setActiveIndex(3) },
      { selectors: ["#conversion", "text#conversionLabel"], cb: () => setActiveIndex(4) },
      { selectors: ["#houseSolar", "text#consumptionLabel"], cb: () => setActiveIndex(5) },
    ];

    listeners.forEach(({ selectors, cb }) => {
      selectors.forEach(selector => {
        let el = svg.querySelector<HTMLElement>(selector);
        if (el) {
          addEventListener(el, "click", cb);
        } else {
          console.warn(`Missing element for "${selector}"`);
        }
      });
    });

    return () => {
      listeners.forEach(({ selectors, cb }) => {
        selectors.forEach(selector => {
          let el = svg.querySelector<HTMLElement>(selector);
          if (el) {
            removeEventListener(el, "click", cb);
          } else {
            console.warn(`Missing element for "${selector}"`);
          }
        });
      });
    };
  }, [setActiveIndex]);

  useEffect(() => {}, [activeIndex]);

  return (
    <Wrapper className="flex justify-end items-end relative" data-index={activeIndex}>
      <div className="w-full relative" style={{ width, height }}>
        <img
          alt=""
          src={traditionalPowerImage}
          width={width}
          height={height}
          className="absolute bottom-0 right-0 bg-img"
        />
        <TraditionalPowerOverlay ref={mainSvgRef} className="absolute bottom-0 right-0" />
        <SmokeStack className="absolute" style={{ top: 50, left: 288 }} />
      </div>
    </Wrapper>
  );
};

export default Animation;

const Wrapper = styled.div`
  position: absolute;
  top: auto;
  right: 0;
  bottom: 4rem;
  left: auto;
  width: 100%;
  height: 100%;

  text#collectionLabel,
  text#generationLabel,
  text#transferenceLabel,
  text#distributionLabel,
  text#conversionLabel,
  text#consumptionLabel {
    cursor: pointer;
  }

  #collection,
  #generation,
  #transference,
  #distribution,
  #conversion,
  #houseSolar {
    cursor: pointer;
    opacity: 0;
    transition: 250ms opacity ease-in-out;
  }

  svg text {
    color: #1e2429;
    fill: currentColor !important;
    font-size: 16.154;
    font-weight: 700;
  }

  &[data-index="0"] {
    #generation {
      opacity: 1;
    }
    svg#smokeStack {
      display: none;
    }
    text#generationLabel {
      color: #8b97a2;
      font-weight: 400;
      font-size: 16;
    }
  }

  &[data-index="0"],
  &[data-index="1"] {
    #transference {
      opacity: 1;
    }
    text#transferenceLabel {
      color: #8b97a2;
      font-weight: 400;
      font-size: 16;
    }
  }

  &[data-index="0"],
  &[data-index="1"],
  &[data-index="2"] {
    #distribution {
      opacity: 1;
    }
    text#distributionLabel {
      color: #8b97a2;
      font-weight: 400;
      font-size: 16;
    }
  }

  &[data-index="0"],
  &[data-index="1"],
  &[data-index="2"],
  &[data-index="3"] {
    #conversion {
      opacity: 1;
    }
    text#conversionLabel {
      color: #8b97a2;
      font-weight: 400;
      font-size: 16;
    }
  }

  &[data-index="0"],
  &[data-index="1"],
  &[data-index="2"],
  &[data-index="3"],
  &[data-index="4"] {
    #houseSolar {
      opacity: 1;
    }
    text#consumptionLabel {
      color: #8b97a2;
      font-weight: 400;
      font-size: 16;
    }
  }
`;
