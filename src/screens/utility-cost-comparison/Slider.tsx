import { addEventListener, removeEventListener } from "dom-helpers";
import range from "lodash/range";
import toNumber from "lodash/toNumber";
import noUiSlider, { API, PipsMode } from "nouislider";
import { useEffect, useMemo, useRef } from "react";
import styled from "styled-components";

import type { TaggedEventHandler } from "dom-helpers/cjs/addEventListener";

interface SliderProps {
  min: number;
  max: number;
  value: string | number;
  step?: number;
  onChange: (newValue: number) => void;
}

const Slider = ({ min, max, step = 1, value, onChange }: SliderProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<API | null>(null);

  const rangeValues = useMemo(() => {
    const all = range(min, max + 1);

    return { all, min, max, step };
  }, [min, max, step]);

  useEffect(() => {
    function createSlider(el: HTMLElement | null) {
      if (!el) return null;

      const initialOptions = {
        start: value,
        range: {
          min: rangeValues.min,
          max: rangeValues.max,
        },
        step: rangeValues.step,
        pips: {
          mode: "values" as PipsMode.Values,
          values: rangeValues.all,
          density: Math.round(100 / rangeValues.all.length),
        },
        format: {
          to: function (value) {
            return value;
          },
          from: function (value) {
            return Number(value.replace(",-", ""));
          },
        },
      };

      return noUiSlider.create(el, initialOptions);
    }

    if (!sliderRef.current) {
      sliderRef.current = createSlider(wrapperRef.current);
    } else {
      sliderRef.current.set(value, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sliderRef.current) return;

    const newOptions = {
      range: {
        min: rangeValues.min,
        max: rangeValues.max,
      },
      step: rangeValues.step,
      pips: {
        mode: "values" as PipsMode.Values,
        values: rangeValues.all,
        density: Math.round(100 / rangeValues.all.length),
      },
    };
    sliderRef.current.updateOptions(newOptions, false);
  }, [rangeValues, step]);

  useEffect(() => {
    if (!sliderRef.current) return;
    sliderRef.current.setHandle(0, value);
  }, [value]);

  const currentValueRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (!sliderRef.current) return;

    function handleUpdate(
      values: (number | string)[]
      // handleNumber: number,
      // unencoded: number[],
      // tap: boolean,
      // locations: number[],
      // slider: API
    ) {
      // console.log("handleUpdate", { values, handleNumber, unencoded, tap, locations, slider });

      const value = values[0];

      if (value !== currentValueRef.current) {
        currentValueRef.current = value;

        onChange(toNumber(value));
      }
    }

    sliderRef.current.on("update", handleUpdate);

    return () => {
      sliderRef.current?.off("update");
    };
  }, [onChange]);

  useEffect(() => {
    // Destroy the slider when component unmounts
    return () => {
      sliderRef.current?.destroy();
      sliderRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!wrapperRef.current || !sliderRef.current) return;

    const valuePips = wrapperRef.current.querySelectorAll<HTMLDivElement>(".noUi-value");

    const handlePipClick: TaggedEventHandler<"click"> = e => {
      if (!e.target) return null;
      const element = e.target as HTMLDivElement;

      const value = element.dataset.value;
      if (value) {
        sliderRef.current?.setHandle(0, parseInt(value, 10), true);
      }
    };

    valuePips.forEach(el => {
      addEventListener(el, "click", handlePipClick);
    });

    // Destroy the slider when component unmounts
    return () => {
      valuePips.forEach(el => {
        removeEventListener(el, "click", handlePipClick);
      });
    };
  }, [onChange]);

  return <Wrapper ref={wrapperRef} className="slider" data-prevent-swipe />;
};

export default Slider;

const Wrapper = styled.div`
  height: 18px;
  margin-bottom: 2rem;
  background: rgba(var(--rgb-gray-light), 1);
  border: 0;
  border-radius: 0;
  box-shadow: none;

  .noUi-value {
    color: rgba(158, 158, 158);
    font-weight: 700;
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin-top: 0.5rem;
  }

  .noUi-handle {
    background: rgba(var(--rgb-secondary-dark), 1);
    box-shadow: inset 0 0 1px #fff, inset 0 1px 7px rgba(var(--rgb-secondary-light), 1),
      0 3px 4px -3px rgba(var(--rgb-secondary), 1);
    border-color: #fff;
    border-radius: 1rem;
    width: 56px;
    height: 34px;
    right: -28px;
    top: -9px;

    &:before,
    &:after {
      background: transparent;
      height: 14px;
      width: 14px;
    }

    &:before {
      border-style: solid;
      border-width: 8px 14px 8px 0;
      border-color: transparent #fff transparent transparent;
      left: 50%;
      right: auto;
      top: 50%;
      transform: translate(-50%, -50%) translateX(-10px);
      margin-right: 15px;
    }

    &:after {
      border-style: solid;
      border-width: 8px 0 8px 14px;
      border-color: transparent transparent transparent #fff;
      left: 50%;
      right: auto;
      top: 50%;
      transform: translate(-50%, -50%) translateX(10px);
    }
  }

  html.print-pdf & .noUi-handle {
    -webkit-filter: opacity(1);
  }

  .noUi-marker-large {
    background: rgba(var(--rgb-gray-dark), 0.6);
  }
`;
