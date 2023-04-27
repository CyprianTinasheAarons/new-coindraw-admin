import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../api/user.service";

const initialState = {
  users: [],
  errorMessage: null,
  isLoading: false,
};

export const getUsers = createAsyncThunk("users/getUsers", async () => {
  const response = await userService.getAll();
  return response.data;
});

export const get = createAsyncThunk("users/get", async (id) => {
  const response = await userService.get(id);
  return response.data;
});

export const deleteUser = createAsyncThunk("users/delete", async (id) => {
  const response = await userService.deleteUser(id);
  return response.data;
});

export const deleteAll = createAsyncThunk("users/deleteAll", async () => {
  const response = await userService.deleteAll();
  return response.data;
});

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: {
    [getUsers.pending]: (state) => {
      state.isLoading = true;
    },
    [getUsers.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.users = [];
      state.users = action.payload;
    },
    [getUsers.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [get.pending]: (state) => {
      state.isLoading = true;
    },
    [get.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.users = [];
      state.users = action.payload;
    },
    [get.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [deleteUser.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteUser.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.users = [];
      state.users = action.payload;
    },
    [deleteUser.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
    [deleteAll.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteAll.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.users = [];
      state.users = action.payload;
    },
    [deleteAll.rejected]: (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.error.message;
    },
  },
});

export default userSlice.reducer;
