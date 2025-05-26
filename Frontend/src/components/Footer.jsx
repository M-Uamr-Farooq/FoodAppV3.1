import React from "react";

export default function Footer() {
  return (
    <footer
      className="footer mt-auto py-2" // Reduced vertical padding (py-2)
      style={{
        background: "linear-gradient(90deg, #ff7043 0%, #ffcc33 100%)",
        // Removed red border on top by omitting borderTop
        color: "#ffffff",
        fontFamily: "'Quicksand', 'Segoe UI', sans-serif",
        letterSpacing: "0.5px",
      }}
    >
      <div className="container text-center">
        {/* Food Emoji */}
        <div className="mb-2">
          <span style={{ fontSize: "2rem" }} role="img" aria-label="food">
            🍕🍔🍟🍜
          </span>
        </div>

        {/* Brand Name */}
        <h5
          className="fw-bold mb-2"
          style={{
            fontFamily: "'Pacifico', cursive",
            color: "#ffffff",
            textShadow: "1px 1px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          Foodie Haven
        </h5>

        {/* Tagline */}
        <p
          className="mb-2"
          style={{
            color: "#ffffff",
            fontWeight: 500,
            fontSize: "0.95rem",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
          }}
        >
          Satisfy your cravings, one click at a time!
        </p>

        {/* Social Media Links */}
        <div className="mb-2">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 text-decoration-none"
            style={{
              color: "#ffffff",
              fontSize: "1.4rem",
              transition: "color 0.3s",
            }}
          >
            <i className="bi bi-facebook"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 text-decoration-none"
            style={{
              color: "#ffffff",
              fontSize: "1.4rem",
              transition: "color 0.3s",
            }}
          >
            <i className="bi bi-instagram"></i>
          </a>
          <a
            href="mailto:support@foodiehaven.com"
            className="mx-2 text-decoration-none"
            style={{
              color: "#ffffff",
              fontSize: "1.4rem",
              transition: "color 0.3s",
            }}
          >
            <i className="bi bi-envelope"></i>
          </a>
        </div>

        {/* Copyright */}
        <div
          style={{
            fontSize: "0.85rem",
            color: "#ffe0b2",
          }}
        >
          &copy; {new Date().getFullYear()} Foodie Haven. All rights reserved.
        </div>
      </div>
    </footer>
  );
}