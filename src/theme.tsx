import { parseToRgb } from "polished";
import { RgbaColor } from "polished/lib/types/color";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createGlobalStyle, css, DefaultTheme, ThemeProvider as StyledThemeProvider } from "styled-components";

import { BreakpointKey, colorVariables, defaultColors } from "../styles/theme";
import { EnerfloProposalTemplate } from "./types";

const breakpoints: Record<BreakpointKey, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

const overrideWithCustomColors = (customColors: EnerfloProposalTemplate["colors"]) => {
  const colors = { ...defaultColors };

  if (customColors) {
    Object.keys(customColors).forEach(key => {
      let customColor = customColors[key];

      if (customColor) {
        colors[key] = customColor;
      }
    });
  }

  return colors;
};

export const ThemeProvider = ({ children }) => {
  const template = useSelector(state => state.template.data);

  const theme = useMemo<DefaultTheme>(
    () => ({
      colors: overrideWithCustomColors(template?.colors),
      colorVariables,
      breakpoints: {
        keys: ["sm", "md", "lg", "xl", "2xl"],
        values: breakpoints,
        up: key => `@media (min-width:${breakpoints[key]}px)`,
      },
    }),
    [template?.colors]
  );

  return (
    <StyledThemeProvider theme={theme}>
      {children}
      <GlobalThemeStyles customColors={template?.colors} />
    </StyledThemeProvider>
  );
};

interface GlobalThemeStylesProps {
  customColors?: EnerfloProposalTemplate["colors"];
}

const GlobalThemeStyles = createGlobalStyle<GlobalThemeStylesProps>`
  body {
    ${props => createCssVariableOverrides(props.theme, props.customColors)}
  }
`;

function createCssVariableOverrides(theme: DefaultTheme, customColors: EnerfloProposalTemplate["colors"]) {
  let styles = "";

  if (customColors) {
    Object.keys(theme.colorVariables).forEach(key => {
      let customColor = customColors[key];

      if (customColor) {
        styles += `${theme.colorVariables[key]}: ${transparentize(customColor)};`;
      }
    });
  }

  return css`
    ${styles}
  `;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function transparentize(color: string): string {
  if (color === "transparent") return color;
  const { red: r, green: g, blue: b } = parseToRgb(color) as RgbaColor;
  return `${r}, ${g}, ${b}`;
}
