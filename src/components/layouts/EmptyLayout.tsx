import React, { FC, memo } from "react";
import styled from "styled-components";

interface EmptyLayoutProps {
  className?: string;
}

const EmptyLayout: FC<EmptyLayoutProps> = memo(function EmptyLayout(props) {
  const { children, className } = props;

  return <LayoutDiv className={className}>{children}</LayoutDiv>;
});

export default EmptyLayout;

const LayoutDiv = styled.div`
  width: 100%;
  height: 100%;
`;
