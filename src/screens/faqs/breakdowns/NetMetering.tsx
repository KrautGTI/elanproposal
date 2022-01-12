import { FC } from "react";

import { CollapseableFAQs } from "../CollapseableFAQs";
import { NetMeteringIcon } from "../svg/NetMetering";

export const NetMeteringBreakdown: FC<{ expandAll: boolean }> = ({ expandAll }) => {
  return (
    <div className="w-full h-full">
      <div className="flex mb-10">
        <div className="pr-6">
          <NetMeteringIcon />
        </div>
        <div className="flex-grow">
          <div className="mb-4">
            <span className="font-bold text-5xl">Net Metering</span>
          </div>
        </div>
      </div>
      <CollapseableFAQs
        expandAll={expandAll}
        faqs={[
          {
            label: "Will I still have an electric bill from my utility company after I go solar?",
            renderAnswer: () => (
              <div className="py-8 px-4 text-xl">
                Yes, most of our customers will still pay a vastly reduced Electricity Bill to their Utility in addition
                to their monthly loan solar payment. Typically, homeowners consume more electricity than the solar
                system generates, therefore, you will still owe your utility for that excess consumption. However, if
                the solar system generates more electricity than you use, you may be eligible for credits from your
                Utility Provider.
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
