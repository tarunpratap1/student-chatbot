import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

export const setToken = (token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
