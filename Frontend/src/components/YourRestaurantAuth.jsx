import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const YourRestaurantAuth = () => {
  const [credentials, setCredentials] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState(""); 
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem('restaurant');
    if (stored) {
      const { loginTime } = JSON.parse(stored);
      if (Date.now() - loginTime < 5 * 60 * 60 * 1000) { 
        navigate('/your-restaurant');
      } else {
        sessionStorage.removeItem('restaurant');
      }
    }
  }, []);

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
    setAuthError(""); 
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:3000/api/authenticate', {
        name: credentials.name.trim(),
        email: credentials.email.trim(),
        password: credentials.password,
      });

      sessionStorage.setItem('restaurant', JSON.stringify({
        id: response.data.restaurant.id,
        name: response.data.restaurant.name,
        email: response.data.restaurant.email,
        description: response.data.restaurant.description,
        image: response.data.restaurant.image,
        loginTime: Date.now()
      }));
      navigate('/your-restaurant');
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Sign In failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center pt-4"
         style={{
           background: 'url("https://images.unsplash.com/photo-1494595418061-8b6a6342560c?crop=entropy&cs=tinysrgb&fit=max&ixid=MXwyMDg4fDB8MHxwaG90by1mYWR8Nnx8Zm9vZCwgY29va2llfGVtZ3JlZW58&ixlib=rb-1.2.1&q=80")',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           color: 'white'
         }}>
      <div className="card p-4 shadow-lg rounded-4" style={{ maxWidth: '500px', width: '100%', backgroundColor: '#f7f3e3', border: '2px solid #e0a96d' }}>
        <h4 className="text-center text-danger mb-4">
          Restaurant Sign In
        </h4>

        <div className="text-center mb-4">
          <h2 className="text-warning">Ready to Serve Delicious Dishes?</h2>
          <p className="lead text-dark">Sign in to manage your menu, attract hungry customers, and grow your food business.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label text-dark">Restaurant Name</label>
            <input
              type="text"
              name="name"
              className={`form-control shadow-none ${errors.name ? 'is-invalid' : ''}`}
              value={credentials.name}
              onChange={handleChange}
              placeholder="Enter your restaurant's name"
              style={{ borderRadius: '10px', paddingLeft: '10px' }}
            />
            <div className="invalid-feedback">{errors.name}</div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label text-dark">Email</label>
            <input
              type="email"
              name="email"
              className={`form-control shadow-none ${errors.email ? 'is-invalid' : ''}`}
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={{ borderRadius: '10px', paddingLeft: '10px' }}
            />
            <div className="invalid-feedback">{errors.email}</div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label text-dark">Password</label>
            <div className="input-group input-group-sm">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`form-control shadow-none ${errors.password ? 'is-invalid' : ''}`}
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter password"
                style={{ borderRadius: '10px', paddingLeft: '10px' }}
              />
              <span className="input-group-text bg-warning text-white" 
                    style={{ cursor: 'pointer', borderRadius: '50%' }}
                    onClick={() => setShowPassword(!showPassword)}>
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} style={{ fontSize: '18px' }} />
              </span>
              <div className="invalid-feedback">{errors.password}</div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="d-grid mb-3">
            <button
              type="submit"
              className="btn btn-warning btn-sm fw-bold shadow-sm"
              style={{ borderRadius: '8px', fontSize: '14px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center small">
            Don't have an account?{' '}
            <Link to="/register-restaurant" className="text-decoration-none text-warning fw-bold">
              Register
            </Link>
          </div>
        </form>

        {authError && <div className="alert alert-danger mt-3">{authError}</div>} 
      </div>
    </div>
  );
};

export default YourRestaurantAuth;
