import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const isBuyer = !!localStorage.getItem("buyer");
  const isRestaurant = !!sessionStorage.getItem("restaurant");
  const [showEdit, setShowEdit] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [orderCount, setOrderCount] = useState(0);

  // Show full nav on home
  const showFullNav = path === "/home" || path === "/";
  // Show Home and Orders for restaurant dashboard and order pages
  const showRestaurantNav = [
    "/your-restaurant",
    "/order",
    "/restaurant-orders",
    "/cart",
  ].includes(path);

  // Fetch order count for restaurant
  useEffect(() => {
    if (isRestaurant) {
      const stored = sessionStorage.getItem("restaurant");
      if (stored) {
        const { name } = JSON.parse(stored);
        fetch(`http://localhost:3000/api/orders/${encodeURIComponent(name)}`)
          .then((res) => res.json())
          .then((data) => setOrderCount(Array.isArray(data) ? data.length : 0))
          .catch(() => setOrderCount(0));
      }
    }
  }, [isRestaurant, path]);

  const handleSignOut = () => {
    localStorage.removeItem("buyer");
    sessionStorage.removeItem("restaurant");
    navigate("/home");
    window.location.reload();
  };

  const handleMenuToggle = () => setIsMenuOpen((prev) => !prev);

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-custom shadow-sm">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-6" to="/home">
          <i className="bi bi-cup-straw me-1"></i> Foodie Haven
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          onClick={handleMenuToggle}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className={`collapse navbar-collapse${isMenuOpen ? " show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {showFullNav && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/register-restaurant" onClick={() => setIsMenuOpen(false)}>
                    <i className="bi bi-shop me-1"></i> Register Restaurant
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/your-restaurant-auth" onClick={() => setIsMenuOpen(false)}>
                    <i className="bi bi-pencil-square me-1"></i> Your Restaurant
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/cart" onClick={() => setIsMenuOpen(false)}>
                    <i className="bi bi-cart me-1"></i> Cart
                  </Link>
                </li>
                {!isBuyer ? (
                  <li className="nav-item">
                    <Link className="nav-link fw-semibold" to="/buyer-signin" onClick={() => setIsMenuOpen(false)}>
                      <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                    </Link>
                  </li>
                ) : (
                  <li className="nav-item">
                    <button className="btn custom-signout-btn" onClick={handleSignOut}>
                      <i className="bi bi-box-arrow-left me-1"></i> Sign Out
                    </button>
                  </li>
                )}
              </>
            )}

            {/* Only show Home, Your Restaurant, and Sign Out on /restaurant-orders */}
            {path === "/restaurant-orders" && isRestaurant && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/home" onClick={() => setIsMenuOpen(false)}>
                    <i className="bi bi-house-door me-1"></i> Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/your-restaurant" onClick={() => setIsMenuOpen(false)}>
                    <i className="bi bi-shop me-1"></i> Your Restaurant
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn custom-signout-btn ms-2" onClick={handleSignOut}>
                    <i className="bi bi-box-arrow-left me-1"></i> Sign Out
                  </button>
                </li>
              </>
            )}

            {/* Show restaurant nav for other pages except /restaurant-orders */}
            {showRestaurantNav && path !== "/restaurant-orders" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to="/home" onClick={() => setIsMenuOpen(false)}>
                    <i className="bi bi-house-door me-1"></i> Home
                  </Link>
                </li>
                {isRestaurant && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link fw-semibold position-relative" to="/restaurant-orders" onClick={() => setIsMenuOpen(false)}>
                        <i className="bi bi-receipt-cutoff me-1"></i> Orders
                        {orderCount > 0 && (
                          <span
                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {orderCount}
                            <span className="visually-hidden">unread orders</span>
                          </span>
                        )}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <button
                        className="btn custom-edit-btn ms-2"
                        onClick={() => {
                          setShowEdit(true);
                          setIsMenuOpen(false);
                        }}
                      >
                        <i className="bi bi-gear me-1"></i> Edit Profile
                      </button>
                    </li>
                  </>
                )}
                {(isBuyer || isRestaurant) && (
                  <li className="nav-item">
                    <button className="btn custom-signout-btn ms-2" onClick={handleSignOut}>
                      <i className="bi bi-box-arrow-left me-1"></i> Sign Out
                    </button>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <EditProfileModal setShowEdit={setShowEdit} navigate={navigate} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Edit Profile Modal
function EditProfileModal({ setShowEdit, navigate }) {
  const stored = sessionStorage.getItem("restaurant");
  const restaurant = stored ? JSON.parse(stored) : { name: "", image: "", loginTime: 0 };
  const [editData, setEditData] = useState({ name: restaurant.name, image: restaurant.image });
  const [actionMsg, setActionMsg] = useState("");

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      await fetch(`http://localhost:3000/api/restaurants/${restaurant.name}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editData.name, image: editData.image }),
      });
      const updated = { ...restaurant, name: editData.name, image: editData.image };
      sessionStorage.setItem("restaurant", JSON.stringify({ ...updated, loginTime: restaurant.loginTime }));
      setActionMsg("Profile updated!");
      setTimeout(() => setShowEdit(false), 1000);
    } catch {
      setActionMsg("Failed to update profile");
    }
  };

  const handleDeleteRestaurant = async () => {
    if (!window.confirm("Are you sure you want to delete your restaurant? This cannot be undone.")) return;
    try {
      await fetch(`http://localhost:3000/api/restaurants/${restaurant.name}`, { method: "DELETE" });
      sessionStorage.removeItem("restaurant");
      navigate("/your-restaurant-auth");
    } catch {
      setActionMsg("Failed to delete restaurant");
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("restaurant");
    navigate("/your-restaurant-auth");
  };

  return (
    <>
      <div className="modal-header">
        <h5 className="modal-title">Edit Profile</h5>
        <button type="button" className="btn-close" onClick={() => setShowEdit(false)}></button>
      </div>
      <div className="modal-body">
        <label className="form-label">Restaurant Name</label>
        <input
          type="text"
          className="form-control mb-3"
          name="name"
          value={editData.name}
          onChange={handleEditChange}
        />
        <label className="form-label">Image URL</label>
        <input
          type="text"
          className="form-control mb-3"
          name="image"
          value={editData.image}
          onChange={handleEditChange}
        />
      </div>
      <div className="modal-footer d-flex justify-content-between">
        <button className="btn btn-danger" onClick={handleDeleteRestaurant}>Delete Restaurant</button>
        <button className="btn btn-secondary" onClick={handleSignOut}>Sign Out</button>
        <button className="btn btn-success" onClick={handleEditSave}>Save</button>
      </div>
      {actionMsg && (
        <div className="alert alert-info text-center w-100">{actionMsg}</div>
      )}
    </>
  );
}
