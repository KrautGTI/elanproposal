import { FC } from "react";

import { CollapseableFAQs } from "../CollapseableFAQs";
import { UpfrontCostIcon } from "../svg/UpfrontCost";

export const UpfrontCostBreakdown: FC<{ expandAll: boolean }> = ({ expandAll }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex mb-10">
        <div className="pr-6">
          <UpfrontCostIcon />
        </div>
        <div className="flex-grow">
          <div className="mb-4">
            <span className="font-bold text-5xl">Upfront Cost</span>
          </div>
        </div>
      </div>
      <CollapseableFAQs
        className="flex-grow"
        expandAll={expandAll}
        faqs={[
          {
            label: "What are the Upfront Costs?",
            renderAnswer: () => (
              <div className="py-8 px-4 text-xl text-center mt-10">
                <div className="font-bold text-primary text-9xl text-center mb-8">Zero...</div>
                <div className="text-gray-500 text-xl">
                  Your monthly payment will come after the system is fully installed.
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
