import axiosInstance from './axios';

export const fetchBusyTimes = async (date, specialistId) => {
  const params = { date };
  if (specialistId) params.specialistId = specialistId;

  const res = await axiosInstance.get('/bookings/busy', { params });
  return res.data; // ['12:00', '14:00']
};
