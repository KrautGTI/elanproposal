import clsx from "clsx";
import { differenceInSeconds, fromUnixTime } from "date-fns";
import { FC, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Transition } from "@headlessui/react";

import { initRoofImage, refetchRoofImage } from "../features/roofImage";
import { useInterval } from "../hooks/useInterval";
import { PingAnimation } from "./PingAnimation";

const NOT_READY_MESSAGE = "Top down view of the solar design is not yet ready.";

const RoofImage: FC<{ url: string | undefined | null }> = ({ url: remoteImageUrl }) => {
  const dispatch = useDispatch();
  const { url, hasError, loading, retryAt } = useSelector(state => state.roofImage);

  useEffect(() => {
    if (!remoteImageUrl) return;
    dispatch(initRoofImage(remoteImageUrl));
  }, [dispatch, remoteImageUrl]);

  return (
    <div className="absolute inset-0">
      {!!hasError && <NoImageExplanation>{NOT_READY_MESSAGE}</NoImageExplanation>}
      {!!remoteImageUrl && (
        <Transition
          appear
          unmount
          show={!!url && !loading}
          className="absolute top-3 right-3 z-50"
          enter="transition-opacity duration-1000"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <button
            className="px-3 py-1 border-2 border-white text-black bg-white bg-opacity-40 rounded-sm print:hidden"
            onClick={() => dispatch(refetchRoofImage(remoteImageUrl))}
          >
            Refresh Roof Image
          </button>
        </Transition>
      )}
      <Transition
        appear
        unmount={false}
        show={!!url}
        className="absolute inset-0"
        enter="transition-opacity duration-1000"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <img className="h-full w-full object-cover" alt="Top down view of solar design." src={url} />
      </Transition>
      <Transition
        appear
        unmount
        show={!!loading}
        className={clsx(
          "absolute inset-0 flex flex-col items-center justify-end text-white",
          !!url && "bg-black bg-opacity-40"
        )}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="mb-6 flex flex-col justify-center items-center">
          {!!retryAt && (
            <div className="mb-3">
              <RetryCountdown retryAt={retryAt} />
            </div>
          )}
          <PingAnimation height={80} width={80} />
        </div>
      </Transition>
    </div>
  );
};

export default RoofImage;

const NoImageExplanation: FC = ({ children }) => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="text-2xl">{children}</div>
    </div>
  );
};

const RetryCountdown: FC<{ retryAt: number }> = memo(({ retryAt }) => {
  const findSecondsRetry = () => differenceInSeconds(fromUnixTime(retryAt), new Date());

  const [seconds, setSeconds] = useState(findSecondsRetry);

  useInterval(() => {
    setSeconds(findSecondsRetry());
  }, 1_000);

  if (seconds < 0) {
    return null;
  }

  return <div>{`Retrying in ${seconds} seconds...`}</div>;
});
