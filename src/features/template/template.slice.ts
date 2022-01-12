import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchTemplate, parseApiError } from "../../lib/api/proposal-api";
import { EnerfloProposalTemplate } from "../../types";

interface TemplateState {
  data: EnerfloProposalTemplate;
  isLoading: boolean;
  error?: {
    statusCode: number;
    message: string;
  };
}

const initialState = {
  isLoading: false,
} as TemplateState;

export const fetchProposalTemplate = createAsyncThunk<EnerfloProposalTemplate, string>(
  "template/fetch",
  async (reportHash: string, thunkAPI) => {
    try {
      const response = await fetchTemplate(reportHash);
      return response.data;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(parseApiError(e));
    }
  }
);

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    //
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProposalTemplate.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProposalTemplate.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
        state.error = undefined;
      })
      .addCase(fetchProposalTemplate.rejected, (state, action) => {
        state.isLoading = false;

        if (action.meta.rejectedWithValue) {
          state.error = action.payload as any;
        }
      });
  },
});

// export const {  } = templateSlice.actions;

export default templateSlice;
