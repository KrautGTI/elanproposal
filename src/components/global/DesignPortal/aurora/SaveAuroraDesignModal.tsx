import { faTimes, faSync, faCheckCircle, faCircle, faExclamationCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuroraState, AuroraSaveDesignStatus, saveDesign } from "../../../../features/aurora";
import ZoomDialog from "../../../ZoomDialog";
import { Transition } from "@headlessui/react";
import { GlobalDialogProps } from "../../../../features/dialogs";
import InputErrorText from "../../../InputErrorText";

const SaveAuroraDesignModal: FC<GlobalDialogProps> = ({ open, onClose, afterLeave }) => {
  const dispatch = useDispatch();
  const { saveStatus, syncErrors } = useSelector(state => state.aurora) as AuroraState;

  const saving = saveStatus !== AuroraSaveDesignStatus.IDLE;
  return (
    <ZoomDialog open={open} afterLeave={afterLeave} onClose={onClose} data-cy={`update-aurora-design-modal`}>
      <div className="flex flex-col p-4 transition-height">
        <div className="text-2xl px-2 pb-4 border-b border-gray-300 flex justify-between items-center">
          <div>Save Design</div>
          <button type="button" onClick={onClose} data-cy="close-btn" className="px-2 rounded">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="mb-4 text-gray-700 mt-4 leading-6">
          While saving the design the rooftop image might automatically download to your browser or you might be
          prompted to download it. You can either cancel or accept the download, it will not affect the design or
          proposal.
        </div>
        {saving && (
          <>
            <Transition appear show={open} as={Fragment}>
              <div className="pb-10 pt-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div>
                    <div className="flex justify-between w-3/5 mb-4">
                      <p className="text-gray-700">Running Irradiance</p>
                      {saveStatus === AuroraSaveDesignStatus.RUNNING_IRRADIANCE ? (
                        <FontAwesomeIcon icon={faSync} spin className="ml-2" />
                      ) : (
                        <FontAwesomeIcon icon={faCheckCircle} className="ml-2 text-primary" />
                      )}
                    </div>
                    <div className="flex justify-between w-3/5 mb-4">
                      <p className="text-gray-700">Running Performance Simulation</p>
                      {saveStatus === AuroraSaveDesignStatus.RUNNING_PERFORMANCE ? (
                        <FontAwesomeIcon icon={faSync} spin className="ml-2" />
                      ) : (
                        <>
                          {saveStatus === AuroraSaveDesignStatus.RUNNING_IRRADIANCE ? (
                            <FontAwesomeIcon icon={faCircle} className="ml-2" />
                          ) : (
                            <FontAwesomeIcon icon={faCheckCircle} className="ml-2 text-primary" />
                          )}
                        </>
                      )}
                    </div>
                    <div className="flex justify-between w-3/5">
                      <p className="text-gray-700">Updating Proposal</p>
                      {saveStatus === AuroraSaveDesignStatus.SYNCING_ENERFLO ? (
                        <FontAwesomeIcon icon={faSync} spin className="ml-2" />
                      ) : (
                        <>
                          {saveStatus === AuroraSaveDesignStatus.RUNNING_IRRADIANCE ||
                          saveStatus === AuroraSaveDesignStatus.RUNNING_PERFORMANCE ? (
                            <FontAwesomeIcon icon={faCircle} className="ml-2" />
                          ) : (
                            <FontAwesomeIcon icon={faCheckCircle} className="ml-2 text-primary" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Transition>
          </>
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
        <div className="flex">
          <button
            disabled={saving}
            onClick={onClose}
            className="btn-gray w-full rounded-md py-3 font-bold text-center cursor-pointer mr-4"
            data-cy="submit-modify-system-cost"
          >
            Close
          </button>
          <button
            type="button"
            className="btn-primary w-full rounded-md py-3 font-bold"
            disabled={saving}
            data-cy="submit-modify-system-cost"
            onClick={() => dispatch(saveDesign())}
          >
            Save Design
          </button>
        </div>
      </div>
    </ZoomDialog>
  );
};

export default SaveAuroraDesignModal;
