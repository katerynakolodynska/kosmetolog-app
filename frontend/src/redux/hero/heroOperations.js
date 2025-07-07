import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

export const fetchHero = createAsyncThunk('hero/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get('/hero');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Fetch error');
  }
});

export const createHero = createAsyncThunk('hero/create', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post('/hero', formData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Create error');
  }
});

export const updateHero = createAsyncThunk('hero/update', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.patch('/hero', formData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Update error');
  }
});
