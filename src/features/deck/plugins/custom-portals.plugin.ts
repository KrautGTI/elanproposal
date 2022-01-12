import toString from "lodash/toString";
import numeral from "numeral";

import type { Reveal, RevealPlugin } from "reveal.js";

const CustomPortalsPlugin: RevealPlugin = {
  id: "custom-portals",
  init: async deck => {
    initScalePlugin(deck);
  },
};

export default CustomPortalsPlugin;

const limitFloat = (num: number) => numeral(num).format("0[.]00000");

function initScalePlugin(deck: Reveal) {
  function setCssVariables() {
    const { width, height } = deck.getComputedSlideSize();
    const scale = deck.getScale();

    document.documentElement.style.setProperty("--deck-width", limitFloat(width));
    document.documentElement.style.setProperty("--deck-height", limitFloat(height));
    document.documentElement.style.setProperty("--deck-scale", limitFloat(scale));
    document.documentElement.style.setProperty("--deck-margin", toString(deck.getConfig().margin || "0"));
  }

  deck.on("ready", setCssVariables);
  deck.on("resize", setCssVariables);
}
