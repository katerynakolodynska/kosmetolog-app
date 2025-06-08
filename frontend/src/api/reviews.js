// import axios from 'axios';

// const BASE_URL = import.meta.env.VITE_API_URL;

// export const getAllReviews = async () => {
//   const res = await axios.get(`${BASE_URL}/api/reviews`);
//   return Array.isArray(res.data) ? res.data : [];
// };

// export const createReview = async (FormData) => {
//   const response = await axios.post(`${BASE_URL}/api/reviews`, FormData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
//   return response.data;
// };

// export const deleteReview = async (id) => {
//   await axios.delete(`${BASE_URL}/api/reviews/${id}`);
// };
