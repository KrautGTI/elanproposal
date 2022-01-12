import dynamic from "next/dynamic";
import React from "react";
import styled from "styled-components";

import { ReactComponent as MoonOff } from "./svg/MoonOff.svg";
import { ReactComponent as MoonOn } from "./svg/MoonOn.svg";
import { ReactComponent as SunOff } from "./svg/SunOff.svg";
import { ReactComponent as SunOn } from "./svg/SunOn.svg";

import type { DeckScreen } from "../../types";
import useToggle from "@react-hook/toggle";
import { useRevealDataProps } from "../../hooks/useRevealDataProps";
import TitleLayout from "../../components/layouts/TitleLayout";

const BackgroundImage = dynamic(() => import("./BackgroundImage"), { ssr: false });

interface SolarPowerProps {
  forceSelect?: "day" | "night";
}

const SolarPower: DeckScreen<SolarPowerProps> = ({ id, forceSelect }) => {
  const [timeOfDay, toggleTimeOfDay] = useToggle<"day", "night">("day", "night", forceSelect || "day");
  const isDaytime = timeOfDay === "day";

  const bgColor = isDaytime ? "#f1f4f8" : "#262d34";

  useRevealDataProps(id, {
    backgroundColor: bgColor,
    colorMode: isDaytime ? "light" : "dark"
  });

  return (
    <TitleLayout title="Solar Power" className={isDaytime ? "daytime" : "nighttime"} titleClassName={!isDaytime ? "text-white" : undefined}>
      <Wrapper className="relative">
        {isDaytime ? (
          <>
            <div className="font-bold text-2xl mb-3 white-when-dark">
              During the day you produce more power than you consume.
            </div>
            <div className="text-gray-500 text-lg">
              We do this on purpose. Your utility bill will track all the excess energy so that you can “bank” it for
              nighttime usage. Over the entire month, you’ll produce energy credits in the daytime and they will show up
              on your electric bill as you remain connected.
            </div>
          </>
        ) : (
          <>
            <div className="font-bold text-2xl mb-3 white-when-dark">
              During the night you’ll consume more power than you produce.
            </div>
            <div className="text-gray-500 text-lg">
              Since solar doesn’t produce at night. Your utility will provide your home with energy from the accumulated
              credits from the day. Over the entire month, you’ll pull from the “banked” energy credits in the
              nighttime. The utility will track all the energy consumed so that you’re left with a “net” usage amount at
              the end of each month.
            </div>
          </>
        )}
        <ToggleButtons isDaytime={isDaytime} toggle={forceSelect ? undefined : toggleTimeOfDay} />
      </Wrapper>
      <BackgroundImage daytime={isDaytime} />
    </TitleLayout>
  );
};

export default SolarPower;

const Wrapper = styled.div`
  width: 896px;

  .nighttime & {
    .white-when-dark {
      color: #fff;
    }
  }
`;

function ToggleButtons({ isDaytime, toggle }) {
  const SunComponent = isDaytime ? SunOn : SunOff;
  const MoonComponent = isDaytime ? MoonOff : MoonOn;

  return (
    <>
      <button
        type="button"
        className="absolute rounded-full flex justify-center items-center focus:ring-white"
        style={{ left: 1104, top: 0, height: 84, width: 84 }}
        onClick={toggle}
        data-cy="sun-btn"
      >
        <SunComponent />
      </button>
      <button
        type="button"
        className="absolute rounded-full flex justify-center items-center focus:ring-white"
        style={{ left: 1228, top: 5, height: 64, width: 64 }}
        onClick={toggle}
        data-cy="moon-btn"
      >
        <MoonComponent />
      </button>
    </>
  );
}
