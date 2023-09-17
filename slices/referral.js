import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import refferalService from "../api/referral.service";

const initialState = {
  referrals: [],
  refferer: {},
  errorMessage: null,
  isLoading: false,
};

export const createReferral = createAsyncThunk(
  "referrals/createReferral",
  async (data) => {
    try {
      const response = await refferalService.create(data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const updateReferral = createAsyncThunk(
  "referrals/updateReferral",
  async (data) => {
    try {
      const response = await refferalService.update(data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const sendReward = createAsyncThunk(
  "referrals/sendReward",
  async (data) => {
    try {
      const response = await refferalService.sendReward(data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const setPercentage = createAsyncThunk(
  "referrals/setPercentage",
  async (data) => {
    try {
      const response = await refferalService.setPercentage(data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const deleteReferral = createAsyncThunk(
  "referrals/deleteReferral",
  async (data) => {
    try {
      const response = await refferalService.delete(data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const getReferrals = createAsyncThunk(
  "referrals/getReferrals",
  async () => {
    try {
      const response = await refferalService.getAll();
      // Sort the referrals by createdAt, newest first
      const sortedData = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      return sortedData;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const referralSlice = createSlice({
  name: "referrals",
  initialState,
  reducers: {
    setReferrals: (state, action) => {
      state.referrals = action.payload;
    },
  },
  extraReducers: {
    [createReferral.pending]: (state) => {
      state.isLoading = true;
    },
    [createReferral.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.referrals.push(action.payload);
    },
    [createReferral.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [updateReferral.pending]: (state) => {
      state.isLoading = true;
    },
    [updateReferral.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.referrals = state.referrals.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
    },
    [updateReferral.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [sendReward.pending]: (state) => {
      state.isLoading = true;
    },
    [sendReward.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.referrals = state.referrals.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
    },
    [sendReward.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [deleteReferral.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteReferral.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.referrals = state.referrals.filter(
        (item) => item.id !== action.payload.id
      );
    },
    [deleteReferral.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [getReferrals.pending]: (state) => {
      state.isLoading = true;
    },
    [getReferrals.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.referrals = action.payload;
    },
    [getReferrals.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
  },
});

export default referralSlice.reducer;
