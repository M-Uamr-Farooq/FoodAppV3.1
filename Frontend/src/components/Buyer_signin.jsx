import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Ensure bootstrap icons are installed

const Buyer_signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSignin = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!email || !password) {
      setErrors({ general: 'Please fill in all fields.' });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/buyer-signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('buyer', JSON.stringify({ id: data.buyerId, name: data.name, email: data.email }));
        alert('Sign in successful!');
        window.location.href = '/';
      } else {
        setErrors({ general: data.message || 'Invalid credentials' });
      }
    } catch {
      setErrors({ general: 'Sign in failed. Please try again.' });
    }
    setIsLoading(false);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=1600&q=80")',
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
          <i className="bi bi-box-arrow-in-right me-2"></i>Welcome Back, Hungry Friend!
        </h2>
        <p className="text-center mb-4" style={{ fontSize: '0.9rem', color: '#555' }}>
          Sign in and let's get you fed 🍔🍟🍕
        </p>

        {errors.general && (
          <div className="alert alert-danger py-2">{errors.general}</div>
        )}

        <form onSubmit={handleSignin}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              placeholder="Your food delivery inbox 📬"
              className="form-control shadow-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Secret sauce password 🍯"
              className="form-control shadow-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-warning w-100" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Feed Me Now 🍽️'}
          </button>
        </form>

        <p className="text-center mt-3">
          First time here? <a href="/buyer-signup" className="text-warning">Join the Feast</a>
        </p>
      </div>
    </div>
  );
};

export default Buyer_signin;
