import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

class ApiError extends Error {
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        toast.error('Your session has expired. Please log in again.');
        window.location.href = '/login';
      }
    }

    if (status && status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      'An unexpected error occurred';

    return Promise.reject(
      new ApiError(
        errorMessage,
        status,
        error.response?.data
      )
    );
  }
);

export default api;
export { ApiError };