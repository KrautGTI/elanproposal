import { FC } from "react";
import styled from "styled-components";

import { TileOptions } from "../../../../types/tile-options";
import WhatsNextSteps from "../../components/WhatsNextSteps";
import WhatsNextJpeg from "../images/WhyChooseSolar--WhatsNext.jpg";
import WhatsNextWebp from "../images/WhyChooseSolar--WhatsNext.webp";

const WhatsNext: FC = props => {
  return (
    <BreakdownWrapper className="px-6 lg:px-14 py-10 bg-white rounded-lg shadow-xl">
      <div>
        <h3 className="text-4xl leading-snug font-bold text-gray-900" id="modal-headline">
          What’s Next?
        </h3>
        <WhatsNextSteps mode="dark" />
      </div>
    </BreakdownWrapper>
  );
};

export default {
  id: "whats-next",
  title: "What’s Next?",
  subtitle:
    "PureLight Power makes it easy to go solar. We are with you every step of the way from your custom home design all the way to the day we turn your solar system on.",
  image: { jpg: WhatsNextJpeg, webp: WhatsNextWebp },
  breakdown: WhatsNext,
  hasModal: true,
} as TileOptions;

const BreakdownWrapper = styled.div`
  pointer-events: auto;
  width: 100%;
  min-height: 90%;
`;
