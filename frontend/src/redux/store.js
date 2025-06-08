import { configureStore } from '@reduxjs/toolkit';
import { reviewsReducer } from './reviews/reviewsSlice';

export const store = configureStore({
  reducer: {
    reviews: reviewsReducer,
  },
});
