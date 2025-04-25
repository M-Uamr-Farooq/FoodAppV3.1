import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const YourRestaurantAuth = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:3000/api/authenticate', credentials);
        alert('Login successful!');
        sessionStorage.setItem('username', credentials.username); // Store username in sessionStorage
        navigate('/your-restaurant'); // Redirect to authenticated page
    } catch (error) {
        console.error('Error authenticating:', error);
        alert(error.response?.data?.message || 'Invalid username or password.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Restaurant Login</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default YourRestaurantAuth;
