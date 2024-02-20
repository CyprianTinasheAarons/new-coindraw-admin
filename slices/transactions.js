import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import transactionService from "../api/transaction.service";

const initialState = {
  transactions: [],
  errorMessage: null,
  isLoading: false,
};

export const getTransactions = createAsyncThunk(
  "transactions/getTransactions",
  async (page, rows) => {
    try {
      const response = await transactionService.getAll(page, rows);

      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (transaction) => {
    try {
      const response = await transactionService.create(transaction);

      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (transaction) => {
    try {
      const response = await transactionService.update(transaction);

      return response.data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
);

export const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: {
    [getTransactions.pending]: (state) => {
      state.isLoading = true;
    },
    [getTransactions.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.transactions = [];
      state.transactions = action.payload;
    },
    [getTransactions.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [createTransaction.pending]: (state) => {
      state.isLoading = true;
    },
    [createTransaction.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.transactions = [];
      state.transactions = action.payload;
    },
    [createTransaction.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [updateTransaction.pending]: (state) => {
      state.isLoading = true;
    },
    [updateTransaction.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.transactions = [];
      state.transactions = action.payload;
    },
    [updateTransaction.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
  },
});

export default transactionSlice.reducer;
