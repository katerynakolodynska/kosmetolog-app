import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get('/notifications');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Fetch error');
  }
});

export const createNotification = createAsyncThunk('notifications/create', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post('/notifications', formData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Create error');
  }
});

export const sendNotification = createAsyncThunk('notifications/send', async (notificationId, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post(`/notifications/send/${notificationId}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Send error');
  }
});
