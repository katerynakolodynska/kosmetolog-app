import { createSlice } from '@reduxjs/toolkit';
import { loginAdmin } from './adminOperations';

const token = localStorage.getItem('adminToken') || null;

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    token,
    isLoggedIn: !!token,
    isLoading: false,
    error: null,
  },
  reducers: {
    logoutAdmin(state) {
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem('adminToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, { payload }) => {
        state.token = payload;
        state.isLoggedIn = true;
        state.isLoading = false;
        localStorage.setItem('adminToken', payload);
      })
      .addCase(loginAdmin.rejected, (state, { payload }) => {
        state.error = payload;
        state.isLoading = false;
      });
  },
});

export const { logoutAdmin } = adminSlice.actions;
export const adminReducer = adminSlice.reducer;
