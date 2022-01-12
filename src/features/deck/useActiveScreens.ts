import { useMemo } from "react";
import { useSelector } from "react-redux";

import { lookupRegisteredScreen, isScreenRegistered } from "../../screen-registry";

import type { ProposalSlideDefinition, DeckScreenConfig, EnerfloProposalData } from "../../types";

export default function useActiveScreens({ printMode }: { printMode?: boolean } = {}) {
  const slides = useSelector(state => state.template.data?.slides);
  const proposal = useSelector(
    state => state.proposal.data,
    (a, b) => !!a && a?.surveyId === b?.surveyId
  );

  return useMemo(() => {
    if (!slides || !proposal) return [];

    const registeredSlides = slides
      .filter(({ id }) => !!isScreenRegistered(id))
      .map(createScreenFromSlideConfig)
      .filter(screen => canScreenRenderForProposal(screen, proposal));

    if (printMode) {
      return expandScreensForPrint(registeredSlides, proposal);
    }

    return registeredSlides;
  }, [slides, proposal, printMode]);
}

function createScreenFromSlideConfig({ id, config }: ProposalSlideDefinition): DeckScreenConfig {
  return {
    ...lookupRegisteredScreen(id),
    config,
  };
}

function canScreenRenderForProposal(screen: DeckScreenConfig, proposal: EnerfloProposalData) {
  // Cannot render any screens without a proposal
  if (!proposal) return false;

  // If we have a callback to check, check it
  if (screen.canRender) return screen.canRender(proposal);

  // Assume true
  return true;
}

function expandScreensForPrint(screens: DeckScreenConfig[], proposal: EnerfloProposalData) {
  const expanded: DeckScreenConfig[] = [];

  for (let screen of screens) {
    if (screen.getPrintModeProps) {
      expanded.push(
        ...screen
          .getPrintModeProps(screen.config, proposal)
          .map(extraConfig => ({ ...screen, config: { ...screen.config, ...extraConfig } }))
      );
    } else {
      expanded.push(screen);
    }
  }

  return expanded;
}
