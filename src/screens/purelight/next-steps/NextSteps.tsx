import React from "react";

import TitleLayout from "../../../components/layouts/TitleLayout";
import { DeckScreen } from "../../../types";
import WhatsNextSteps from "../components/WhatsNextSteps";

const NextSteps: DeckScreen = () => {
  return (
    <TitleLayout title={"What’s Next"} titleClassName="text-white">
      <div className="mx-10 flex flex-col justify-between h-full">
        <WhatsNextSteps mode="light" />
        <div className="text-center text-white text-md opacity-75 leading-snug mt-auto">
          <p>Average project length is 8-12 weeks</p>
          <p>Ground mounts and other extra electrical work will prolong completion of project</p>
          <p>Project will be placed on hold until funding is approved</p>
          <p>Permitting time varies depending on utility and location</p>
        </div>
      </div>
    </TitleLayout>
  );
};

export default NextSteps;
