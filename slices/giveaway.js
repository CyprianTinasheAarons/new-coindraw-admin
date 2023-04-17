import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import airdropService from "../api/airdrop.service";

const initialState = {
  giveawayHistory: [],
  errorMessage: null,
  isLoading: false,
};

export const getGiveawayHistory = createAsyncThunk(
  "giveaway/getGiveawayHistory",
  async () => {
    try {
      const response = await airdropService.getAll();
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const createGiveaway = createAsyncThunk(
  "giveaway/createGiveaway",
  async (data) => {
    const response = await airdropService.create(data);
    return response?.data;
  }
);

export const giveawaySlice = createSlice({
  name: "giveaway",
  initialState,
  reducers: {},
  extraReducers: {
    [getGiveawayHistory.pending]: (state) => {
      state.isLoading = true;
    },
    [getGiveawayHistory.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.giveawayHistory = [];
      state.giveawayHistory = action.payload;
    },
    [getGiveawayHistory.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [createGiveaway.pending]: (state) => {
      state.isLoading = true;
    },
    [createGiveaway.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.giveawayHistory = action.payload;
    },
    [createGiveaway.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
  },
});

export default giveawaySlice.reducer;
