import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

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

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className="card p-4 shadow"
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          borderRadius: '12px',
        }}
      >
        <h2 className="text-center mb-2 text-warning">
          <i className="bi bi-person-plus me-2"></i>Join the Foodie Club!
        </h2>
        <p className="text-center mb-4" style={{ fontSize: '0.9rem', color: '#555' }}>
          Sign up and satisfy your cravings 🍕🍔🥗
        </p>

        {errors.general && (
          <div className="alert alert-danger py-2">{errors.general}</div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name" // Add name attribute
                placeholder="What's your delicious name? 😋"
                className={`form-control shadow-none ${errors.name ? 'is-invalid' : ''}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name" // Enable browser autocomplete for name
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                name="email" // Add name attribute
                placeholder="Your feast alerts inbox 📬"
                className={`form-control shadow-none ${errors.email ? 'is-invalid' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email" // Enable browser autocomplete for email
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Create Password</label>
              <input
                type="password"
                name="password" // Add name attribute
                placeholder="A tasty secret 🍯"
                className={`form-control shadow-none ${errors.password ? 'is-invalid' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password" // Enable browser autocomplete for new password
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword" // Add name attribute
                placeholder="Repeat your tasty secret 🔒"
                className={`form-control shadow-none ${errors.confirmPassword ? 'is-invalid' : ''}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password" // Enable browser autocomplete for confirm password
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>

            <button type="submit" className="btn btn-warning w-100" disabled={isSending}>
              {isSending ? 'Sending OTP...' : 'Send OTP 🍩'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <label className="form-label">Enter OTP</label>
              <input
                type="text"
                name="otp" // Add name attribute
                placeholder="Check your food inbox! 🍗"
                className={`form-control shadow-none ${errors.otp ? 'is-invalid' : ''}`}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                autoComplete="one-time-code" // Enable browser autocomplete for OTP
              />
              {errors.otp && <div className="invalid-feedback">{errors.otp}</div>}
            </div>

            <button type="submit" className="btn btn-success w-100">
              Verify & Feast 🎉
            </button>
          </form>
        )}

        <p className="text-center mt-3">
          Already a foodie? <a href="/buyer-signin" className="text-warning">Sign in to Eat</a>
        </p>
      </div>
    </div>
  );
};

export default Buyer_signup;
