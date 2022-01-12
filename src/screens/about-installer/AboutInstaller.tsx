import React, { FC } from "react";
import { useSelector } from "react-redux";

import ImgNextGen from "../../components/ImgNextGen";
import EmptyLayout from "../../components/layouts/EmptyLayout";
// import styled from "styled-components";
import { LogoImage } from "../../components/LogoImage";
import { getInstallerLogo, getSalesCompanyLogo } from "../../lib/selectors";
import ExampleInstallMapJpg from "./images/ExampleInstallMap.jpg";
import ExampleInstallMapWebp from "./images/ExampleInstallMap.webp";

import type { DeckScreen } from "../../types";

interface AboutInstallerProps {
  reviews: {
    text: string;
    credit: string;
  }[];
}

const AboutInstaller: DeckScreen<AboutInstallerProps> = ({ reviews }) => {
  const logo = useSelector(getSalesCompanyLogo);
  const installerLogo = useSelector(getInstallerLogo);

  return (
    <EmptyLayout>
      <div className="w-full h-full flex">
        <div
          className="flex-shrink-0 flex flex-col bg-blue-gray-900 bg-opacity-90 text-white relative"
          style={{ width: 472 }}
        >
          <div className="px-14">
            <div className="mb-8">
              <LogoImage
                className="mx-auto"
                height={75}
                logo={installerLogo ?? logo}
                mode="light"
                alt="Installer logo"
              />
            </div>
            <div className="text-3xl font-bold mb-4">We believe clean energy should be accessible</div>
            <div className="font-bold leading-5">
              Cras quis nulla commodo, aliquam lectus sed, blandit augue. Cras ullamcorper bibendum bibendum.
            </div>
          </div>
          <div className="flex-grow flex flex-col justify-evenly items-center">
            <InstallerStat value="72,000" label="Installations" />
            <InstallerStat value="$980,000" label="Saved" />
            <InstallerStat value="24/7" label="Support" />
          </div>
        </div>
        <div className="px-6 flex-grow">
          <div className="w-96 mb-8">
            <div className="font-bold text-3xl mb-4">Our work near you</div>
            <div className="text-gray-500 leading-5">
              Cras quis nulla commodo, aliquam lectus sed, blandit augue. Cras ullamcorper bibendum bibendum.{" "}
            </div>
          </div>
          <div>
            <ImgNextGen
              srcWebp={ExampleInstallMapWebp}
              fallback={ExampleInstallMapJpg}
              className="rounded-lg shadow-lg"
              alt="Map of installs"
              width="834px"
              height="470px"
            />
          </div>
          {!!reviews && (
            <div className="mt-8">
              <div className="font-bold text-3xl mb-6">What people are saying</div>
              <div className="grid grid-cols-2 gap-6">
                {reviews.map((review, i) => (
                  <CustomerReview key={i} text={review.text} citation={review.credit} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </EmptyLayout>
  );
};

export default AboutInstaller;

const InstallerStat: FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <div className="font-bold text-5xl text-white mb-2">{value}</div>
    <div className="font-bold text-3xl text-gray-300">{label}</div>
  </div>
);

const CustomerReview: FC<{ text: string; citation: string }> = ({ text, citation }) => (
  <div className="bg-white rounded-md shadow-md px-6 py-4">
    <div className="font-bold text-2xl leading-7 mb-3">“{text}”</div>
    <div className="text-gray-500">- {citation}</div>
  </div>
);
