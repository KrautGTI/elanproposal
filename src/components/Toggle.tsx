import clsx from "clsx";

import { Switch } from "@headlessui/react";

export default function Toggle({ enabled, toggle }) {
  return (
    <Switch
      checked={enabled}
      onChange={toggle}
      className={clsx(
        enabled ? "bg-gray-400" : "bg-white",
        "relative inline-flex flex-shrink-0 h-10 w-60 p-1 border-transparent rounded-full shadow-md cursor-pointer transition-colors ease-in-out duration-200"
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          enabled ? "bg-white translate-x-full" : "bg-blue-400 translate-x-0",
          "pointer-events-none inline-block h-8 w-1/2 rounded-full shadow transform ring-0 transition ease-in-out duration-500"
        )}
      />
    </Switch>
  );
}
