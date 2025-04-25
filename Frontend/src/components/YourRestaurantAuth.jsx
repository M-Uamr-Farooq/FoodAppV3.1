import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const YourRestaurantAuth = () => {
  const [credentials, setCredentials] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/authenticate', {
        name: credentials.name.trim(),
        email: credentials.email.trim(),
        password: credentials.password,
      });
      alert('Login successful!');
      sessionStorage.setItem('restaurantName', credentials.name.trim());
      sessionStorage.setItem('restaurantEmail', credentials.email.trim());
      navigate('/your-restaurant');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed. Try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Restaurant Login</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
        <div className="mb-3">
          <label className="form-label">Restaurant Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={credentials.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
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

