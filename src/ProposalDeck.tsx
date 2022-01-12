import clsx from "clsx";
import dynamic from "next/dynamic";
import ErrorSplash from "next/error";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { createSelector } from "@reduxjs/toolkit";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { LogoPortal } from "./components/global/LogoPortal";
import { ToolbarPortal } from "./components/global/Toolbar";
import Loader from "./components/LoadingIcon";
import PrintableViewAlert from "./components/PrintableViewAlert";
import { initDeck } from "./features/deck";
import RevealSlide from "./features/deck/RevealSlide";
import useActiveScreens from "./features/deck/useActiveScreens";
import DialogManager from "./features/dialogs/DialogManager";
import { initProposal } from "./features/proposal";
import { getDeckReady, getProposal, getProposalError, getProposalLoading, getTemplate } from "./lib/selectors";
import { ThemeProvider } from "./theme";
import { DeckScreenConfig } from "./types";

const AnnotationsOverlay = dynamic(() => import("./components/global/AnnotationsOverlay"), { ssr: false });
const NotificationContainer = dynamic(() => import("./features/notifications/NotificationContainer"), { ssr: false });

const selectReadyToRender = createSelector(
  [getProposal, getTemplate],
  (proposal, template) => !!proposal && !!template
);

const selectShowLoader = createSelector(
  [getProposalError, getProposalLoading, getDeckReady],
  (proposalError, proposalLoading, deckReady) => (!deckReady || proposalLoading) && !proposalError
);
interface ProposalDeckProps {
  reportHash: string;
  printMode: boolean;
}

function ProposalDeck({ reportHash, printMode }: ProposalDeckProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window === "undefined" || !reportHash) return;
    dispatch(initProposal(reportHash));
  }, [dispatch, reportHash]);

  return (
    <ThemeProvider>
      <AppContainer
        id="app"
        className={clsx({
          "static-mode": printMode,
          "slideshow-mode": !printMode,
        })}
      >
        <AppHeader printMode={printMode} />
        <main>
          <DeckSkeleton printMode={printMode} />
          <DeckInitializer printMode={printMode} />
          <ProposalError />
          <LoadingSpinner />
        </main>
        {!printMode && <AnnotationsOverlay />}
        <DialogManager />
        <NotificationContainer />
      </AppContainer>
    </ThemeProvider>
  );
}

export default ProposalDeck;

function LoadingSpinner() {
  const showLoader = useSelector(selectShowLoader);

  if (!showLoader) return null;
  return (
    <div className="absolute inset-0 flex justify-center items-center z-50 pointer-events-none">
      <Loader height={80} width={80} />
    </div>
  );
}

function ProposalError() {
  const error = useSelector(getProposalError);

  if (!error) return null;

  return <ErrorSplash statusCode={error.statusCode} title={error.message} />;
}

const AppContainer = styled.div`
  &.slideshow-mode {
    display: flex;
    flex-direction: column;

    main {
      position: relative;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    #reveal {
      flex-grow: 1;
    }

    .reveal > .backgrounds {
      position: fixed;
    }
  }

  &.static-mode {
    main {
      width: 100%;
      height: 100%;
    }
  }
`;

const AppHeader = ({ printMode }) => {
  const ready = useSelector(getDeckReady);

  if (printMode) {
    if (!ready) return null;

    return <PrintableViewAlert />;
  }

  return (
    <header className="w-full h-14">
      {ready && (
        <>
          <LogoPortal />
          <ToolbarPortal />
        </>
      )}
    </header>
  );
};

const collectDataPropsFromScreen = (screen: DeckScreenConfig) => {
  const dataProps = {
    colorMode: screen.colorMode,
    logoPosition: screen.logoPosition,
  };

  if (screen.getRevealDataProps) {
    Object.assign(dataProps, screen.getRevealDataProps(screen.config));
  }

  return dataProps;
};

const DeckSkeleton = ({ printMode }) => {
  const screens = useActiveScreens({ printMode });
  const error = useSelector(getProposalError);

  return (
    <div id="reveal" className={clsx("reveal", !!error && "hidden")}>
      <div className="slides">
        {screens.map((screen, i) => {
          const dataProps = collectDataPropsFromScreen(screen);

          return (
            <RevealSlide
              key={screen.config?.id ?? screen.id}
              id={screen.config?.id ?? screen.id}
              hideId={i === 0}
              dataProps={dataProps}
            >
              <ErrorBoundary key={screen.id} fallback={null}>
                <screen.component {...screen.config} id={screen.config?.id ?? screen.id} />
              </ErrorBoundary>
            </RevealSlide>
          );
        })}
      </div>
    </div>
  );
};

function DeckInitializer({ printMode }) {
  const dispatch = useDispatch();
  const canRender = useSelector(selectReadyToRender);

  useEffect(() => {
    if (!canRender) return;
    dispatch(initDeck({ printMode }));
  }, [dispatch, canRender, printMode]);

  return null;
}
