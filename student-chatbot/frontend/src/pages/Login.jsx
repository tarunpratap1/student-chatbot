import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../api.js';
import { useAuth } from '../store.js';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuth(state => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post('/auth/login', {
      email: email,        // must match backend
      password: password,  // must match backend
    });
    if (res.data.token) {
      setToken(res.data.token);
      login(res.data.token);
      navigate('/');
    } else {
      alert('Login failed');
    }
  } catch (err) {
    alert(err.response?.data?.error || 'Error logging in');
    console.error(err);
  }
};

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded bg-gray-900"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded bg-gray-900"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
}
