import React, { FC } from "react";
import { useSelector } from "react-redux";

import { CollapseableFAQs } from "../CollapseableFAQs";
import { WarrantyIcon } from "../svg/Warranty";
import { getFaq } from "../../../lib/selectors";

export const WarrantyBreakdown: FC<{ expandAll: boolean }> = ({ expandAll }) => {
  const faq = useSelector(getFaq);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex mb-10">
        <div className="pr-6">
          <WarrantyIcon />
        </div>
        <div className="flex-grow">
          <div className="mb-4">
            <span className="font-bold text-5xl">Warranty</span>
          </div>
          <div style={{ width: 470 }}></div>
        </div>
      </div>
      <CollapseableFAQs
        expandAll={expandAll}
        faqs={[
          {
            label: "What if my system stops producing like it should?",
            renderAnswer: () => (
              <div className="py-8 px-4 text-xl">
                {faq?.warrantySystem ||
                  "We handle everything. We monitor and fix everything from day 1 through 25 years."}
              </div>
            ),
          },
          {
            label: "What happens to my roof?",
            renderAnswer: () => (
              <div className="py-8 px-4 text-xl">
                Nothing should happen, but we will fix your roof if there is any damage caused by the installers. If
                there are any leaks that may occur, let us know, we got you covered.
              </div>
            ),
          },
          {
            label: "What is a UCC-1 Financing Statement and is it a lien on my home?",
            renderAnswer: () => (
              <div className="py-8 px-4 text-xl">
                If financed or leased, the finance or leasing company will secure your solar project through a lien on
                the solar equipment itself by filing a UCC-1, or Uniform Commercial Code Financing Statement, and county
                fixture filing. The filings are not a lien against your home, so they do not hold any formal position in
                your home (first, second, or otherwise). You will, however, find a UCC-1 fixture filing on the title of
                your property. The finance or leasing company file UCC-1 and county fixture filings to protect their
                rights as the financier of the system. If for whatever reason your mortgage on the real property
                forecloses on your home, the UCC-1 filing protects their security interest in the system, while
                preventing your mortgage lender from taking ownership of it.
              </div>
            ),
          },
          {
            label: "What happens to the UCC-1 during a refinance?",
            renderAnswer: () => (
              <div className="py-8 px-4 text-xl">
                You'll contact the solar finance or lending company to ask them to lift the UCC-1 and county fixture
                filing on the Solar Equipment for a limited period provided they will be able to refile upon closing of
                the mortgage refinancing.
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
