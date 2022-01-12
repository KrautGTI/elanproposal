import { AuroraDesign } from "./aurora.types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuroraDesigns, postAuroraJwt, postSyncAuroraDesign } from "../../lib/api/proposal-api";
import { RootState } from "../../rootReducer";
import { EnerfloProposalData } from "../../types";
import { AxiosError } from "axios";

export const fetchAuroraDesigns = createAsyncThunk<AuroraDesign[], undefined, { state: RootState }>(
  "aurora/fetchDesigns",
  async (_arg, thunkAPI) => {
    const surveyId = thunkAPI.getState().proposal.data?.surveyId;
    const response = await getAuroraDesigns(surveyId as number);
    return response.data;
  }
);

export const createAuroraJwt = createAsyncThunk<string>("aurora/createJwt", async () => {
  const response = await postAuroraJwt();
  return response.data;
});

export const syncAuroraDesign = createAsyncThunk<EnerfloProposalData, string | null, { state: RootState }>(
  "data/syncAuroraDesign",
  async (designId, thunkAPI) => {
    const surveyId = thunkAPI.getState().proposal.data?.surveyId;
    const auroraDesignId = !!designId ? designId : thunkAPI.getState().proposal.data?.design.auroraDesignId;

    try {
      const response = await postSyncAuroraDesign(surveyId as number, auroraDesignId as string);
      return response.data;
    } catch (e) {
      let error = e as AxiosError<any>;
      return thunkAPI.rejectWithValue({ errors: error.response?.data ?? {} });
    }
  }
);
