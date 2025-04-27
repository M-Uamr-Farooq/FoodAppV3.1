import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Get registration data from location.state or sessionStorage
  const registrationData = location.state || JSON.parse(sessionStorage.getItem('pendingRestaurant'));

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!registrationData?.email) {
      setError('Missing registration data. Please register again.');
      return;
    }
    try {
      await axios.post('http://localhost:3000/api/verify-otp', {
        ...registrationData,
        otp
      });
      setSuccess('Registration complete! You can now sign in.');
      sessionStorage.removeItem('pendingRestaurant');
      setTimeout(() => navigate('/your-restaurant-auth'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <form onSubmit={handleVerify} className="p-4 shadow rounded bg-white" style={{ minWidth: 320 }}>
        <h3 className="mb-3 text-center">Verify OTP</h3>
        <div className="mb-3">
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="form-control"
            placeholder="Enter OTP"
            required
          />
        </div>
        <button type="submit" className="btn btn-warning w-100">Verify OTP</button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {success && <div className="alert alert-success mt-3">{success}</div>}
      </form>
    </div>
  );
};

export default VerifyOtp;