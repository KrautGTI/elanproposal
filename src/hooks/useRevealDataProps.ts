import kebabCase from "lodash/kebabCase";
import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";

import { syncSlideById } from "../features/deck";

import type { RevealSectionProps } from "../types";

export const useRevealDataProps = (id: string, props: RevealSectionProps) => {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const slideElement = document.querySelector(`section[data-slide-id=${id}]`) as HTMLDivElement;

    let changed = false;

    if (slideElement) {
      Object.keys(props).forEach(key => {
        if (slideElement.dataset[key] !== `${props[key]}`) {
          changed = true;
          console.log("setting attribute", `data-${kebabCase(key)}`, props[key]);
          slideElement.setAttribute(`data-${kebabCase(key)}`, props[key]);
        }
      });
    }

    if (changed) {
      console.log("syncing slide", id);
      dispatch(syncSlideById(id));
    }
  }, [dispatch, id, props]);
};
