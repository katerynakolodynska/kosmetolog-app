import axios from 'axios';

console.log('VITE_API_BASE:', import.meta.env.VITE_API_BASE); // тільки для дебагу

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
