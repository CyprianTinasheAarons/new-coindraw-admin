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

export const sendEmail = createAsyncThunk(
  "referrals/sendEmail",
  async (data) => {
    try {
      const response = await refferalService.sendEmail(data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const requestPayout = createAsyncThunk(
  "referrals/requestPayout",
  async (data) => {
    try {
      const response = await refferalService.requestPayout(data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const requestNewCode = createAsyncThunk(
  "referrals/requestNewCode",
  async (data) => {
    try {
      const response = await refferalService.requestNewCode(data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const requestDateExtension = createAsyncThunk(
  "referrals/requestDateExtension",
  async (data) => {
    try {
      const response = await refferalService.requestDateExtension(data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const acceptPayout = createAsyncThunk(
  "referrals/acceptPayout",
  async (data) => {
    try {
      const response = await refferalService.acceptPayout(data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const acceptNewCode = createAsyncThunk(
  "referrals/acceptNewCode",
  async (data) => {
    try {
      const response = await refferalService.acceptNewCode(data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const acceptDateExtension = createAsyncThunk(
  "referrals/acceptDateExtension",
  async (data) => {
    try {
      const response = await refferalService.acceptDateExtension(data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const applyAsReferrer = createAsyncThunk(
  "referrals/applyAsReferrer",
  async (data) => {
    try {
      const response = await refferalService.applyAsReferrer(data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const acceptReferrer = createAsyncThunk(
  "referrals/acceptReferrer",
  async (data) => {
    try {
      const response = await refferalService.acceptReferrer(data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const updatePayoutDetails = createAsyncThunk(
  "referrals/updatePayoutDetails",
  async (data) => {
    try {
      const response = await refferalService.updatePayoutDetails(data);
      return response.data;
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
    [sendEmail.pending]: (state) => {
      state.isLoading = true;
    },
    [sendEmail.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.referrals = state.referrals.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
    },
    [sendEmail.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [requestPayout.pending]: (state) => {
      state.isLoading = true;
    },
    [requestPayout.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.referrals = state.referrals.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
    },
    [requestPayout.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [requestNewCode.pending]: (state) => {
      state.isLoading = true;
    },
    [requestNewCode.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.referrals = state.referrals.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
    },
    [requestNewCode.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [requestDateExtension.pending]: (state) => {
      state.isLoading = true;
    },
    [requestDateExtension.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.referrals = state.referrals.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
    },
    [requestDateExtension.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [acceptPayout.pending]: (state) => {
      state.isLoading = true;
    },
    [acceptPayout.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.referrals = state.referrals.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
    },
    [acceptPayout.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [acceptNewCode.pending]: (state) => {
      state.isLoading = true;
    },
    [acceptNewCode.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.referrals = state.referrals.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
    },
    [acceptNewCode.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [acceptDateExtension.pending]: (state) => {
      state.isLoading = true;
    },
    [acceptDateExtension.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.referrals = state.referrals.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
    },
    [acceptDateExtension.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [applyAsReferrer.pending]: (state) => {
      state.isLoading = true;
    },
    [applyAsReferrer.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.referrals = state.referrals.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
    },
    [applyAsReferrer.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [acceptReferrer.pending]: (state) => {
      state.isLoading = true;
    },
    [acceptReferrer.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.referrals = state.referrals.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
    },
    [acceptReferrer.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [updatePayoutDetails.pending]: (state) => {
      state.isLoading = true;
    },
    [updatePayoutDetails.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.referrals = state.referrals.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
    },
    [updatePayoutDetails.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
  },
});

export default referralSlice.reducer;
