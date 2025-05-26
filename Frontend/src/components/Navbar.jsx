import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/Navbar.css"; // Import custom CSS for tooltip

export default function Navbar() {
  const location = useLocation();
  const [isBuyer, setIsBuyer] = useState(false);
  const [isRestaurant, setIsRestaurant] = useState(false);

  // Check if the user is a buyer or restaurant owner
  useEffect(() => {
    const buyer = localStorage.getItem("buyer");
    const restaurant = sessionStorage.getItem("restaurant");
    setIsBuyer(!!buyer);
    setIsRestaurant(!!restaurant);
  }, []);

  // Handle sign-out logic
  const handleSignOut = () => {
    if (isBuyer) {
      localStorage.removeItem("buyer");
    }
    if (isRestaurant) {
      sessionStorage.removeItem("restaurant");
    }
    window.location.href = "/home";
  };

  // Check the current route
  const currentRoute = location.pathname;

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background: "linear-gradient(90deg, #ff6f61, #ffcc33)",
        padding: "0.3rem 0", // Reduced padding for a slimmer navbar
        minHeight: "44px",
      }}
    >
      <div className="container">
        {/* Logo */}
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

        {/* Mobile Menu Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ padding: "0.15rem 0.5rem" }}
        >
          <span className="navbar-toggler-icon" style={{ height: "1.2em" }}></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-lg-2">
            {/* Logic for /your-restaurant */}
            {currentRoute === "/your-restaurant" && (
              <>
                {/* Home Link */}
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/home"
                    style={{
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "0.98rem",
                      padding: "0.3rem 0.7rem",
                    }}
                  >
                    <i className="bi bi-house-door me-1"></i> Home
                  </Link>
                </li>

                {/* My Orders Link */}
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/my-orders"
                    style={{
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "0.98rem",
                      padding: "0.3rem 0.7rem",
                    }}
                  >
                    <i className="bi bi-list-check me-1"></i> My Orders
                  </Link>
                </li>

                {/* Edit Profile Link */}
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/edit-profile"
                    style={{
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "0.98rem",
                      padding: "0.3rem 0.7rem",
                    }}
                  >
                    <i className="bi bi-person-circle me-1"></i> Edit Profile
                  </Link>
                </li>

                {/* Notifications Link */}
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/notifications"
                    style={{
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "0.98rem",
                      padding: "0.3rem 0.7rem",
                    }}
                  >
                    <i className="bi bi-bell me-1"></i> Notifications
                  </Link>
                </li>

                {/* Delivered Link */}
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/delivered"
                    style={{
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "0.98rem",
                      padding: "0.3rem 0.7rem",
                    }}
                  >
                    <i className="bi bi-truck me-1"></i> Delivered
                  </Link>
                </li>
              </>
            )}

            {/* Logic for other routes */}
            {currentRoute !== "/your-restaurant" && (
              <>
                {/* Home Link */}
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/home"
                    style={{
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "0.98rem",
                      padding: "0.3rem 0.7rem",
                    }}
                  >
                    <i className="bi bi-house-door me-1"></i> Home
                  </Link>
                </li>

                {/* My Restaurant Link */}
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={isRestaurant ? "/your-restaurant" : "/your-restaurant-auth"}
                    style={{
                      color: "#fff",
                      fontWeight: "600",                      fontSize: "0.98rem",                      padding: "0.3rem 0.7rem",                    }}                  >                    <i className="bi bi-shop me-1"></i> My Restaurant                  </Link>                </li>              </>            )}          </ul>        </div>      </div>    </nav>  );}