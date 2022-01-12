import endsWith from "lodash/endsWith";
import { useSelector } from "react-redux";

/* This example requires Tailwind CSS v2.0+ */
import { PrinterIcon } from "@heroicons/react/solid";

import { getSlideshowUrl } from "../lib/selectors";

export default function PrintableViewAlert() {
  const slideshowUrl = useSelector(getSlideshowUrl);

  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Use history to navigate back if we came from regular slideshow
    if (document.referrer && endsWith(document.referrer, slideshowUrl)) {
      e.preventDefault();
      window.history.back();
    }
  };

  const handleClick = () => {
    window.print();
  };

  return (
    <div className="fixed top-0 left-0 right-0 rounded-md bg-blue-50 mb-4 print:hidden z-notification">
      <div className="flex">
        <div className="flex-shrink-0 p-4">
          <PrinterIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
        </div>
        <div className="flex-1 flex justify-between">
          <p className="py-4 text-sm text-blue-700">This view is optimized for print.</p>
          <p className="text-sm xl:mt-0 xl:ml-6">
            <a
              href={slideshowUrl}
              className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600 py-4"
              onClick={handleBackClick}
            >
              <span aria-hidden="true">&larr;</span> Back to slideshow
            </a>
            <button
              className="whitespace-nowrap font-bold text-blue-700 hover:text-blue-600 py-4 px-8 ml-6 rounded-tr-md rounded-br-md"
              onClick={handleClick}
            >
              Print
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
