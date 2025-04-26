import React, { useState } from 'react';

const Buyer_signup = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
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
        alert(data.message || 'Failed to send OTP');
      }
    } catch {
      alert('Failed to send OTP');
    }
    setIsSending(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/buyer-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        // Save user info for cart
        localStorage.setItem('buyer', JSON.stringify({ id: data.buyerId, name: data.name, email: data.email }));
        alert('Signup successful!');
        window.location.href = '/';
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch {
      alert('Signup failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" value={name}
                onChange={e => setName(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control" id="email" value={email}
                onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" value={password}
                onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={isSending}>
              {isSending ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">Enter OTP sent to your email</label>
              <input type="text" className="form-control" id="otp" value={otp}
                onChange={e => setOtp(e.target.value)} required />
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