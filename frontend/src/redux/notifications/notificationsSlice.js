import { createSlice } from '@reduxjs/toolkit';
import { createNotification, fetchNotifications, sendNotification } from './notificationsOperations';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(sendNotification.fulfilled, (state, action) => {
        const idx = state.items.findIndex((n) => n._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const notificationsReducer = notificationsSlice.reducer;
