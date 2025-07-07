import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

export const getAllSpecialists = createAsyncThunk('specialists/getAll', async (_, thunkApi) => {
  try {
    const { data } = await axiosInstance.get('/specialists');
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data);
  }
});

export const createSpecialist = createAsyncThunk('specialists/create', async (body, thunkApi) => {
  try {
    const { data } = await axiosInstance.post('/specialists', body);
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data);
  }
});

export const toggleSpecialistStatus = createAsyncThunk(
  'specialists/toggleStatus',
  async ({ id, isActive }, thunkAPI) => {
    try {
      const { data } = await axiosInstance.patch(`/specialists/${id}/toggle`, {
        isActive,
      });
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateSpecialist = createAsyncThunk('specialists/update', async ({ id, body }, thunkApi) => {
  try {
    const { data } = await axiosInstance.put(`/specialists/${id}`, body);
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data);
  }
});

export const deleteSpecialist = createAsyncThunk('specialists/delete', async (id, thunkApi) => {
  try {
    await axiosInstance.delete(`/specialists/${id}`);
    return id;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data);
  }
});
