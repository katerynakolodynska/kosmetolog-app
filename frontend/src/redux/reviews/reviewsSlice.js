import { createSlice } from '@reduxjs/toolkit';
import { getAllReviews, createReview, deleteReview } from './reviewsOperations';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllReviews.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.items = payload;
      })
      .addCase(getAllReviews.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(createReview.fulfilled, (state, { payload }) => {
        state.items.unshift(payload);
      })
      .addCase(deleteReview.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((review) => review._id !== payload);
      });
  },
});

export const reviewsReducer = reviewsSlice.reducer;
