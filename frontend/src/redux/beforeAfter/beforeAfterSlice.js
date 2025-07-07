import { createSlice } from '@reduxjs/toolkit';
import { fetchBeforeAfter, createBeforeAfter, deleteBeforeAfter, updateBeforeAfter } from './beforeAfterOperations';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const beforeAfterSlice = createSlice({
  name: 'beforeAfter',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBeforeAfter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBeforeAfter.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload;
      })
      .addCase(fetchBeforeAfter.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      })
      .addCase(createBeforeAfter.fulfilled, (state, { payload }) => {
        state.items.unshift(payload);
      })
      .addCase(updateBeforeAfter.fulfilled, (state, { payload }) => {
        const index = state.items.findIndex((item) => item._id === payload._id);
        if (index !== -1) {
          state.items[index] = payload;
        }
      })
      .addCase(deleteBeforeAfter.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((item) => item._id !== payload);
      });
  },
});

export const beforeAfterReducer = beforeAfterSlice.reducer;
