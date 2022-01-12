import debounce from "lodash/debounce";
import { useState, useLayoutEffect, RefObject, useRef } from "react";

function getSize(el: HTMLElement | null) {
  if (!el) {
    return {
      width: 0,
      height: 0,
    };
  }

  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}

type UseComponentSizeOptions = {
  debounceTime?: number;
};

export default function useComponentSize(
  ref: RefObject<HTMLElement>,
  { debounceTime = 500 }: UseComponentSizeOptions = {}
) {
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [componentSize, setComponentSize] = useState(() => getSize(ref.current));

  useLayoutEffect(
    function () {
      if (!ref.current) return;

      let el = ref.current;

      const handleResize = debounce(() => {
        setComponentSize(getSize(el));
      }, debounceTime);

      handleResize();

      if (typeof ResizeObserver === "function") {
        resizeObserverRef.current = new ResizeObserver(() => {
          handleResize();
        });

        resizeObserverRef.current.observe(ref.current);

        return () => {
          resizeObserverRef.current?.disconnect();
          resizeObserverRef.current = null;
        };
      } else {
        window.addEventListener("resize", handleResize);

        return function () {
          window.removeEventListener("resize", handleResize);
        };
      }
    },
    [ref, resizeObserverRef, debounceTime]
  );

  return componentSize;
}
