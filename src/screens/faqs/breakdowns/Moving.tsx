import { FC } from "react";

import { ReactComponent as MovingVisual } from "../images/MovingVisual.svg";
import { MovingIcon } from "../svg/Moving";

export const MovingBreakdown: FC = () => {
  return (
    <div className="relative w-full h-full">
      <div className="flex mb-6">
        <div className="pr-6">
          <MovingIcon />
        </div>
        <div className="flex-grow">
          <span className="font-bold text-5xl">What Happens if I Move?</span>
        </div>
      </div>
      <div className="text-xl mb-10">
        Congratulations on the move! Just let us know and we can make arrangements with your realtor, broker, title
        company, escrow agent, trusts, holdings co, etc to ensure the successful handoff to the new homeowners. They
        will love it just the way you love it. &nbsp;<span className="font-bold">You have two options:</span>
      </div>
      <div className="w-3/6">
        <div className="font-bold mb-3 text-lg">1) Pay off the remaining balance</div>
        <div className="text-gray-600 mb-10 text-lg leading-6">
          In the vast majority of cases homeowners choose to pay off any remaining balance through the sale of their
          home.
        </div>
        <div className="font-bold mb-3 text-lg">2) Transfer the loan</div>
        <div className="text-gray-600 mb-10 text-lg leading-6">
          However, if the new homeowner wishes to assume the remaining payments, he/she must apply to qualify. If the
          new homeowner is approved, then he/she assumes full responsibility of the loan. In very rare circumstances, if
          he/she is not approved, then you must pay off the remaining balance of the solar system.
        </div>
      </div>
      <div className="absolute bottom-0 right-0">
        <MovingVisual width="600" height="474" />
      </div>
    </div>
  );
};
