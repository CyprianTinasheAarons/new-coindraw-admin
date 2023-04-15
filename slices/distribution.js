import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import distributeService from "../api/distribute.service";

const initialState = {
  distributionHistory: null,
  errorMessage: null,
  isLoading: false,
};

export const getDistributionHistory = createAsyncThunk(
  "distribution/getDistributionHistory",
  async () => {
    const response = await distributeService.getAll();
    return response.data;
  }
);

export const createDistribution = createAsyncThunk(
  "distribution/createDistribution",
  async (data) => {
    const response = await distributeService.create(data);
    return response.data;
  }
);

export const distributionSlice = createSlice({
  name: "distribution",
  initialState,
  reducers: {},
  extraReducers: {
    [getDistributionHistory.pending]: (state) => {
      state.isLoading = true;
    },
    [getDistributionHistory.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.distributionHistory = action.payload;
    },
    [getDistributionHistory.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [createDistribution.pending]: (state) => {
      state.isLoading = true;
    },
    [createDistribution.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.distributionHistory = action.payload;
    },
    [createDistribution.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
  },
});

export default distributionSlice.reducer;
