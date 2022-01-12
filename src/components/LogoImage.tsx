import { forwardRef, ImgHTMLAttributes } from "react";

import { ColorMode, LogoConfig } from "../types";

interface LogoImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  logo: LogoConfig | undefined;
  mode?: ColorMode;
  width?: number | string;
  height?: number | string;
}

export const LogoImage = forwardRef<HTMLImageElement, LogoImageProps>((props, ref) => {
  const { logo, mode, alt, width, height, ...rest } = props;

  let img = mode === "dark" ? logo?.light : logo?.dark;

  // If we don't have an image that matches the mode, use whichever one we do have
  if (!img) {
    img = logo?.dark ?? logo?.light;
  }

  const { url, width: intrinsicWidth, height: intrinsicHeight } = img ?? {};

  if (!url) return null;

  let style = { width, height };

  if (width && !height) {
    style.height = "auto";
  } else if (height && !width) {
    style.width = "auto";
  }

  return (
    <img
      {...rest}
      style={{
        ...style,
        ...rest.style,
      }}
      ref={ref}
      alt={alt ?? "Logo"}
      src={url}
      width={intrinsicWidth}
      height={intrinsicHeight}
    />
  );
});
