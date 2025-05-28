import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/Navbar.css"; // Make sure this file doesn't override Bootstrap navbar behavior

export default function Navbar() {
  const location = useLocation();
  const currentRoute = location.pathname.toLowerCase();

  const [isBuyer, setIsBuyer] = useState(false);
  const [isRestaurant, setIsRestaurant] = useState(false);

  useEffect(() => {
    const buyer = localStorage.getItem("buyer");
    const restaurant = sessionStorage.getItem("restaurant");
    setIsBuyer(!!buyer);
    setIsRestaurant(!!restaurant);
  }, []);

  const handleSignOut = () => {
    if (isBuyer) localStorage.removeItem("buyer");
    if (isRestaurant) sessionStorage.removeItem("restaurant");
    window.location.href = "/home";
  };

  const linkStyle = {
    color: "#fff",
    fontWeight: "600",
    fontSize: "0.98rem",
    padding: "0.3rem 0.7rem",
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background: "linear-gradient(90deg, #ff6f61, #ffcc33)",
        padding: "0.3rem 0",
        minHeight: "44px",
      }}
    >
      <div className="container">
        <Link
          className="navbar-brand fw-bold fs-5 d-flex align-items-center"
          to="/home"
          style={{
            fontFamily: "'Pacifico', cursive",
            color: "#fff",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
            lineHeight: "1",
            padding: "0",
          }}
        >
          <span role="img" aria-label="burger" className="me-2 fs-6">
            🍔
          </span>
          Foodie Haven
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2 py-2 py-lg-0">
            {(currentRoute === "/" || currentRoute === "/home") && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart" style={linkStyle}>
                    <i className="bi bi-cart4 me-1"></i> Cart
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={isRestaurant ? "/your-restaurant" : "/register-restaurant"}
                    style={linkStyle}
                  >
                    <i className="bi bi-shop me-1"></i> {isRestaurant ? "My Restaurant" : "Register Restaurant"}
                  </Link>
                </li>
                {isBuyer || isRestaurant ? (
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link"
                      onClick={handleSignOut}
                      style={{ ...linkStyle, textDecoration: "none" }}
                    >
                      <i className="bi bi-box-arrow-right me-1"></i> Sign Out
                    </button>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/buyer-signin" style={linkStyle}>
                      <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                    </Link>
                  </li>
                )}
              </>
            )}

            {currentRoute === "/your-restaurant" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/home" style={linkStyle}>
                    <i className="bi bi-house-door me-1"></i> Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/edit-profile" style={linkStyle}>
                    <i className="bi bi-pencil-square me-1"></i> Edit Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/restaurant-orders" style={linkStyle}>
                    <i className="bi bi-list-check me-1"></i> Orders
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/delivered" style={linkStyle}>
                    <i className="bi bi-truck me-1"></i> Delivered
                  </Link>
                </li>
              </>
            )}

            {currentRoute === "/cart" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/home" style={linkStyle}>
                    <i className="bi bi-house-door me-1"></i> Home
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleSignOut}
                    style={{ ...linkStyle, textDecoration: "none" }}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i> Sign Out
                  </button>
                </li>
              </>
            )}

            {currentRoute === "/delivered" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/home" style={linkStyle}>
                    <i className="bi bi-house-door me-1"></i> Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/your-restaurant" style={linkStyle}>
                    <i className="bi bi-shop me-1"></i> My Restaurant
                  </Link>
                </li>
              </>
            )}

            {currentRoute === "/register-restaurant" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/home" style={linkStyle}>
                    <i className="bi bi-house-door me-1"></i> Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/your-restaurant" style={linkStyle}>
                    <i className="bi bi-shop me-1"></i> My Restaurant
                  </Link>
                </li>
              </>
            )}

            {currentRoute === "/your-restaurant-auth" && (
              <li className="nav-item">
                <Link className="nav-link" to="/home" style={linkStyle}>
                  <i className="bi bi-house-door me-1"></i> Home
                </Link>
              </li>
            )}

            {currentRoute === "/restaurant-orders" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/home" style={linkStyle}>
                    <i className="bi bi-house-door me-1"></i> Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/your-restaurant" style={linkStyle}>
                    <i className="bi bi-shop me-1"></i> My Restaurant
                  </Link>
                </li>
              </>
            )}

            {currentRoute === "/order" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/home" style={linkStyle}>
                    <i className="bi bi-house-door me-1"></i> Home
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
