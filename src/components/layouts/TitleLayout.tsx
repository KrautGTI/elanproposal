import clsx from "clsx";
import { FC, memo, ReactNode } from "react";
import styled from "styled-components";

interface TitleLayoutProps {
  className?: string;
  title: string;
  subtitle?: string;
  titleClassName?: string;
  rightSideElement?: ReactNode;
}

const TitleLayout: FC<TitleLayoutProps> = memo(function TitleLayout(props) {
  const { children, className, title, subtitle, titleClassName, rightSideElement } = props;

  return (
    <LayoutDiv className={clsx("text-left flex flex-col", className)}>
      <div className="flex justify-between">
        <div>
          <h1 className={clsx("text-7xl font-bold", subtitle ? "mb-4" : "mb-8", titleClassName)}>{title}</h1>
          {!!subtitle && <p className="text-3xl mb-6 text-gray-500">{subtitle}</p>}
        </div>
        {rightSideElement}
      </div>
      <div className="flex-grow relative">
        <div className="absolute inset-0">{children}</div>
      </div>
    </LayoutDiv>
  );
});

export default TitleLayout;

const LayoutDiv = styled.div`
  width: 100%;
  height: 100%;
`;
