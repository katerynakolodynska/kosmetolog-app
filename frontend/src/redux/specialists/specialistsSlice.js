import { createSlice } from '@reduxjs/toolkit';
import {
  getAllSpecialists,
  createSpecialist,
  updateSpecialist,
  deleteSpecialist,
  toggleSpecialistStatus,
} from '../../redux/specialists/specialistsOperations.js';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const specialistsSlice = createSlice({
  name: 'specialists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllSpecialists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllSpecialists.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.items = payload;
      })
      .addCase(getAllSpecialists.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(createSpecialist.fulfilled, (state, { payload }) => {
        state.items.push(payload);
      })
      .addCase(updateSpecialist.fulfilled, (state, { payload }) => {
        const index = state.items.findIndex((specialist) => specialist._id === payload._id);
        if (index !== -1) {
          state.items[index] = payload;
        }
      })
      .addCase(deleteSpecialist.fulfilled, (state, { payload }) => {
        state.items = state.items.filter((specialist) => specialist._id !== payload);
      })
      .addCase(toggleSpecialistStatus.fulfilled, (state, { payload }) => {
        const index = state.items.findIndex((specialist) => specialist._id === payload._id);
        if (index !== -1) {
          state.items[index] = payload;
        }
      });
  },
});

export const specialistsReducer = specialistsSlice.reducer;
