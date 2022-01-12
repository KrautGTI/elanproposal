import { ReactComponent as DayAnimation } from "./svg/energyDayAnimation.svg";
import DayBackground from "./svg/energyDayBackground.png";
import { ReactComponent as NightAnimation } from "./svg/energyNightAnimation.svg";
import NightBackground from "./svg/energyNightBackground.png";

export default function BackgroundImage({ daytime }: { daytime: boolean }) {
  const bgImg = daytime ? DayBackground : NightBackground;
  const AnimationComponent = daytime ? DayAnimation : NightAnimation;

  return (
    <>
      <div className="absolute bottom-0 right-0">
        <img alt="" src={bgImg} width="1366" height="750" />
      </div>
      <div className="absolute bottom-0 right-0">
        <AnimationComponent width="1366" height="750" />
      </div>
    </>
  );
}
