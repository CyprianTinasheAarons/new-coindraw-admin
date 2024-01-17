import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import discountService from "../api/discount.service";
import crypto from "crypto";

const initialState = {
  discounts: [],
  errorMessage: null,
  isLoading: false,
};

// Decrypt Discount Code
const decrypt = (encryptedCode) => {
  const decipher = crypto.createDecipher("aes-256-cbc", "d6F3Efeq");
  let decrypted = decipher.update(encryptedCode, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export const createDiscount = createAsyncThunk(
  "discounts/createDiscount",
  async (data) => {
    try {
      const response = await discountService.create(data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const updateDiscount = createAsyncThunk(
  "discounts/updateDiscount",
  async (data) => {
    try {
      const response = await discountService.update(data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const deleteDiscount = createAsyncThunk(
  "discounts/deleteDiscount",
  async (data) => {
    try {
      const response = await discountService.delete(data);
      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const getAllDiscounts = createAsyncThunk(
  "discounts/getAllDiscounts",
  async () => {
    try {
      const response = await discountService.getAll();
      const decryptedData = response.data.map((item) => {
        return { ...item, code: decrypt(item.code) };
      });
      return decryptedData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const getDiscount = createAsyncThunk(
  "discounts/getDiscount",
  async (data) => {
    try {
      const response = await discountService.get(data);
      const decryptedData = {
        ...response.data,
        code: decrypt(response.data.code),
      };
      return decryptedData;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

const discountSlice = createSlice({
  name: "discounts",
  initialState,
  reducers: {},
  extraReducers: {
    [createDiscount.pending]: (state, action) => {
      state.isLoading = true;
    },
    [createDiscount.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.discounts.push(action.payload);
    },
    [createDiscount.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [updateDiscount.pending]: (state, action) => {
      state.isLoading = true;
    },
    [updateDiscount.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.discounts = state.discounts.map((discount) => {
        if (discount.id === action.payload.id) {
          return action.payload;
        }
        return discount;
      });
    },
    [updateDiscount.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [deleteDiscount.pending]: (state, action) => {
      state.isLoading = true;
    },
    [deleteDiscount.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.discounts = state.discounts.filter(
        (discount) => discount.id !== action.payload.id
      );
    },
    [deleteDiscount.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [getAllDiscounts.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getAllDiscounts.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.discounts = action.payload;
    },
    [getAllDiscounts.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [getDiscount.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getDiscount.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.discounts = action.payload;
    },
    [getDiscount.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
  },
});

export default discountSlice.reducer;
