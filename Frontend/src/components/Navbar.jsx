import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const isLoggedIn = localStorage.getItem("userToken") !== null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleSignOut = () => {
    localStorage.removeItem("userToken");
    navigate("/home");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-dark bg-danger px-3 py-2 shadow-sm position-relative">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-4 text-white" to="/home">
          🍴 Foodie Haven
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="btn btn-outline-light d-lg-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        {/* Desktop Menu */}
        <ul className="navbar-nav d-none d-lg-flex flex-row gap-4 align-items-center mb-0">
          {showFullNav && (
            <>
              {!isLoggedIn ? (
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/buyer-signin">
                    🔐 Sign In
                  </Link>
                </li>
              ) : (
                <li className="nav-item">
                  <button className="btn btn-light" onClick={handleSignOut}>
                    🚪 Sign Out
                  </button>
                </li>
              )}
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

          {showOnlyHome && (
            <li className="nav-item">
              <Link className="nav-link text-white" to="/home">
                🏠 Home
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Custom Mobile Dropdown */}
      {isMenuOpen && (
        <div
          className="position-absolute top-100 start-0 w-100 bg-white shadow-lg rounded-bottom p-3 d-lg-none"
          style={{ zIndex: 1000 }}
        >
          <ul className="list-unstyled mb-0">
            {showFullNav && (
              <>
                {!isLoggedIn ? (
                  <li>
                    <Link className="dropdown-item fw-semibold" to="/buyer-signin" onClick={() => setIsMenuOpen(false)}>
                      🔐 Sign In
                    </Link>
                  </li>
                ) : (
                  <li>
                    <button className="dropdown-item fw-semibold" onClick={handleSignOut}>
                      🚪 Sign Out
                    </button>
                  </li>
                )}
                <li>
                  <Link className="dropdown-item fw-semibold" to="/register-restaurant" onClick={() => setIsMenuOpen(false)}>
                    🏪 Register Restaurant
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item fw-semibold" to="/your-restaurant-auth" onClick={() => setIsMenuOpen(false)}>
                    📋 Your Restaurant
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item fw-semibold" to="/cart" onClick={() => setIsMenuOpen(false)}>
                    🛒 Cart
                  </Link>
                </li>
              </>
            )}

            {showOnlyHome && (
              <li>
                <Link className="dropdown-item fw-semibold" to="/home" onClick={() => setIsMenuOpen(false)}>
                  🏠 Home
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
