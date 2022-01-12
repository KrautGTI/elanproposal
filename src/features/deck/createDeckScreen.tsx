import { getDisplayName } from "next/dist/next-server/lib/utils";
import { useSelector } from "react-redux";

import { selectDeckFeatureFlags } from "../../lib/selectors";
import { DeckScreen, DeckScreenConfig } from "../../types";

export default function createDeckScreen<P>(
  Component: DeckScreen<P>,
  config: Omit<DeckScreenConfig<P>, "component">
): DeckScreenConfig<P> {
  function WithDeckScreen(props: P & { id: string }) {
    const features = useSelector(selectDeckFeatureFlags);
    const isActive = useSelector(state => state.deck.currentSlideId === config.id);

    return (
      <>
        <Component {...props} features={features} isActive={isActive || features.printMode} />
      </>
    );
  }

  WithDeckScreen.displayName = `DeckScreen(${getDisplayName(Component)})`;

  return {
    ...config,
    component: WithDeckScreen,
  };
}
