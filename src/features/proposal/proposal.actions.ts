import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import {
  fetchData,
  getRateScheduleOptions,
  parseApiError,
  postDesignOptimization,
  postPricingCalculation,
} from "../../lib/api/proposal-api";
import { RootState } from "../../rootReducer";
import {
  CalculatePricingAction,
  EnerfloProposalData,
  OptimizeDesignAction,
  OptimizeDesignOperationType,
  PricingOperation,
  SelectOption,
} from "../../types";

export const fetchProposalData = createAsyncThunk<EnerfloProposalData, string>(
  "proposal/fetch",
  async (reportHash, thunkAPI) => {
    try {
      const response = await fetchData(reportHash);
      return response.data;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(parseApiError(e));
    }
  }
);

export const refreshDesignData = createAsyncThunk<EnerfloProposalData, undefined, { state: RootState }>(
  "proposal/refresh",
  async (_arg, thunkAPI) => {
    const reportHash = thunkAPI.getState().proposal.reportHash;
    const response = await fetchData(reportHash!, { params: { refresh: 1 } });
    return response.data;
  }
);

export const submitOptimization = createAsyncThunk<EnerfloProposalData, OptimizeDesignAction, { state: RootState }>(
  "data/submitOptimization",
  async <T extends OptimizeDesignOperationType>(payload: OptimizeDesignAction<T>, thunkAPI) => {
    const reportHash = thunkAPI.getState().proposal.reportHash;
    const { data = {}, type: _type } = payload;

    try {
      const response = await postDesignOptimization(reportHash, { ...data, _type });

      return response.data;
    } catch (e) {
      let error = e as AxiosError<any>;

      return thunkAPI.rejectWithValue({ errors: error.response?.data?.errors ?? {} });
    }
  }
);

export const recalculatePricing = createAsyncThunk<EnerfloProposalData, CalculatePricingAction, { state: RootState }>(
  "proposal/recalculatePricing",
  async <T extends PricingOperation>(action: CalculatePricingAction<T>, thunkAPI) => {
    const reportHash = thunkAPI.getState().proposal.reportHash;
    const { type: _type, data = {} } = action;

    try {
      const response = await postPricingCalculation(reportHash, _type, { ...data, _type });

      return response.data;
    } catch (e) {
      let error = e as AxiosError<any>;

      return thunkAPI.rejectWithValue({ errors: error.response?.data?.errors ?? {} });
    }
  }
);

export const fetchRateScheduleOptions = createAsyncThunk<SelectOption[], undefined, { state: RootState }>(
  "proposal/fetchRateScheduleOptions",
  async (_arg, thunkAPI) => {
    const reportHash = thunkAPI.getState().proposal.reportHash;
    try {
      const response = await getRateScheduleOptions(reportHash);
      return response.data.options;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(parseApiError(e));
    }
  }
);
