import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import React, { FC } from "react";
import { XIcon } from "@heroicons/react/solid";
import ZoomDialog from "../../../ZoomDialog";
import { useDispatch, useSelector } from "react-redux";
import { toggleViewOption, AuroraViewOptionKey } from "../../../../features/aurora";
import { GlobalDialogProps } from "../../../../features/dialogs";

const AuroraViewOptionsModal: FC<GlobalDialogProps> = ({ open, onClose, afterLeave }) => {
  const dispatch = useDispatch();
  const { viewOptions } = useSelector(state => state.aurora);
  const toggle = (key: AuroraViewOptionKey) => {
    dispatch(toggleViewOption(key));
  };

  return (
    <ZoomDialog open={open} onClose={onClose} afterLeave={afterLeave}>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mt-6 mx-4 text-center sm:mt-0 sm:text-left">
            <div className="justify-between flex">
              <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                All View Options
              </Dialog.Title>
              <button type="button" onClick={onClose} data-cy="close-btn">
                <XIcon className="h-8 w-8 text-gray-800 text-opacity-90" />
              </button>
            </div>
            <div className="mt-2">
              {allViewOptions.map(item => (
                <ViewToggleCheckBox
                  key={item.key}
                  label={item.label}
                  viewToggles={viewOptions}
                  toggleKey={item.key}
                  toggle={toggle}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </ZoomDialog>
  );
};

function ViewToggleCheckBox({ toggleKey, label, viewToggles, toggle }) {
  const active = viewToggles[toggleKey];
  return (
    <div className="flex items-start my-4 cursor-pointer">
      <input
        checked={active}
        type="checkbox"
        id={toggleKey}
        style={{ marginTop: "0.375rem" }}
        className={clsx("h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer")}
        onChange={() => toggle(toggleKey)}
      />
      <label htmlFor={toggleKey} className="ml-2 block text-lg text-gray-600 cursor-pointer select-none">
        {label}
      </label>
    </div>
  );
}

const allViewOptions = [
  { key: "azimuthArrows", label: "Show azimuth arrows that indicate which way roof faces slope" },
  { key: "buildings", label: "Show buildings" },
  {
    key: "connections",
    label: "Show electrical connection objects (e.g. wiring from panels to an inverter); visible in top down view only",
  },
  { key: "designComponents", label: "Show design components such as solar panels" },
  { key: "edges", label: "Show roof edges" },
  {
    key: "electricalComponents",
    label: "Show electrical components (e.g. inverters); visible in top down view only",
  },
  { key: "ground", label: "Show ground" },
  { key: "irradianceMap", label: "Show a roof irradiance map that has been run" },
  { key: "irradianceMapPanels", label: "Show a panel irradiance map that has been run" },
  { key: "lidar", label: "Show lidar layer" },
  { key: "mapImagery", label: "Show base layer map imagery" },
  { key: "measurements", label: "Show measurements" },
  { key: "projectCenter", label: "Show project center marking geographic coordinates for the design" },
  { key: "rulers", label: "Show rulers added to a design" },
  { key: "setbacks", label: "Show setbacks" },
  { key: "shadows", label: "Show shadows" },
  { key: "sky", label: "Show sky" },
  { key: "solarPanels", label: "Show solar panels" },
  { key: "strings", label: "Show strings; visible in top down view only" },
  { key: "trees", label: "Show trees" },

  // This is handled by another button
  // { key: "sunpath", label: "Show and start sunpath animation or hide" },
];

export default AuroraViewOptionsModal;
