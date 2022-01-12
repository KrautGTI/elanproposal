import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { faChevronRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button } from "../../components/Button";
import EmptyLayout from "../../components/layouts/EmptyLayout";
import { gotoNext } from "../../features/deck";
import { getCustomer, getSalesRep } from "../../lib/selectors";
import { Address } from "../../types";

import type { DeckScreen } from "../../types";

const buildAddressLine = (address?: Address) =>
  address ? `${address.line1 ?? ""} ${address.city ?? ""}, ${address.state ?? ""}` : "";

interface HomePageOptions {
  heading?: string | undefined;
  subheading?: string | undefined;
  startButtonText?: string | undefined;
  videoUrl?: string | undefined;
}

const Home: DeckScreen<HomePageOptions> = ({ heading, subheading, startButtonText }) => {
  const dispatch = useDispatch();

  const customer = useSelector(getCustomer);
  const agent = useSelector(getSalesRep);

  return (
    <EmptyLayout className="h-full w-full flex items-center">
      <div className="text-left ml-32">
        <h1 className="text-white font-bold text-8xl mb-3">{heading}</h1>
        <h2 className="text-white text-4xl mb-8">{subheading}</h2>
        <div>
          <Button id="get-started-btn" color="primary" size="2xl" onClick={() => dispatch(gotoNext())}>
            {startButtonText || "Get Started"}
            <FontAwesomeIcon className="ml-24" icon={faChevronRight} />
          </Button>
        </div>
      </div>
      <div
        style={{ bottom: 23, left: "20%", width: "60%" }}
        className="absolute bg-black text-white text-base px-6 py-5 rounded-lg bg-opacity-50"
      >
        <div className="flex justify-between">
          {!!customer && (
            <div className="text-left font-bold pr-12">
              <span className="text-white">Created For:</span>
              <div className="text-primary">
                {customer.firstName} {customer.lastName}
                <br />
                {buildAddressLine(customer.address)}
              </div>
            </div>
          )}
          {!!agent && (
            <div className="text-left font-bold pr-12">
              <span className="text-white">Created By:</span>
              <div className="text-primary">
                {agent.firstName} {agent.lastName}
                <br />
                {!!agent.phone && (
                  <>
                    <a href={`tel:${agent.phone.e164}`}>{agent.phone.national}</a>{" "}
                    <span className="text-xs">&#8226;</span>{" "}
                  </>
                )}
                {agent.email}
              </div>
            </div>
          )}
        </div>
      </div>
    </EmptyLayout>
  );
};

export default Home;
