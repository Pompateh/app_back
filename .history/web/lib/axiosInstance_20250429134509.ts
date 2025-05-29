import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001',
  withCredentials: false,      // cookies not needed
});

axiosInstance.interceptors.request.use(cfg => {
  const token = localStorage.getItem('accessToken');
  if (token) cfg.headers!['Authorization'] = `Bearer ${token}`;
  return cfg;
});
export default axiosInstance;
