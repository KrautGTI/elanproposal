import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import { forwardRef } from "react";
import { AppNotification } from "./types";

interface NotificationProps extends Pick<AppNotification, "title" | "body" | "icon"> {
  onHide: () => void;
}

const Notification = forwardRef<HTMLDivElement, NotificationProps>(({ title, body, icon, onHide }, ref) => {
  return (
    <div
      ref={ref}
      className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start">
          {!!icon && (
            <div className="flex-shrink-0">
              <AlertIcon type={icon} />
            </div>
          )}
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <p className="mt-1 text-sm text-gray-500">{body}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
              onClick={() => {
                onHide();
              }}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Notification;

function AlertIcon({ type }) {
  if (type === "success") {
    return <CheckCircleIcon className="h-6 w-6 text-green-500" aria-hidden="true" />;
  } else if (type === "warning") {
    return <ExclamationCircleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />;
  }

  return null;
}
