import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

export const getAllReviews = createAsyncThunk('reviews/getAllReview', async (_, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get('/reviews');
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const createReview = createAsyncThunk('reviews/create', async (formData, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post('/reviews', formData);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const deleteReview = createAsyncThunk('reviews/delete', async (id, thunkAPI) => {
  try {
    await axiosInstance.delete(`/reviews/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});
