import { createSlice } from '@reduxjs/toolkit';
import { fetchContact, updateContact, createContact } from './contactOperation';

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContact.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateContact.fulfilled, (state, action) => {
        state.data = action.payload;
      })

      .addCase(createContact.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export const contactReducer = contactSlice.reducer;
