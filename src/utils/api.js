import axios from 'axios';
import { backend_url } from '../config/api_route';

const API = axios.create({
  baseURL: backend_url,
});

// Always get the latest token when making a request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Simply reject errors, no refresh logic
API.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
