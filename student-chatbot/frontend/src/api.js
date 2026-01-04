import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://student-chatbot-2-4m28.onrender.com/api',
});

export const setToken = (token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
