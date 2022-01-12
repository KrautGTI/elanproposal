import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openDialog } from "../../../../features/dialogs";

import { getIsAuroraDesign, getRepDoesAuroraDesigns, getRoofImageUrl } from "../../../../lib/selectors";
import SdkButton from "../aurora/SdkButton";
import TransparentBoxLock from "./TransparentBoxLock";

interface DesignPortalRooftopImageProps {
  locked: boolean;
}

const DesignPortalRooftopImage: FC<DesignPortalRooftopImageProps> = ({ locked }) => {
  const roofImageUrl = useSelector(getRoofImageUrl);
  const isAuroraDesign = useSelector(getIsAuroraDesign);
  const repDoesAuroraDesigns = useSelector(getRepDoesAuroraDesigns);

  const dispatch = useDispatch();

  return (
    <>
      {roofImageUrl ? (
        <>
          {locked && !isAuroraDesign && (
            <div>
              <TransparentBoxLock show />
              <div className="absolute w-full h-full flex justify-center items-center" style={{ zIndex: 52 }}>
                <div className="bg-cool-gray-700 p-4 bg-opacity-90 mx-2 mt-2 rounded-lg">
                  <p className="text-white md:text-xl">The system is being optimized based on the provided data.</p>
                </div>
              </div>
            </div>
          )}
          {(!isAuroraDesign || !repDoesAuroraDesigns) && (
            <div className="absolute inset-0 flex items-start justify-center p-2 xl:py-4 pointer-events-none">
              <div className="w-full max-w-prose bg-alt-blue bg-opacity-90 p-4 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                <p className="text-white text-center text-sm sm:text-xl">
                  The design below is the initial design to show potential panel placement. The finalized design will be
                  created after project submission.
                </p>
              </div>
            </div>
          )}
          {isAuroraDesign && (
            <div className="absolute p-4 right-0">
              <SdkButton
                disabled={false}
                name="Re-sync or Change Design"
                onClick={() => dispatch(openDialog("SELECT_AURORA_DESIGN"))}
                left={true}
                right={true}
                active={false}
              />
            </div>
          )}
          <div className="h-full flex items-center justify-center">
            <img
              data-cy="design-tool-roof-image"
              className="object-contain h-full"
              alt="Top down view of solar design."
              src={roofImageUrl || ""}
            />
          </div>
        </>
      ) : (
        <div className="bg-white flex h-full w-full items-center justify-center">
          <p className="text-center text-gray-800 px-6 py-24 flex-shrink">Rooftop design has not been uploaded.</p>
        </div>
      )}
    </>
  );
};

export default DesignPortalRooftopImage;
