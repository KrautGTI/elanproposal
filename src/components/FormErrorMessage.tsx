import React, { FC } from "react";

import { ExclamationIcon } from "@heroicons/react/solid";

interface Props {
  title?: string;
  body: string;
}

const FormErrorMessage: FC<Props> = ({ title, body }) => {
  return (
    <div className="rounded-md bg-red-100 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationIcon className="h-5 w-5 text-error" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm text-error font-bold">{title}</h3>
          <div className="mt-2 text-sm text-red-900">
            <p>{body}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormErrorMessage;
