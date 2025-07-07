import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

export const getAllServices = createAsyncThunk('services/getAll', async (_, thunkApi) => {
  try {
    const { data } = await axiosInstance.get('/services');
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data);
  }
});

export const createService = createAsyncThunk('services/create', async (body, thunkApi) => {
  try {
    const { data } = await axiosInstance.post('/services', body);
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data);
  }
});

export const updateService = createAsyncThunk('services/update', async ({ id, body }, thunkApi) => {
  try {
    const { data } = await axiosInstance.put(`/services/${id}`, body);
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data);
  }
});

export const deleteService = createAsyncThunk('services/delete', async (id, thunkApi) => {
  try {
    await axiosInstance.delete(`/services/${id}`);
    return id;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data);
  }
});
