import React from "react";

export default function Footer() {
  return (
    <footer
      className="footer mt-auto py-4"
      style={{
        background: "linear-gradient(90deg, #ff7043 0%, #ffcc33 100%)",
        borderTop: "4px solid #ff7043",
        color: "#ffffff",
        fontFamily: "'Quicksand', 'Segoe UI', sans-serif",
        letterSpacing: "0.5px",
        boxShadow: "0 -2px 12px rgba(255, 112, 67, 0.2)",
      }}
    >
      <div className="container text-center">
        {/* Food Emoji */}
        <div className="mb-3">
          <span style={{ fontSize: "2.5rem" }} role="img" aria-label="food">
            🍕🍔🍟🍜
          </span>
        </div>

        {/* Brand Name */}
        <h5
          className="fw-bold mb-3"
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
          className="mb-3"
          style={{
            color: "#ffffff",
            fontWeight: 500,
            fontSize: "1rem",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
          }}
        >
          Satisfy your cravings, one click at a time!
        </p>

        {/* Social Media Links */}
        <div className="mb-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-3 text-decoration-none"
            style={{
              color: "#ffffff",
              fontSize: "1.5rem",
              transition: "color 0.3s",
            }}
          >
            <i className="bi bi-facebook"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-3 text-decoration-none"
            style={{
              color: "#ffffff",
              fontSize: "1.5rem",
              transition: "color 0.3s",
            }}
          >
            <i className="bi bi-instagram"></i>
          </a>
          <a
            href="mailto:support@foodiehaven.com"
            className="mx-3 text-decoration-none"
            style={{
              color: "#ffffff",
              fontSize: "1.5rem",
              transition: "color 0.3s",
            }}
          >
            <i className="bi bi-envelope"></i>
          </a>
        </div>

        {/* Copyright */}
        <div
          style={{
            fontSize: "0.9rem",
            color: "#ffe0b2",
          }}
        >
          &copy; {new Date().getFullYear()} Foodie Haven. All rights reserved.
        </div>
      </div>
    </footer>
  );
}