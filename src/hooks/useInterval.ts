import { useCallback, useEffect, useRef } from "react";

type Delay = number | null;
type TimerHandler = (...args: any[]) => void;

/**
 * Provides a declarative useInterval
 *
 * @param callback - Function that will be called every `delay` ms.
 * @param delay - Number representing the delay in ms. Set to `null` to "pause" the interval.
 */

export const useInterval = (callback: TimerHandler, delay: Delay) => {
  const savedCallbackRef = useRef<TimerHandler>();
  const intervalIdRef = useRef<NodeJS.Timer | null>(null);

  const stop = useCallback(() => {
    if (!intervalIdRef.current) return;
    clearInterval(intervalIdRef.current);
    intervalIdRef.current = null;
  }, []);

  useEffect(() => {
    savedCallbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (...args: any[]) => savedCallbackRef.current!(...args);

    if (delay !== null) {
      const intervalId = setInterval(handler, delay);
      intervalIdRef.current = intervalId;

      return stop;
    }
  }, [delay, stop]);

  return stop;
};
