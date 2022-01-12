import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SdkButton from "./SdkButton";
import { faSync } from "@fortawesome/pro-light-svg-icons";
import {
  AuroraViewOptionKey,
  fullScreen,
  toggleSunAnimation,
  toggleViewOption,
  toHomeView,
} from "../../../../features/aurora";
import { openDialog } from "../../../../features/dialogs";
import auroraSlice from "../../../../features/aurora/aurora.slice";
import { getActiveAuroraDesignName } from "../../../../lib/selectors";

export function getSdk() {
  return window.auroraSdk;
}

const SdkControls: FC = () => {
  const dispatch = useDispatch();
  const { viewOptions, loadingDesignToSdk, sdkHasChanges, watchingIrradiance, loadingDesigns } = useSelector(
    state => state.aurora
  );

  const activeDesignName = useSelector(getActiveAuroraDesignName);

  const toggle = (key: AuroraViewOptionKey) => {
    dispatch(toggleViewOption(key));
  };

  const openSaveModal = () => dispatch(openDialog("SAVE_AURORA_DESIGN"));
  const openSelectDesignModal = () => dispatch(openDialog("SELECT_AURORA_DESIGN"));
  const openViewOptions = () => dispatch(openDialog("AURORA_SDK_VIEW_OPTIONS"));

  // This is kinda hacky but was unable to attach generators or async events that create redux effects to the watcher
  // If that can be figured out we can move this to the aurora.saga
  useEffect(() => {
    if (!loadingDesignToSdk && !watchingIrradiance) {
      dispatch(auroraSlice.actions.watchingIrradiance());
      const sdk = getSdk();
      sdk.event.on("irradianceUpdated", async event => {
        if (event.panels === "invalid") {
          dispatch(auroraSlice.actions.detectChanges());
        } else if (event.panels === "complete") {
          dispatch(auroraSlice.actions.cleanChanges());
        }
      });
    }
  }, [loadingDesignToSdk, dispatch, watchingIrradiance]);

  return (
    <>
      <div
        className="w-full flex rounded-md justify-between flex-wrap"
        style={{ paddingLeft: "1px", paddingRight: "1px" }}
      >
        <div className="mb-2">
          <SdkButton
            disabled={loadingDesignToSdk}
            name="Panels"
            onClick={() => toggle("solarPanels")}
            left={true}
            right={false}
            active={viewOptions.solarPanels}
          />
          {/* TODO lidar takes a while to load the first time it's pressed. I don't see an event to hook into that to show loading state. This could be a limitation of the beta-ness of the SDK */}
          <SdkButton
            disabled={loadingDesignToSdk}
            name="Lidar"
            onClick={() => toggle("lidar")}
            left={false}
            right={false}
            active={viewOptions.lidar}
          />
          <SdkButton
            disabled={loadingDesignToSdk}
            name="Irradiance"
            onClick={() => toggle("irradianceMap")}
            left={false}
            right={false}
            active={viewOptions.irradianceMap}
          />
          <SdkButton
            disabled={loadingDesignToSdk}
            name="More"
            onClick={openViewOptions}
            left={false}
            right={true}
            active={false}
          />
        </div>
        <div className="mb-2">
          <SdkButton
            disabled={loadingDesignToSdk || !sdkHasChanges}
            name={
              loadingDesignToSdk ? (
                <span>
                  {"Loading"}&nbsp;&nbsp;
                  <FontAwesomeIcon icon={faSync} spin />
                </span>
              ) : (
                <>{sdkHasChanges ? <span className="font-bold">Save Design</span> : <span>Save Design</span>}</>
              )
            }
            onClick={openSaveModal}
            left={true}
            right={false}
            active={false}
          />
          <SdkButton
            disabled={loadingDesigns || !activeDesignName || loadingDesignToSdk}
            name={
              loadingDesigns || !activeDesignName || loadingDesignToSdk ? (
                <span>
                  {"Loading"}&nbsp;&nbsp;
                  <FontAwesomeIcon icon={faSync} spin />
                </span>
              ) : (
                <>{activeDesignName}</>
              )
            }
            onClick={openSelectDesignModal}
            left={false}
            right={true}
            active={false}
          />
        </div>
        <div className="mb-2">
          <SdkButton
            disabled={loadingDesignToSdk}
            name={!viewOptions.sunpath ? "Play Sun Animation" : "Stop Sun Animation"}
            onClick={() => dispatch(toggleSunAnimation())}
            left={true}
            right={false}
            active={viewOptions.sunpath}
          />
          <SdkButton
            disabled={loadingDesignToSdk}
            name="Full Screen"
            onClick={() => dispatch(fullScreen())}
            left={false}
            right={false}
            active={false}
          />
          <SdkButton
            disabled={loadingDesignToSdk}
            name="Re-Center"
            onClick={() => dispatch(toHomeView())}
            left={false}
            right={true}
            active={false}
          />
        </div>
      </div>
    </>
  );
};

export default SdkControls;
