import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state;

  const handleVerifyOtp = async () => {
    try {
        const response = await axios.post('http://localhost:3000/api/verify-otp', {
            email: formData.email.trim(),
            otp: otp.trim(),
            name: formData.name.trim(),
            description: formData.description,
            password: formData.password,
            image: formData.image,
        });
        alert('OTP verified and user information stored successfully!');
        navigate('/your-restaurant-auth');
    } catch (error) {
        console.error('Error verifying OTP:', error);
        alert(error.response?.data?.message || 'Invalid OTP. Please try again.');
    }
};

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4 text-primary">Verify OTP</h2>
        <div className="mb-3">
          <label htmlFor="otp" className="form-label">Enter OTP</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter the OTP sent to your email"
            className="form-control"
            required
          />
        </div>
        <div className="d-grid">
          <button onClick={handleVerifyOtp} className="btn btn-success">Verify OTP</button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;