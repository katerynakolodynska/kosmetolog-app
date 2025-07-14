import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

export const getAllBookings = createAsyncThunk('bookings/getAllBooking', async (_, thunkAPI) => {
  try {
    const { data } = await axiosInstance.get('/bookings');
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const createBooking = createAsyncThunk('booking/create', async (body, thunkAPI) => {
  try {
    const { data } = await axiosInstance.post('/bookings', body);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Booking error');
  }
});

export const updateBooking = createAsyncThunk('booking/update', async ({ id, body }, thunkAPI) => {
  try {
    const { data } = await axiosInstance.put(`/bookings/${id}`, body);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const deleteBooking = createAsyncThunk('bookings/delete', async (id, thunkAPI) => {
  try {
    await axiosInstance.delete(`/bookings/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});
