import { createSlice } from '@reduxjs/toolkit';
import { getAllServices, createService, updateService, deleteService } from './servicesOperations';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllServices.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.items = payload;
      })
      .addCase(getAllServices.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(createService.fulfilled, (state, { payload }) => {
        state.items.push(payload);
      })
      .addCase(updateService.fulfilled, (state, { payload }) => {
        const index = state.items.findIndex((service) => service._id === payload._id);
        if (index !== -1) {
          state.items[index] = payload;
        }
      })
      .addCase(deleteService.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((service) => service._id !== payload);
      });
  },
});
export const servicesReducer = servicesSlice.reducer;
