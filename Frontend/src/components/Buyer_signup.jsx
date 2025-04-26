import React, { useState } from 'react';

const Buyer_signup = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required.";
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;
    setIsSending(true);
    try {
      const res = await fetch('http://localhost:3000/api/buyer-send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('OTP sent to your email.');
        setStep(2);
      } else {
        setErrors({ general: data.message || 'Failed to send OTP' });
      }
    } catch {
      setErrors({ general: 'Failed to send OTP' });
    }
    setIsSending(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setErrors({ otp: "OTP is required." });
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/buyer-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('buyer', JSON.stringify({ id: data.buyerId, name: data.name, email: data.email }));
        alert('Signup successful!');
        window.location.href = '/';
      } else {
        setErrors({ general: data.message || 'Signup failed' });
      }
    } catch {
      setErrors({ general: 'Signup failed' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/buyer-signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // Store buyer info for cart and session
        localStorage.setItem('buyer', JSON.stringify(data.buyer));
        // Redirect to Home page
        window.location.href = '/';
      } else {
        alert(data.message || 'Sign in failed');
      }
    } catch {
      alert('Login failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        {errors.general && (
          <div className="alert alert-danger py-2">{errors.general}</div>
        )}
        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className={`form-control${errors.name ? ' is-invalid' : ''}`} id="name" value={name}
                onChange={e => setName(e.target.value)} required />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className={`form-control${errors.email ? ' is-invalid' : ''}`} id="email" value={email}
                onChange={e => setEmail(e.target.value)} required />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Create Password</label>
              <input type="password" className={`form-control${errors.password ? ' is-invalid' : ''}`} id="password" value={password}
                onChange={e => setPassword(e.target.value)} required />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input type="password" className={`form-control${errors.confirmPassword ? ' is-invalid' : ''}`} id="confirmPassword" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} required />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={isSending}>
              {isSending ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">Enter OTP sent to your email</label>
              <input type="text" className={`form-control${errors.otp ? ' is-invalid' : ''}`} id="otp" value={otp}
                onChange={e => setOtp(e.target.value)} required />
              {errors.otp && <div className="invalid-feedback">{errors.otp}</div>}
            </div>
            <button type="submit" className="btn btn-success w-100">Verify & Signup</button>
          </form>
        )}
        <p className="text-center mt-3">
          Already have an account? <a href="/buyer-signin" className="text-decoration-none">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Buyer_signup;