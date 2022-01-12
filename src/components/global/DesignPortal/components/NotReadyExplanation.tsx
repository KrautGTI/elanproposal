import { FC } from "react";

const NotReadyExplanation: FC = ({ children }) => {
  return (
    <div className="absolute inset-0 bg-gray-600 text-white flex justify-center items-center">
      <div className="text-2xl">{children}</div>
    </div>
  );
};

export default NotReadyExplanation;
