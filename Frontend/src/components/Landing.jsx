import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  const backgroundStyle = {
    background: "linear-gradient(to bottom right, #ff9770, #ffd670, #fff5e1)",
    minHeight: "100vh",
    padding: "3rem 1rem",
  };

  const imageHoverStyle = {
    transition: "transform 0.3s ease-in-out",
    cursor: "pointer",
  };

  return (
    <div style={backgroundStyle} className="d-flex flex-column justify-content-center align-items-center text-center text-dark">
      {/* Header */}
      <h1 className="display-3 fw-bold text-white mb-3 shadow-sm">
        Craving Something Delicious?
      </h1>
      <p className="lead fs-4 text-dark mb-5 w-75 mx-auto">
        Whether you're hungry or ready to serve the feast — welcome to <span className="fw-semibold text-danger">Foodie Haven</span>! 🍕🍜🍩
      </p>

      {/* Buttons */}
      <div className="row row-cols-1 row-cols-md-2 g-4 mb-5 w-75">
        <div className="col d-grid">
          <Link to="/buyer_signin" className="btn btn-danger btn-lg shadow rounded-pill">
            🍴 I'm Here to Eat!
          </Link>
        </div>
        <div className="col d-grid">
          <Link to="/Seller-signin" className="btn btn-success btn-lg shadow rounded-pill">
            👨‍🍳 I'm Here to Sell!
          </Link>
        </div>
      </div>

      {/* Food Images */}
      <div className="row justify-content-center">
        <div className="col-10 col-md-5 mb-4">
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
            alt="Delicious Pizza"
            className="img-fluid rounded-4 shadow border border-3 border-danger"
            style={imageHoverStyle}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>
        <div className="col-10 col-md-5 mb-4">
          <img
            src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80"
            alt="Asian Cuisine"
            className="img-fluid rounded-4 shadow border border-3 border-success"
            style={imageHoverStyle}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>
      </div>

      {/* Tagline */}
      <p className="text-dark mt-4 fs-5 fst-italic">
        Still hungry? Let your cravings lead the way... 🥙🌮🍔
      </p>
    </div>
  );
}
