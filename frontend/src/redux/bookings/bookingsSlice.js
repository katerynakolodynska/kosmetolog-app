import { createSlice } from '@reduxjs/toolkit';
import { getAllBookings, createBooking, deleteBooking, updateBooking } from './bookingsOperations';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllBookings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBookings.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.items = payload;
      })
      .addCase(getAllBookings.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(updateBooking.fulfilled, (state, { payload }) => {
        const index = state.items.findIndex((b) => b._id === payload._id);
        if (index !== -1) {
          state.items[index] = payload;
        }
      })
      .addCase(createBooking.fulfilled, (state, { payload }) => {
        state.items.push(payload);
      })
      .addCase(deleteBooking.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((booking) => booking._id !== payload);
      });
  },
});

export const bookingsReducer = bookingsSlice.reducer;
