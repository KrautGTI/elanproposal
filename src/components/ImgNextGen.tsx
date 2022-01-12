import { DetailedHTMLProps, FC, ImgHTMLAttributes } from "react";

interface ImgNextGenProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  srcWebp: string;
  fallback: string;
  alt?: string;
}

const ImgNextGen: FC<ImgNextGenProps> = ({ srcWebp, fallback, alt = "", ...props }) => {
  return (
    <picture>
      <source srcSet={srcWebp} type="image/webp" />
      <source srcSet={fallback} type="image/jpeg" />
      <img src={fallback} alt={alt!} {...props} />
    </picture>
  );
};

export default ImgNextGen;
