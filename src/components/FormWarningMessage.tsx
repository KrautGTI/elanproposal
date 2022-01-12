import React, { FC } from "react";

import { ExclamationIcon } from "@heroicons/react/solid";

interface Props {
  title?: string;
  body: string;
}

const FormErrorMessage: FC<Props> = ({ title, body }) => {
  return (
    <div className="rounded-md bg-yellow-100 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationIcon className="h-5 w-5 text-yellow-600" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm text-yellow-600 font-bold">{title}</h3>
          <div className="mt-2 text-sm text-yellow-900">
            <p>{body}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormErrorMessage;
