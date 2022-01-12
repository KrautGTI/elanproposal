import clsx from "clsx";
import kebabCase from "lodash/kebabCase";
import { FC, Fragment, HTMLProps, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import ImgNextGen from "../../components/ImgNextGen";
import TitleLayout from "../../components/layouts/TitleLayout";
import { gotoNext } from "../../features/deck";
import { ExplainModal, StepDef } from "./ExplainModal";
import ConfirmDesignJpg from "./images/confirmDesign.jpg";
import ConfirmDesignWebp from "./images/confirmDesign.webp";
import InstallJpg from "./images/install.jpg";
import InstallWebp from "./images/install.webp";
import PermittingJpg from "./images/permitting.jpg";
import PermittingWebp from "./images/permitting.webp";
import PtoJpg from "./images/pto.jpg";
import PtoWebp from "./images/pto.webp";
import SiteSurveyJpg from "./images/siteSurvey.jpg";
import SiteSurveyWebp from "./images/siteSurvey.webp";
import SolarAgreementJpg from "./images/solarAgreement.jpg";
import SolarAgreementWebp from "./images/solarAgreement.webp";

import type { DeckScreen } from "../../types";

const stepDefs: StepDef[] = [
  {
    title: "Review Agreement",
    image: { webp: SolarAgreementWebp, jpg: SolarAgreementJpg },
    body: (
      <Fragment>
        The paperwork required to Go Solar is relatively straightforward. You’ll sign an install agreement with the
        installer, a lease or loan agreement with the finance company (unless purchasing cash) and utility
        interconnection documents, if required.
        <br />
        <br />
        We generate all the necessary documents for you which are then digitally signed for convenience. You’ll receive
        a copy of any signed documents in your email and customer portal.
      </Fragment>
    ),
  },
  {
    title: "Site Survey",
    image: { webp: SiteSurveyWebp, jpg: SiteSurveyJpg },
    body: (
      <Fragment>
        We’ll send someone to your home who will check to ensure your roof is in good condition and there are no
        obstructions which could make installing your system unsafe or difficult. They will also take final measurements
        and pictures to ensure the solar panels are installed efficiently and correctly. Typically, it does not require
        you to be home, as long as they can access your yard.
      </Fragment>
    ),
  },
  {
    title: "Confirm Design",
    image: { webp: ConfirmDesignWebp, jpg: ConfirmDesignJpg },
    body: (
      <Fragment>
        After the site survey a designer will convert your design into a CAD drawing to finalize panel placement and
        electrical requirements. We’ll send this for your review to ensure that we are all moving in the right
        direction.
      </Fragment>
    ),
  },
  {
    title: "Permitting",
    image: { webp: PermittingWebp, jpg: PermittingJpg },
    body: (
      <Fragment>
        The installers permitting team will ensure that all paperwork and permits for your local utility, city and
        jurisdiction are filled out and submitted properly. While there is anything you need to do, please be patient as
        this process can take a few weeks depending on how backed up the city or utility is.
      </Fragment>
    ),
  },
  {
    title: "Install",
    image: { webp: InstallWebp, jpg: InstallJpg },
    body: (
      <Fragment>
        After your permits are received back, you’ll receive an installation day. On that day a crew of expert solar
        installers will get solar on your roof between 4-8 hours, depending on the size of the system. They will also
        show you how to turn your system on and off.
      </Fragment>
    ),
  },
  {
    title: "PTO",
    image: { webp: PtoWebp, jpg: PtoJpg },
    body: (
      <Fragment>
        The utility needs to give you “Permission to Operate” or PTO. Once this happens, you’ll be notified that it’s ok
        to turn on your system. Once turned on you will immediately begin producing solar electricity and generating
        savings.
      </Fragment>
    ),
  },
];

interface NextStepsProps {
  heading?: string | undefined;
}

const NextSteps: DeckScreen<NextStepsProps> = ({ heading, isActive }) => {
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    if (!isActive && isModalOpen) {
      handleCloseModal();
    }
  }, [isActive, isModalOpen, handleCloseModal]);

  const steps = useMemo(() => {
    return stepDefs.map((step, index) => ({
      ...step,
      onClick: () => {
        setActiveIndex(index);
        setIsModalOpen(true);
      },
    }));
  }, []);

  const openByModalByIndex = (index: number) => {
    setActiveIndex(index);
    setIsModalOpen(true);
  };

  const goNext = useCallback(() => {
    if (activeIndex === stepDefs.length - 1) {
      setIsModalOpen(false);
      dispatch(gotoNext());
    } else {
      setActiveIndex(activeIndex + 1);
    }
  }, [dispatch, activeIndex]);

  return (
    <TitleLayout title={heading ?? "Next Steps"}>
      <div className="mx-10">
        <div className="flex mt-10 mb-20">
          <StepImage {...steps[0]} />
          <StepImage {...steps[2]} style={{ marginLeft: 130 }} />
          <StepImage {...steps[4]} style={{ marginLeft: 110 }} />
        </div>
        <div className="relative">
          <div className="absolute top-0 left-0">
            <span className="font-bold">Start</span>
          </div>
          <div className="absolute inset-0 h-full flex items-center">
            <div className="h-5 w-5 border-4 border-secondary-light rounded-full" />
            <div className="w-full bg-secondary-light" style={{ height: 2 }} />
            <div className="h-5 w-5 border-4 border-secondary-light rounded-full" />
          </div>
          <div className="absolute top-0 right-0">
            <span className="font-bold">Finish</span>
          </div>
          <div className="flex mb-20">
            <StepNumber num={1} style={{ marginLeft: 108 }} lineUp onClick={() => openByModalByIndex(0)} />
            <StepNumber num={2} style={{ marginLeft: 150 }} onClick={() => openByModalByIndex(1)} />
            <StepNumber num={3} style={{ marginLeft: 130 }} lineUp onClick={() => openByModalByIndex(2)} />
            <StepNumber num={4} style={{ marginLeft: 130 }} onClick={() => openByModalByIndex(3)} />
            <StepNumber num={5} style={{ marginLeft: 130 }} lineUp onClick={() => openByModalByIndex(4)} />
            <StepNumber num={6} style={{ marginLeft: 130 }} onClick={() => openByModalByIndex(5)} />
          </div>
        </div>
        <div className="flex justify-end">
          <StepImage {...steps[1]} />
          <StepImage {...steps[3]} style={{ marginLeft: 110 }} />
          <StepImage {...steps[5]} style={{ marginLeft: 108 }} />
        </div>
      </div>
      <ExplainModal
        open={isModalOpen}
        onClose={handleCloseModal}
        stepNum={activeIndex + 1}
        goNext={goNext}
        {...steps[activeIndex]}
      />
    </TitleLayout>
  );
};

