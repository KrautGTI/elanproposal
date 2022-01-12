import clsx from "clsx";

import Fade from "../../../Fade";

const TransparentBoxLock = ({ show }: { show: boolean }) => {
  return (
    <Fade show={show}>
      <div
        className={clsx("absolute inset-0 bg-white bg-opacity-70", !show && "pointer-events-none")}
        style={{ zIndex: 10 }}
      />
    </Fade>
  );
};

export default TransparentBoxLock;
