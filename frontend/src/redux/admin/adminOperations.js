import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const loginAdmin = createAsyncThunk('admin/login', async (credentials, thunkApi) => {
  try {
    const { data } = await axios.post('/admin/login', credentials);
    return data.token;
  } catch (err) {
    return thunkApi.rejectWithValue(err.response?.data?.message || err.message);
  }
});
