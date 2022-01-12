import clsx from "clsx";
import numeral from "numeral";
import React from "react";
import { useSelector } from "react-redux";

import { faCheck as faCheckLight, faCircle as faCircleLight } from "@fortawesome/pro-light-svg-icons";
import { faSolarPanel } from "@fortawesome/pro-regular-svg-icons";
import { faCheck, faCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import TitleLayout from "../../components/layouts/TitleLayout";
import { getProposalsToCompare, getReportHash } from "../../lib/selectors";

import type { ComparisonProposal, DeckScreen } from "../../types";

interface CompareProposalsProps {
  heading?: string;
  subtitle?: string;
}

const CompareProposals: DeckScreen<CompareProposalsProps> = ({
  heading = "Compare Your Options",
  subtitle = "Select the proposal to use for your contract.",
}) => {
  const proposals = useSelector(getProposalsToCompare);
  const reportHash = useSelector(getReportHash);

  return (
    <TitleLayout title={heading} subtitle={subtitle}>
      <div className="w-full h-full py-6 overflow-auto">
        <div className={clsx("grid grid-flow-col gap-6", proposals.length < 4 && "justify-center")}>
          {proposals.map(proposal => (
            <ProposalComparisonCard key={proposal.id} checked={reportHash === proposal.id} proposal={proposal} />
          ))}
        </div>
      </div>
    </TitleLayout>
  );
};

export default CompareProposals;

function ProposalComparisonCard({ proposal, checked = false }: { proposal: ComparisonProposal; checked?: boolean }) {
  return (
    <div
      className={clsx(
        "flex flex-col rounded-xl shadow-xl overflow-hidden bg-white border-2 w-[415px] h-full",
        checked ? "border-blue-400" : "border-gray-300"
      )}
      data-cy="proposal-comparison"
    >
      <div className="pt-0 h-full flex flex-col min-h-0">
        <div className="px-4 py-4 flex items-center flex-1">
          {checked ? (
            <span className="fa-stack flex-shrink-0" aria-hidden="true">
              <FontAwesomeIcon icon={faCircle} className="fa-stack-2x text-blue-500 drop-shadow-md" />
              <FontAwesomeIcon icon={faCheck} className="fa-stack-1x text-white" />
            </span>
          ) : (
            <span className="fa-stack flex-shrink-0" aria-hidden="true">
              <FontAwesomeIcon icon={faCircleLight} className="fa-stack-2x text-gray-300" />
              <FontAwesomeIcon icon={faCheckLight} className="fa-stack-1x text-gray-600" />
            </span>
          )}
          <h3
            id={`proposal-${proposal.id}`}
            className={clsx(
              "inline-flex px-4 py-1 rounded-full text-xl tracking-wide",
              checked ? "font-semibold" : "font-light text-gray-600"
            )}
          >
            {proposal.name}
          </h3>
        </div>
        <div className="px-6 grid grid-cols-2 bg-gray-100 border-t border-b border-gray-300">
          <div className="px-2 py-4 flex flex-col justify-center items-center border-r border-gray-300">
            <h4 className="inline-flex font-semibold text-xl">
              {numeral(proposal.systemSizeWatts / 1000).format("0,0.00")} kW
            </h4>
            <h4 className="mt-1 inline-flex text-sm text-gray-500">
              {numeral(proposal.solarProductionFirstYear).format("0,0")} kWh first year
            </h4>
          </div>
          <div className="px-2 py-4 flex flex-col justify-center items-center">
            <h4 className="inline-flex font-semibold text-xl">{proposal.panelCount} Panels</h4>
            <h4 className="mt-1 inline-flex text-sm text-gray-500">{proposal.panelName}</h4>
          </div>
        </div>
        <div className="aspect-w-16 aspect-h-9">
          <img alt="roof" src="/proposals/demo-roof-image.png" className="object-cover" />
        </div>
        <div className="py-3 px-4 flex items-center bg-green-500 bg-opacity-10">
          <div className="fa-stack" aria-hidden="true">
            <FontAwesomeIcon icon={faCircleLight} className="fa-stack-2x text-green-500 drop-shadow-lg" />
            <FontAwesomeIcon icon={faSolarPanel} className="fa-stack-1x text-green-500" />
          </div>
          <div className="mx-3">
            <h3
              id={`proposal-${proposal.id}`}
              className="inline-flex items-baseline py-1 rounded-full tracking-wide font-semibold"
            >
              <span className="text-2xl text-green-500">{proposal.solarOffset}%</span>{" "}
              <span className="ml-2 text-sm"> of your power needs</span>
            </h3>
          </div>
        </div>
        <div className="py-4 px-4 flex items-center flex-wrap min-h-[62px]">
          {proposal.lenderLogo ? (
            <img alt={proposal.lenderName} src={proposal.lenderLogo} className="h-5" />
          ) : (
            proposal.lenderName
          )}
          <div className="mx-4">
            <h3 className="flex items-baseline">
              {proposal.termYears ? (
                <>
                  <span className="text-2xl font-bold">
                    ${numeral(proposal.monthlyPayment).format("0,0")}
                    <span className="text-xl font-medium tracking-wide">/mo</span>
                  </span>
                  <span className="ml-2 text-sm font-bold tracking-wide">
                    {proposal.apr}% for {proposal.termYears} years
                  </span>
                </>
              ) : (
                <span className="ml-2 text-sm font-bold tracking-wide">one payment</span>
              )}
            </h3>
          </div>
        </div>
        <div className="px-4 grid grid-cols-2 border-t border-b border-gray-300">
          <div className="px-2 py-4 flex flex-col justify-center items-center border-r border-gray-300">
            <h4 className="inline-flex font-semibold text-xl">{numeral(proposal.netSystemCost).format("$0,0")}</h4>
            <h4 className="mt-1 inline-flex text-sm text-gray-500">
              {numeral(proposal.netPpw).format("$0.00")} / watt
            </h4>
          </div>
          <div className="px-2 py-4 flex flex-col justify-center items-center">
            <h4 className="inline-flex font-semibold text-xl">
              {numeral(proposal.totalEstimatedSavings).format("$0,0")}
            </h4>
            <h4 className="mt-1 inline-flex text-sm text-gray-500 tracking-wide">
              Total {proposal.estimatedSavingsYears}yr savings
            </h4>
          </div>
        </div>
        <div className="px-4 py-3 rounded-md shadow">
          <a
            href={proposal.proposalLink}
            className={clsx(
              "flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-semibold rounded-md text-blue-400 transition-colors hover:text-white hover:bg-blue-500",
              checked && "invisible"
            )}
            aria-describedby={`proposal-${proposal.id}`}
          >
            View Full Proposal
          </a>
        </div>
      </div>
    </div>
  );
}
