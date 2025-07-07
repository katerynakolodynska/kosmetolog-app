import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

export const fetchBeforeAfter = createAsyncThunk('beforeAfter/fetchAll', async (_, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get('/before-after');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const createBeforeAfter = createAsyncThunk('beforeAfter/create', async (formData, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post('/before-after', formData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateBeforeAfter = createAsyncThunk('beforeAfter/update', async ({ id, data }, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`/before-after/${id}`, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const deleteBeforeAfter = createAsyncThunk('beforeAfter/delete', async (id, thunkAPI) => {
  try {
    await axiosInstance.delete(`/before-after/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
