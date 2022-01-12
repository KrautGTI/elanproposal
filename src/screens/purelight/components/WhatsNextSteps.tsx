import clsx from "clsx";
import { FC, ReactNode, SVGProps, useCallback, useState } from "react";

import { faCaretLeft, faCaretRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button } from "../../../components/Button";
import { colors } from "../constants";
import { ReactComponent as DocumentIcon } from "./svgs/document.svg";
import { ReactComponent as DollarIcon } from "./svgs/dollar.svg";
import { ReactComponent as GridIcon } from "./svgs/grid.svg";
import { ReactComponent as HouseCheckIcon } from "./svgs/house-check.svg";
import { ReactComponent as SunIcon } from "./svgs/sun.svg";
import { ReactComponent as ThumbsUpIcon } from "./svgs/thumbs-up.svg";
import { ReactComponent as TruckIcon } from "./svgs/truck.svg";
import styles from "./WhatsNextSteps.module.css";

const allSteps = [
  {
    text: "Site Survey",
    SvgElement: GridIcon,
  },
  {
    text: "Final Design",
    SvgElement: ThumbsUpIcon,
  },
  {
    text: "Permit",
    SvgElement: DocumentIcon,
  },
  {
    text: "Install",
    SvgElement: TruckIcon,
  },
  {
    text: "PTO",
    SvgElement: SunIcon,
  },
  {
    text: "Post-Install Visit",
    SvgElement: HouseCheckIcon,
  },
  {
    text: "First Payment",
    SvgElement: DollarIcon,
  },
];

interface WhatsNextStepsProps {
  mode: "light" | "dark";
}

const WhatsNextSteps = ({ mode }: WhatsNextStepsProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const incStep = useCallback(() => setCurrentStep(prevStep => Math.min(prevStep + 1, 6)), []);
  const decStep = useCallback(() => setCurrentStep(prevStep => Math.max(prevStep - 1, 0)), []);

  const backgroundColor = mode === "dark" ? colors.iconBg : "#ffffff";
  const textColor = mode === "dark" ? "#000000" : "#ffffff";

  return (
    <>
      <div className="flex flex-row-reverse">
        <Button
          style={{ marginLeft: "10px" }}
          className={clsx(styles.navButton, currentStep === 6 && styles.navButtonDisabled)}
          size="lg"
          onClick={incStep}
        >
          <FontAwesomeIcon size="2x" color="#52AFCE" icon={faCaretRight} />
        </Button>
        <Button
          className={clsx(styles.navButton, currentStep === 0 && styles.navButtonDisabled)}
          size="lg"
          onClick={decStep}
        >
          <FontAwesomeIcon size="2x" color="#52AFCE" icon={faCaretLeft} />
        </Button>
      </div>
      <div className="my-12 flex flex-grow justify-center items-center relative">
        <div className="absolute h-1 inset-y-1/2 w-full mt-3 px-10">
          <div className="w-full h-full" style={{ backgroundColor }} />
        </div>
        <ol className="flex w-full justify-between z-10">
          {allSteps.map((step, idx) => (
            <Step
              key={step.text}
              active={currentStep >= idx}
              textColor={textColor}
              backgroundColor={backgroundColor}
              {...step}
            />
          ))}
        </ol>
      </div>
    </>
  );
};

interface WhatsNextStepProps {
  active?: boolean;
  text: ReactNode;
  SvgElement: FC<SVGProps<SVGSVGElement>>;
  textColor?: string;
  backgroundColor: string;
}

const Step = ({ text, SvgElement, backgroundColor, textColor, active }: WhatsNextStepProps) => {
  return (
    <li style={{ visibility: active ? "visible" : "hidden" }} className={styles.stepBubble}>
      <span className="pb-4 text-center" style={{ color: textColor ?? "#000000" }}>
        {text}
      </span>
      <div className="w-32 h-32 p-2 rounded-full flex justify-center items-center" style={{ backgroundColor }}>
        <SvgElement className="h-20 w-20" />
      </div>
    </li>
  );
};

export default WhatsNextSteps;
