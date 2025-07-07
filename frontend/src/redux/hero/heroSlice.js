import { createSlice } from '@reduxjs/toolkit';
import { fetchHero, createHero, updateHero } from './heroOperations';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const heroSlice = createSlice({
  name: 'hero',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchHero.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHero.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHero.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch hero data';
      })

      .addCase(createHero.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(updateHero.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export const heroReducer = heroSlice.reducer;