export default NextSteps;

const StepImage: FC<StepDef & HTMLProps<HTMLButtonElement>> = ({ title, image, onClick, ...props }) => {
  return (
    <button
      {...props}
      type="button"
      onClick={onClick}
      className="relative block text-left bg-gray-800 rounded-2xl shadow-xl overflow-hidden focus:outline-none focus:ring focus:ring-secondary-light"
      style={{ ...props.style, width: 280, height: 200 }}
      data-cy={`step-btn--${kebabCase(title)}`}
    >
      <div className="absolute inset-0">
        <ImgNextGen className="h-full w-full object-cover" srcWebp={image.webp} fallback={image.jpg} />
      </div>
      <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black to-transparent bg-opacity-80 py-6 pl-4 pr-12">
        <span className="text-white text-3xl font-bold">{title}</span>
      </div>
    </button>
  );
};

const StepNumber: FC<{ num: number; lineUp?: boolean } & HTMLProps<HTMLDivElement>> = ({ num, lineUp, ...props }) => {
  return (
    <div {...props} className={clsx("relative h-16 w-16", props.className)}>
      <Line className={clsx("absolute inset-x-1/2", lineUp ? "-top-20" : "-bottom-20")} style={{ zIndex: 1 }} />
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        <div className="h-full w-full rounded-full flex items-center justify-center bg-secondary-light text-white text-3xl font-bold">
          {num}
        </div>
      </div>
    </div>
  );
};

const Line: FC<HTMLProps<HTMLDivElement>> = props => {
  return (
    <div {...props} className={clsx("bg-gray-500", props.className)} style={{ ...props.style, height: 95, width: 2 }} />
  );
};
