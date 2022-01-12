import { faTimes, faSync, faCheckCircle, faExclamationCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuroraDesign, changeDesign } from "../../../../features/aurora";
import {
  getAuroraDesignPortalUrl,
  getAuroraReadyDesigns,
  getRedesignUrl,
  getRepDoesAuroraDesigns,
  getUseAuroraSdk,
} from "../../../../lib/selectors";
import ZoomDialog from "../../../ZoomDialog";
import { Transition } from "@headlessui/react";
import { GlobalDialogProps } from "../../../../features/dialogs";
import InputErrorText from "../../../InputErrorText";
import { formatKw } from "../../../../lib/utils";

const SelectAuroraDesignModal: FC<GlobalDialogProps> = ({ open, onClose, afterLeave }) => {
  const { loadingDesigns, changingDesign, syncErrors } = useSelector(state => state.aurora);
  const readyDesigns = useSelector(getAuroraReadyDesigns);
  const useSdk = useSelector(getUseAuroraSdk);
  const repDoesAuroraDesigns = useSelector(getRepDoesAuroraDesigns);
  const auroraDesignPortalUrl = useSelector(getAuroraDesignPortalUrl);
  const redesignUrl = useSelector(getRedesignUrl);

  return (
    <ZoomDialog open={open} afterLeave={afterLeave} onClose={onClose} data-cy={`update-aurora-design-modal`}>
      <div className="flex flex-col p-4 transition-height">
        <div className="text-2xl px-2 pb-4 border-b border-gray-300 flex justify-between items-center">
          <div>Aurora Designs</div>
          <button type="button" onClick={onClose} data-cy="close-btn" className="px-2 rounded">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="relative">
          <Transition appear show={changingDesign || loadingDesigns} as={Fragment}>
            <div className="pb-10 pt-4 absolute w-full h-full z-30 bg-white flex items-center justify-center">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="flex justify-center items-center align-center flex-col">
                  <p className="text-gray-800 mb-4 text-lg">Updating Proposal</p>
                  <div>
                    <FontAwesomeIcon className="text-primary-dark text-center mr-auto" size="2x" icon={faSync} spin />
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Transition>
          <div>
            <div className="mb-4 text-gray-700 mt-4 leading-6">
              {useSdk ? (
                <span>Select an Aurora design to use for this proposal.</span>
              ) : (
                <span>To update the proposal, modify the design in Aurora then select or re-sync it here.</span>
              )}
            </div>

            <div className="mb-4 text-gray-700 mt-4 leading-6">
              Only designs that are ready are shown – they must have a rooftop image, panel, inverter, consumption
              profile and performance simulation up to date. To see a detailed status of all designs (including
              not-ready designs) go to the{" "}
              <a className="underline" target="_blank" rel="noreferrer" href={auroraDesignPortalUrl}>
                design status page
              </a>
              .
            </div>

            <div className="pt-4 mx-2">
              {readyDesigns?.map(design => (
                <AuroraDesignItem design={design} key={design.id} />
              ))}
            </div>
          </div>
        </div>
        {!useSdk && !repDoesAuroraDesigns && (
          <div className="mb-8 mt-2 text-lg">
            <h3>Need changes from the designer?</h3>
            <a href={redesignUrl} rel="noreferrer" target="_blank" className="mt-2 text-primary underline">
              Submit Revision Request
            </a>
          </div>
        )}
        {syncErrors && (
          <div className="mb-4">
            <div className="mb-4 text-gray-700 mt-4 leading-5">
              <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500 mr-2" />
              An Error Occurred while Sync'ing the Design
            </div>
            <InputErrorText hasError={true} message={syncErrors} />{" "}
          </div>
        )}
        <button
          onClick={onClose}
          className="btn-gray w-full rounded-md py-3 font-bold text-center cursor-pointer mt-4"
          data-cy="submit-modify-system-cost"
        >
          Close
        </button>
      </div>
    </ZoomDialog>
  );
};

function AuroraDesignItem({ design }: { design: AuroraDesign }) {
  const dispatch = useDispatch();
  const size = formatKw(design.size);
  const useSdk = useSelector(getUseAuroraSdk);
  const repDoesAuroraDesigns = useSelector(getRepDoesAuroraDesigns);

  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-gray-900">{design.name}</h3>
        <p className="mt-2 text-gray-600 text-sm">
          {size} kW,&nbsp;{design.panel_count} panels
        </p>
        {!useSdk && repDoesAuroraDesigns && (
          <a href={design.aurora_link} rel="noreferrer" target="_blank" className="mt-2 text-primary underline text-sm">
            View in Aurora
          </a>
        )}
      </div>
      {design.use_with_proposal ? (
        <span className="text-gray-700 mr-4">
          Selected <FontAwesomeIcon className="text-savings ml-1" icon={faCheckCircle} />
          {!useSdk && (
            <button
              type="button"
              onClick={() => dispatch(changeDesign(design.id))}
              className="text-sm text-primary ml-2 uppercase font-bold"
            >
              Re-Sync
            </button>
          )}
        </span>
      ) : (
        <button
          onClick={() => dispatch(changeDesign(design.id))}
          type="button"
          className="btn-primary px-2 text-sm rounded-md py-0 h-8 font-bold"
        >
          Use For Proposal
        </button>
      )}
    </div>
  );
}

export default SelectAuroraDesignModal;
