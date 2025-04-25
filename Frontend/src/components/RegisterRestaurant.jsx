import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterRestaurant = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    otp: '',
    description: '',
    password: '',
    confirmPassword: '',
    image: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const sendOtp = async () => {
    if (!formData.email) {
      alert('Please enter your email!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/api/send-otp', { email: formData.email });
      alert('OTP sent to your email!');
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/verify-otp', { email: formData.email, otp: formData.otp });
      alert('OTP verified successfully!');
      setOtpVerified(true);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert('Please verify your email before registering.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/api/restaurants', formData);
      alert('Restaurant registered successfully!');
      navigate('/your-restaurant-auth');
    } catch (error) {
      console.error('Error registering restaurant:', error);
      alert(error.response?.data?.message || 'Failed to register restaurant. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Register Your Restaurant</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Restaurant Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {!otpSent && (
          <button type="button" className="btn btn-secondary mb-3" onClick={sendOtp}>
            Send OTP
          </button>
        )}
        {otpSent && !otpVerified && (
          <>
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">Enter OTP</label>
              <input
                type="text"
                className="form-control"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
              />
            </div>
            <button type="button" className="btn btn-secondary mb-3" onClick={verifyOtp}>
              Verify OTP
            </button>
          </>
        )}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Restaurant Image</label>
          <input
            type="file"
            className="form-control"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
      <div className="text-center mt-3">
        <p>Already have an account? <a href="/your-restaurant-auth">Sign In</a></p>
      </div>
    </div>
  );
};

export default RegisterRestaurant;
