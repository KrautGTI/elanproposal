import { ComponentPropsWithoutRef, forwardRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { getSalesCompanyLogo } from "../../../lib/selectors";
import { LogoImage } from "../../LogoImage";

export const LogoPortal = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(({ children, ...props }, ref) => {
  const logo = useSelector(getSalesCompanyLogo);
  const mode = useSelector(state => state.deck.colorMode);
  const logoPosition = useSelector(state => state.deck.logoPosition);

  if (!logo || logoPosition === "none") return <div ref={ref} />;

  return (
    <LogoWrapper
      ref={ref}
      {...props}
      className="logo-portal hidden sm:flex justify-start items-center max-w-xs"
      data-mode={mode ?? "light"}
      data-logo-layout={logoPosition ?? "top-left"}
    >
      <LogoImage mode={mode} logo={logo} alt="Company logo" />
    </LogoWrapper>
  );
});

const imgHeight = 35;
const paddingY = 2.5;

const LogoWrapper = styled.div`
  z-index: 2;
  position: absolute;
  top: 1rem;
  left: 2rem;
  height: ${imgHeight + paddingY * 2}px;
  padding-top: ${paddingY}px;
  padding-bottom: ${paddingY}px;

  img {
    height: ${imgHeight}px;
    width: auto;
  }

  &[data-logo-layout="top-right"] {
    top: 1rem;
    right: 2rem;
    left: auto;
  }
`;
