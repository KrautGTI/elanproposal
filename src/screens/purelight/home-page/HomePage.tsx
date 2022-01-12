import React from "react";
import { useSelector } from "react-redux";

import { faFacebookF, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ImgNextGen from "../../../components/ImgNextGen";
import { getCompanyInfo, getCustomer, getOfficeInfo, getSalesRep } from "../../../lib/selectors";

import type { DeckScreen } from "../../../types";
import EmptyLayout from "../../../components/layouts/EmptyLayout";

interface HomePageProps {
  heading?: string | undefined;
  subheading?: string | undefined;
  startButtonText?: string | undefined;
  videoUrl?: string | undefined;
}

const purelightUrl = "https://purelightpower.com/";
const fbUrl = "https://www.facebook.com/purelightpower/";
const instaUrl = "https://www.instagram.com/purelightpower/";
const youTubeUrl = "https://www.youtube.com/channel/UCl49t9aOw57zhxm8TPq8frQ/";

const Home: DeckScreen<HomePageProps> = ({ id }) => {
  const customer = useSelector(getCustomer);
  const agent = useSelector(getSalesRep);
  const company = useSelector(getCompanyInfo);
  const office = useSelector(getOfficeInfo);

  const companyInfo = office ?? company;

  let gridCount = [customer, agent, company].filter(v => !!v).length;

  return (
    <EmptyLayout>
      <div className="h-full w-full flex flex-wrap">
        <div className="flex justify-center flex-wrap mb-14">
          <h1 className="text-white w-full text-center font-thin text-6xl sm:text-4xl mb-16 md:mb-24 mt-16">
            Welcome to
          </h1>
          <div className="w-7/12 sm:w-1/3 md:w-1/3">
            <ImgNextGen srcWebp="/proposals/purelight/logo.webp" fallback="/proposals/purelight/logo.png" />
          </div>
        </div>
        <div style={{ bottom: 23, width: "100%" }} className="text-white text-3xl py-5 rounded-lg">
          <div className={`grid grid-cols-${gridCount} gap-4 px-16`}>
            {!!companyInfo && (
              <div className="text-left leading-snug flex flex-col justify-between">
                <div>
                  <span>
                    {companyInfo.state}, {companyInfo.country}
                  </span>
                  <a target="_blank" rel="noreferrer" href={purelightUrl}>
                    <p>www.purelightpower.com</p>
                  </a>
                  <p>
                    <a href={`tel:${companyInfo.phone.e164}`}>{companyInfo.phone.national}</a>{" "}
                  </p>
                </div>
                <div>
                  <a target="_blank" rel="noreferrer" href={youTubeUrl}>
                    <FontAwesomeIcon className="text-white mr-8 align-bottom" size="2x" icon={faYoutube} />
                  </a>
                  <a target="_blank" rel="noreferrer" href={fbUrl}>
                    <FontAwesomeIcon className="text-white mr-8" size="2x" icon={faFacebookF} />
                  </a>
                  <a target="_blank" rel="noreferrer" href={instaUrl}>
                    <FontAwesomeIcon className="text-white" size="2x" icon={faInstagram} />
                  </a>
                </div>
              </div>
            )}
            {!!customer && (
              <div className="text-left leading-snug">
                <span>Prepared For:</span>
                <p className="font-bold">
                  {customer.firstName} {customer.lastName}
                </p>
                {customer.address && (
                  <p>
                    {`${customer.address.line1 ?? ""}`} <br />
                    {`${customer.address.city ?? ""}, ${customer.address.state ?? ""} ${
                      customer.address.postalCode ?? ""
                    }`}
                  </p>
                )}
                {customer.phone && (
                  <p>
                    <a href={`tel:${customer.phone.e164}`}>{customer.phone.national}</a>{" "}
                  </p>
                )}
                {customer.email && <p>{customer.email}</p>}
              </div>
            )}
            {!!agent && (
              <div className="text-left leading-snug">
                <span>Prepared By:</span>
                <p className="font-bold">
                  {agent.firstName} {agent.lastName}
                </p>
                {!!agent.phone && (
                  <p>
                    <a href={`tel:${agent.phone.e164}`}>{agent.phone.national}</a>{" "}
                  </p>
                )}
                <p>{agent.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </EmptyLayout>
  );
};

export default Home;
