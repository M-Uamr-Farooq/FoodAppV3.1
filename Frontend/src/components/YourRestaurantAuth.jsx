import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const YourRestaurantAuth = () => {
  const [credentials, setCredentials] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState(""); // Add this to your state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!credentials.name.trim()) newErrors.name = 'Restaurant name is required';
    if (!credentials.email.trim()) newErrors.email = 'Email is required';
    if (!credentials.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(""); // Clear previous error
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:3000/api/authenticate', {
        email: credentials.email.trim(),
        password: credentials.password,
      });

      // Success: store info and redirect, no alert
      sessionStorage.setItem('restaurantName', response.data.restaurant.name);
      sessionStorage.setItem('restaurantEmail', response.data.restaurant.email);
      navigate('/your-restaurant');
    } catch (error) {
      // Show backend error on page
      setAuthError(error.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center pt-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg p-4 rounded-4 border border-2 border-warning">
              <div className="card-body p-4 bg-light">
                <h4 className="text-center text-warning mb-4">
                  <i className="bi bi-shop me-2" />
                  Restaurant Login
                </h4>

                <form onSubmit={handleSubmit} noValidate>
                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label">Restaurant Name</label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-warning text-white">
                        <i className="bi bi-person-circle" />
                      </span>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        value={credentials.name}
                        onChange={handleChange}
                        placeholder="Enter name"
                      />
                      <div className="invalid-feedback">{errors.name}</div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-warning text-white">
                        <i className="bi bi-envelope" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={credentials.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                      />
                      <div className="invalid-feedback">{errors.email}</div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-warning text-white">
                        <i className="bi bi-lock" />
                      </span>
                      <input
                        type="password"
                        name="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                      />
                      <div className="invalid-feedback">{errors.password}</div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      className="btn btn-warning btn-sm fw-bold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                  </div>

                  {/* Register Link */}
                  <div className="text-center small">
                    Don't have an account?{' '}
                    <Link to="/register-restaurant" className="text-decoration-none text-warning fw-bold">
                      <i className="bi bi-pencil-square me-1" />
                      Register
                    </Link>
                  </div>
                </form>
                {authError && <div className="alert alert-danger mt-3">{authError}</div>} {/* Display error here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourRestaurantAuth;
