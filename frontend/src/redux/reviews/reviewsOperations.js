import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

export const getAllReviews = createAsyncThunk('reviews/getAll', async (_, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get('/api/reviews');
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const createReview = createAsyncThunk('reviews/create', async (formData, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post('/api/reviews', formData);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const deleteReview = createAsyncThunk('reviews/delete', async (id, thunkAPI) => {
  try {
    await axiosInstance.delete(`/api/reviews/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});
