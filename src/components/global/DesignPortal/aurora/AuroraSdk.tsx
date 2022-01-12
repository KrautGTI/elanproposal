import Head from "next/dist/next-server/lib/head";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuroraDesignId } from "../../../../lib/selectors";
import Loader from "../../../LoadingIcon";
import SdkControls from "./SdkControls";
import auroraSlice from "../../../../features/aurora/aurora.slice";

declare global {
  interface Window {
    auroraSdk: any;
    auroraDesign: any;
    auroraDesignId: string;
    auroraJwt: string;
  }
}

export default function AuroraSdk() {
  const dispatch = useDispatch();

  const auroraDesignId = useSelector(getAuroraDesignId);
  const { jwt } = useSelector(state => state.aurora);

  window.auroraDesignId = auroraDesignId as string;

  // Initiate the SDK only when this component is opened, there might be a better way to do this
  useEffect(() => {
    if (!!jwt) {
      dispatch(auroraSlice.actions.sdkOpened());
    }
  }, [jwt, dispatch]);

  if (!jwt) {
    return (
      <div className="flex justify-center items-center" style={{ height: "700px" }}>
        <Loader height={80} width={80} />
      </div>
    );
  } else {
    return (
      <div className="h-full w-full">
        <Head>
          <script type="text/javascript" src="/proposals/js/aurora-sdk.js" />
        </Head>
        <SdkControls />
        <div
          style={{ height: "700px" }}
          className="h-full w-full flex items-center justify-center rounded-lg"
          id="cad-element"
        ></div>
      </div>
    );
  }
}
