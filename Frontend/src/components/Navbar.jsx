import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  // Conditions to control what to show
  const showFullNav = path === "/home" || path === "/";
  const showOnlyHome = [
    "/register-restaurant",
    "/your-restaurant-auth",
    "/your-restaurant",
    "/cart",
    "/order",
    "/ordered",
    "/buyer-signin",
    "/buyer-signup",
  ].includes(path);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger shadow-sm px-3">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-4" to="/home">
          🍴 Foodie Haven
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Items */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center gap-3">
            {/* Show full navbar on home */}
            {showFullNav && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/buyer-signin">
                    🔐 Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/register-restaurant">
                    🏪 Register Restaurant
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/your-restaurant-auth">
                    📋 Your Restaurant
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/cart">
                    🛒 Cart
                  </Link>
                </li>
              </>
            )}

            {/* Show only Home on other pages */}
            {showOnlyHome && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/home">
                  🏠 Home
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
