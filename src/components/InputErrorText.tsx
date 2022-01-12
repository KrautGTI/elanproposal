import { FC, Fragment } from "react";

interface Props {
  hasError: boolean;
  message?: string;
}

const InputErrorText: FC<Props> = ({ hasError, message }) => {
  return <Fragment>{hasError && <p className="text-red-700 text-sm mt-2 pl-1 mb-3">{message}</p>}</Fragment>;
};

export default InputErrorText;
