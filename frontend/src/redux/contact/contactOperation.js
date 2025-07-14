import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

export const fetchContact = createAsyncThunk('contact/fetch', async (_, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get('/contact');
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateContact = createAsyncThunk('contact/update', async (payload) => {
  const { data } = await axiosInstance.put('/contact', payload);
  return data;
});

export const createContact = createAsyncThunk('contact/create', async (payload) => {
  const { data } = await axiosInstance.post('/contact', payload);
  return data;
});
