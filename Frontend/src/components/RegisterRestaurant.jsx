import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const RegisterRestaurant = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Restaurant name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm your password';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setErrorMessage('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:3000/api/send-otp', {
        email: formData.email.trim(),
      });
      // Store registration data in sessionStorage
      sessionStorage.setItem('pendingRestaurant', JSON.stringify(formData));
      navigate('/verify-otp'); // Remove { state: { formData } }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center pt-4">
      <div className="card shadow-lg p-4 rounded-4 border border-2 border-warning" style={{ width: '100%', maxWidth: '480px' }}>
        <h4 className="text-center text-warning mb-3">
          <i className="bi bi-pencil-square me-2" />
          Register Your Restaurant
        </h4>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label">Restaurant Name</label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
            <div className="invalid-feedback">{errors.name}</div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
            <div className="invalid-feedback">{errors.email}</div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              rows="2"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description"
            />
            <div className="invalid-feedback">{errors.description}</div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
            <div className="invalid-feedback">{errors.password}</div>
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />
            <div className="invalid-feedback">{errors.confirmPassword}</div>
          </div>

          <button
            type="submit"
            className="btn btn-warning w-100 fw-bold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>

          <p className="text-center mt-3 mb-0 small">
            Already have an account?{' '}
            <Link to="/your-restaurant-auth" className="text-decoration-none text-primary">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterRestaurant;
