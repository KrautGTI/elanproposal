import { FC } from "react";

import { CollapseableFAQs } from "../CollapseableFAQs";
import { MaintenanceIcon } from "../svg/Maintenance";

export const MaintenanceBreakdown: FC<{ expandAll: boolean }> = ({ expandAll }) => {
  return (
    <div className="w-full h-full">
      <div className="flex">
        <div className="pr-6">
          <MaintenanceIcon />
        </div>
        <div className="flex-grow">
          <div className="mb-4">
            <span className="font-bold text-5xl">Maintenance</span>
          </div>
        </div>
      </div>
      <CollapseableFAQs
        expandAll={expandAll}
        faqs={[
          {
            label: "How Long Do Solar Panels Last?",
            renderAnswer: () => (
              <div className="py-8 px-4 text-xl">
                Solar panels have a lifespan of approximately 25-30 years. And typically, they come with warranties to
                match. Power output warranties guarantee that panel performance won’t fall below a specified level over
                the term of the warranty (usually 25 years). For instance, a manufacturer might provide a warranty to
                guarantee that peak power output won’t fall below 85 percent for 25 years.
              </div>
            ),
          },
          {
            label: "Do they require a lot of maintenance?",
            renderAnswer: () => (
              <div className="py-8 px-4 text-xl">
                Solar panels are incredibly durable and require little to no maintenance. The only thing they need is a
                periodic light cleaning to make sure dirt, leaves, and other debris aren't obstructing the sun's rays.
                The only time you may need more extensive maintenance is during periods of heavy snowfall, or if your
                panels' energy output starts to decrease.
              </div>
            ),
          },
          {
            label: "What if something goes wrong?",
            renderAnswer: () => (
              <div className="py-8 px-4 text-xl">
                In the event that something does go wrong, your solar PV system components have very long warranties
                that would cover replacement of parts. If you lease your solar panel system, repairs and maintenance are
                the leasing company’s responsibility, not yours. You can reach out to your installer at anytime for
                guidance and help on what steps to take.
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
