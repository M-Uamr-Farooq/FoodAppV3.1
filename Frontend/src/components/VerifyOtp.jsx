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
      });
      alert('OTP verified and user information stored successfully!');
      navigate('/your-restaurant-auth');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert(error.response?.data?.message || 'Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg p-4 rounded-4 border border-2 border-success">
              <div className="card-body p-4 bg-light">
                <h4 className="text-center text-success mb-4">
                  <i className="bi bi-shield-lock me-2" />
                  Verify OTP
                </h4>

                <form onSubmit={(e) => e.preventDefault()} noValidate>
                  {/* OTP Input */}
                  <div className="mb-3">
                    <label htmlFor="otp" className="form-label">Enter OTP</label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-success text-white">
                        <i className="bi bi-key" />
                      </span>
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
                  </div>

                  {/* Verify Button */}
                  <div className="d-grid mb-3">
                    <button
                      onClick={handleVerifyOtp}
                      className="btn btn-success btn-sm fw-bold"
                    >
                      Verify OTP
                    </button>
                  </div>

                  {/* Back to Login Link */}
                  <div className="text-center small">
                    Already verified?{' '}
                    <a href="/your-restaurant-auth" className="text-decoration-none text-success fw-bold">
                      <i className="bi bi-arrow-right-circle me-1" />
                      Login
                    </a>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;