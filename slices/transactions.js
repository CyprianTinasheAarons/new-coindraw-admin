import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import transactionService from "../api/transaction.service";

const initialState = {
  transactions: [],
  errorMessage: null,
  isLoading: false,
};

export const getTransactions = createAsyncThunk(
  "transactions/getTransactions",
  async (_, { dispatch }) => {
    try {
      const response = await transactionService.getAll();

      // Sort by createdAt date
      const sortedTransactions = response.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      // Dispatch the sorted transactions
      dispatch({ type: 'transactions/setTransactions', payload: sortedTransactions });

      // Refresh transactions every 5 minutes
      setTimeout(() => {
        dispatch(getTransactions());
      }, 300000);

      return sortedTransactions;
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
  },
});

export default transactionSlice.reducer;
