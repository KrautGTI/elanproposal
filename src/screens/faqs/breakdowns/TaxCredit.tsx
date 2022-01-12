import { FC } from "react";

import { CollapseableFAQs } from "../CollapseableFAQs";
import { TaxCreditIcon } from "../svg/TaxCredit";

export const TaxCreditBreakdown: FC<{ expandAll: boolean }> = ({ expandAll }) => {
  return (
    <div className="w-full h-full">
      <div className="flex mb-10">
        <div className="pr-6">
          <TaxCreditIcon />
        </div>
        <div className="flex-grow">
          <div className="mb-4">
            <span className="font-bold text-5xl">Tax Credit</span>
          </div>
        </div>
      </div>
      <CollapseableFAQs
        expandAll={expandAll}
        faqs={[
          {
            label: "How does the Federal Investment Tax Credit (ITC) work?",
            renderAnswer: () => (
              <div className="py-8 px-4 text-xl">
                The ITC in 2021 is a 26% federal tax credit for solar systems on residential properties. As the owner of
                the solar energy system, you may be eligible to apply the credit as a dollar-for-dollar reduction in the
                federal income taxes that you owe in the year that your solar system was installed. If the ITC granted
                for your solar system is greater than your tax liabilities in the year that you purchased your solar
                energy system, you may be able to apply the remaining ITC in the subsequent year. To determine your
                eligibility for any federal solar investment tax credit, you should make an independent assessment or
                consult with your tax advisor. Some states and/or utilities offer additional credits and rebates above
                the ITC Tax credit.
              </div>
            ),
          },
          {
            label: "How do I qualify?",
            renderAnswer: () => (
              <div className="py-8 px-4 text-xl">
                If you are a wage earner and owe taxes to the federal government, then you may benefit from this credit.
              </div>
            ),
          },
          {
            label: "How much do I qualify for?",
            renderAnswer: () => (
              <div className="py-8 px-4 text-xl">
                You may qualify to receive up to 26% of the value of the system. If you don’t have that in tax
                liability, you can roll it over to subsequent years of taxation to reap the full amount.
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
