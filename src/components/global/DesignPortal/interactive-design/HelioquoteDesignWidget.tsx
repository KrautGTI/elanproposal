import clsx from "clsx";
import React, {
  FC,
  forwardRef,
  PropsWithChildren,
  ReactEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { faCheckCircle } from "@fortawesome/pro-duotone-svg-icons";
import { faExpandAlt, faRedo as faRefresh } from "@fortawesome/pro-light-svg-icons";
import { faSync } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { lockWidget, toggleFrameExpand } from "../../../../features/designPortal";
import { refreshDesignData } from "../../../../features/proposal";
import useComponentSize from "../../../../hooks/useComponentSize";
import Fade from "../../../Fade";
import InteractiveDesignLock from "../components/InteractiveDesignLock";
import NotReadyExplanation from "../components/NotReadyExplanation";

interface HelioquoteDesignWidgetProps {
  url: string | undefined | null;
  locked: boolean;
  lockMessage?: string;
}

const HelioquoteDesignWidget: FC<HelioquoteDesignWidgetProps> = ({
  url: helioquoteUrl,
  locked: isLockedByParent,
  lockMessage,
}) => {
  const frameRef = useRef<HTMLIFrameElement>(null);

  const dispatch = useDispatch();
  const { mutationPending, hasUnsavedChanges } = useSelector(state => state.helioquote);
  const { isWidgetLocked, frameExpanded } = useSelector(state => state.designPortal);

  const isLocked = !!(isLockedByParent || isWidgetLocked);

  const { width } = useComponentSize(frameRef);

  const refreshFromRemote = () => {
    dispatch(refreshDesignData());
  };

  const [refreshTs, setRefreshTs] = useState<number | undefined>();
  const [ready, setReady] = useState(false);

  const refreshIframe = async () => {
    await dispatch(refreshDesignData());
    dispatch(lockWidget());
    setRefreshTs(Date.now());
  };

  const handleToggleFrameExpand = () => {
    dispatch(lockWidget("Optimizing to fit your screen..."));
    setRefreshTs(Date.now());

    dispatch(toggleFrameExpand());
  };

  useEffect(() => {
    if (!width || !helioquoteUrl) return;

    setReady(true);
  }, [width, helioquoteUrl]);

  const remoteUrl = useMemo(() => {
    if (!helioquoteUrl || !ready) return undefined;

    let url = helioquoteUrl;

    if (refreshTs) {
      // Need to use a base URL for when we pass a relative URL for cypress
      const parsed = new URL(helioquoteUrl, "http://localhost");
      parsed.searchParams.delete("refreshTs");
      parsed.searchParams.append("refreshTs", refreshTs.toString());
      url = parsed.toString().replace("http://localhost", "");
    }

    return url;
  }, [helioquoteUrl, ready, refreshTs]);

  if (!helioquoteUrl) {
    return <NotReadyExplanation>Design not ready yet.</NotReadyExplanation>;
  }

  return (
    <>
      <Fade show={!!hasUnsavedChanges && !mutationPending}>
        <OverlayContainer position="bottom-right">
          <button
            type="button"
            className="btn-primary px-6 py-3 font-bold rounded-md text-lg"
            onClick={refreshFromRemote}
            disabled={isLocked}
          >
            <FontAwesomeIcon className="mr-2" icon={isLocked ? faSync : faCheckCircle} spin={!!isLocked} />
            Save Layout
          </button>
        </OverlayContainer>
      </Fade>
      <OverlayContainer position="top-right">
        <HelioquoteStyleButton
          className={clsx(frameExpanded && "bg-secondary text-white")}
          onClick={handleToggleFrameExpand}
          title="Expand Frame"
        >
          <FontAwesomeIcon icon={faExpandAlt} />
        </HelioquoteStyleButton>
        <HelioquoteStyleButton className="ml-4" onClick={refreshIframe} disabled={isLocked} title="Refresh Frame">
          <FontAwesomeIcon icon={faRefresh} />
        </HelioquoteStyleButton>
      </OverlayContainer>
      <InteractiveDesignLock show={isLocked} message={lockMessage} />
      <AspectRatioBox className={clsx("aspect-w-3 aspect-h-4", frameExpanded && "expanded")}>
        <div>
          <iframe
            ref={frameRef}
            id="helioquote-integration"
            title="Optimus"
            src={remoteUrl}
            className="absolute inset-0 w-full h-full overflow-hidden border-0"
            allowFullScreen
          />
        </div>
      </AspectRatioBox>
    </>
  );
};

const AspectRatioBox = styled.div`
  &.expanded {
    --tw-aspect-w: 12;
    --tw-aspect-h: 16;
  }

  ${props => props.theme.breakpoints.up("sm")} {
    --tw-aspect-w: 16;
    --tw-aspect-h: 9;

    &.expanded {
      --tw-aspect-w: 16;
      --tw-aspect-h: 12;
    }
  }
  ${props => props.theme.breakpoints.up("sm")} and (orientation: portrait) {
    &.expanded {
      --tw-aspect-w: 14;
      --tw-aspect-h: 16;
    }
  }
  ${props => props.theme.breakpoints.up("md")} {
    &.expanded {
      --tw-aspect-w: 14;
      --tw-aspect-h: 16;
    }
  }
  ${props => props.theme.breakpoints.up("lg")} {
    &.expanded {
      --tw-aspect-w: 16;
      --tw-aspect-h: 14;
    }
  }
  ${props => props.theme.breakpoints.up("lg")} and (orientation: portrait) {
    &.expanded {
      --tw-aspect-w: 14;
      --tw-aspect-h: 16;
    }
  }
  ${props => props.theme.breakpoints.up("xl")} {
    &:not(.expanded) {
      position: static;
      padding-bottom: 0;
    }
    &.expanded {
      --tw-aspect-w: 16;
      --tw-aspect-h: 12;
    }
  }
  ${props => props.theme.breakpoints.up("xl")} and (orientation: portrait) {
    &.expanded {
      --tw-aspect-w: 14;
      --tw-aspect-h: 16;
    }
  }
`;

export default HelioquoteDesignWidget;

const overlayContainerClasses = {
  "top-left": "top-4 left-4",
  "top-right": "top-20 sm:top-5 right-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
};

interface OverlayContainerProps {
  position: "top-left" | "top-right" | "bottom-right" | "bottom-left";
}

const OverlayContainer = forwardRef<HTMLDivElement, PropsWithChildren<OverlayContainerProps>>(
  ({ children, position }, ref) => {
    return (
      <div ref={ref} className={clsx("absolute flex", overlayContainerClasses[position])} style={{ zIndex: 10 }}>
        {children}
      </div>
    );
  }
);

interface HelioquoteStyleButtonProps {
  className?: string;
  onClick: ReactEventHandler;
  disabled?: boolean;
  title?: string;
}

const HelioquoteStyleButton = forwardRef<HTMLButtonElement, PropsWithChildren<HelioquoteStyleButtonProps>>(
  ({ children, className, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={clsx("bg-gray-100 border border-black text-sm text-black rounded-md px-4 py-2", className)}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
