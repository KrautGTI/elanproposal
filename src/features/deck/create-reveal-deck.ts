import { RevealOptions } from "reveal.js";

import CustomPortalsPlugin from "./plugins/custom-portals.plugin";
// import SlideVisibleStatusPlugin from "./plugins/slide-visible-status.plugin";

export const createRevealDeck = async (options: RevealOptions) => {
  const Reveal = await import("reveal.js").then(({ default: Reveal }) => Reveal);

  return new Reveal(document.querySelector("#reveal")!, {
    pdfMaxPagesPerSlide: 1,
    center: true,
    ...options,
    plugins: [CustomPortalsPlugin],
  });
};
