import { syncAuroraDesign } from "./../aurora/aurora.actions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ParsedApiError } from "../../lib/api/proposal-api";

import { EnerfloProposalData, PricingOperation, SelectOption } from "../../types";
import {
  fetchProposalData,
  fetchRateScheduleOptions,
  recalculatePricing,
  refreshDesignData,
  submitOptimization,
} from "./proposal.actions";

type RateSchedulesState = {
  loading?: boolean;
  error?: {
    statusCode?: number;
    message: string;
  };
  options?: SelectOption[];
};

type ProposalState = {
  reportHash: string;
  data?: EnerfloProposalData;
  isLoading: boolean;
  isRecalculatingPrice?: boolean;
  activePricingOperation?: PricingOperation;
  isOptimizingDesign?: boolean;
  error?: {
    statusCode: number;
    message: string;
  };
  locked: boolean;
  rateSchedules: RateSchedulesState;
};

const initialState = {
  isLoading: false,
  locked: true,
  rateSchedules: {},
} as ProposalState;

const proposalSlice = createSlice({
  name: "proposal",
  initialState,
  reducers: {
    init(state, action: PayloadAction<string>) {
      state.reportHash = action.payload;
    },
    unlock(state) {
      state.locked = false;
    },
    toggleLock(state) {
      state.locked = !state.locked;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(submitOptimization.pending, (state, action) => {
        state.isOptimizingDesign = true;
      })
      .addCase(submitOptimization.fulfilled, (state, action) => {
        state.isOptimizingDesign = false;
        state.data = action.payload;
      })
      .addCase(submitOptimization.rejected, (state, action) => {
        state.isOptimizingDesign = false;
      });

    builder
      .addCase(syncAuroraDesign.pending, (state, action) => {
        state.isOptimizingDesign = true;
      })
      .addCase(syncAuroraDesign.fulfilled, (state, action) => {
        state.isOptimizingDesign = false;
        state.data = action.payload;
      })
      .addCase(syncAuroraDesign.rejected, (state, action) => {
        state.isOptimizingDesign = false;
      });

    builder
      .addCase(recalculatePricing.pending, (state, action) => {
        state.isRecalculatingPrice = true;
        state.activePricingOperation = action.meta.arg.type;
      })
      .addCase(recalculatePricing.fulfilled, (state, action) => {
        state.isRecalculatingPrice = false;
        state.activePricingOperation = undefined;
        state.data = action.payload;
      })
      .addCase(recalculatePricing.rejected, (state, action) => {
        state.isRecalculatingPrice = false;
        state.activePricingOperation = undefined;
      });

    builder
      .addCase(fetchRateScheduleOptions.pending, (state, action) => {
        state.rateSchedules.loading = true;
        delete state.rateSchedules.error;
      })
      .addCase(fetchRateScheduleOptions.fulfilled, (state, action) => {
        state.rateSchedules.loading = false;
        state.rateSchedules.options = action.payload;
      })
      .addCase(fetchRateScheduleOptions.rejected, (state, action) => {
        const payload = action.payload as ParsedApiError;

        state.rateSchedules.loading = false;
        state.rateSchedules.error = {
          statusCode: payload.statusCode,
          message: payload.message,
        };
      });

    builder
      .addCase(fetchProposalData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProposalData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
        state.error = undefined;
      })
      .addCase(fetchProposalData.rejected, (state, action) => {
        state.isLoading = false;

        if (action.meta.rejectedWithValue) {
          state.error = action.payload as any;
        }
      });

    builder
      .addCase(refreshDesignData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(refreshDesignData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(refreshDesignData.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const { init: initProposal, toggleLock } = proposalSlice.actions;

export default proposalSlice;
