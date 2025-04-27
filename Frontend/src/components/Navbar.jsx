import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate(); // Get the navigate function
  const path = location.pathname;

  // Check for buyer login (use 'buyer' key for cart/session)
  const isLoggedIn = localStorage.getItem("buyer") !== null;
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
  const showEditProfile = path === "/your-restaurant";

  const [showEdit, setShowEdit] = useState(false); // Add this state

  const handleSignOut = () => {
    localStorage.removeItem("buyer");
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
            </>
          )}

          {showOnlyHome && (
            <>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/home">
                  🏠 Home
                </Link>
              </li>
              {isLoggedIn && (
                <li className="nav-item">
                  <button className="btn btn-light" onClick={handleSignOut}>
                    🚪 Sign Out
                  </button>
                </li>
              )}
            </>
          )}

          {/* Show Edit Profile only on /your-restaurant */}
          {showEditProfile && (
            <li className="nav-item">
              <button
                className="btn btn-outline-warning ms-2"
                onClick={() => setShowEdit(true)}
              >
                ✏️ Edit Profile
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <EditProfileModal setShowEdit={setShowEdit} navigate={navigate} /> {/* Pass navigate */}
            </div>
          </div>
        </div>
      )}

      {/* Custom Mobile Dropdown */}
      {isMenuOpen && (
        <div
          className="position-absolute top-100 start-0 w-100 bg-white shadow-lg rounded-bottom p-3 d-lg-none"
          style={{ zIndex: 1000 }}
        >
          <ul className="list-unstyled mb-0">
            {showFullNav && (
              <>
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
              </>
            )}

            {showOnlyHome && (
              <>
                <li>
                  <Link className="dropdown-item fw-semibold" to="/home" onClick={() => setIsMenuOpen(false)}>
                    🏠 Home
                  </Link>
                </li>
                {isLoggedIn && (
                  <li>
                    <button className="dropdown-item fw-semibold" onClick={handleSignOut}>
                      🚪 Sign Out
                    </button>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

// You can place this inside Navbar.jsx or in a separate file and import it
function EditProfileModal({ setShowEdit, navigate }) { // Receive navigate prop
  const stored = sessionStorage.getItem('restaurant');
  const restaurant = stored ? JSON.parse(stored) : { name: '', image: '', loginTime: 0 };
  const [editData, setEditData] = useState({ name: restaurant.name, image: restaurant.image });
  const [actionMsg, setActionMsg] = useState('');

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      await fetch(`http://localhost:3000/api/restaurants/${restaurant.name}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editData.name, image: editData.image }),
      });
      // Update sessionStorage
      const updated = { ...restaurant, name: editData.name, image: editData.image };
      sessionStorage.setItem('restaurant', JSON.stringify({ ...updated, loginTime: restaurant.loginTime }));
      setActionMsg('Profile updated!');
      setTimeout(() => setShowEdit(false), 1000);
    } catch {
      setActionMsg('Failed to update profile');
    }
  };

  const handleDeleteRestaurant = async () => {
    if (!window.confirm('Are you sure you want to delete your restaurant? This cannot be undone.')) return;
    try {
      await fetch(`http://localhost:3000/api/restaurants/${restaurant.name}`, { method: 'DELETE' });
      sessionStorage.removeItem('restaurant');
      navigate('/your-restaurant-auth'); // Use navigate for redirection
    } catch {
      setActionMsg('Failed to delete restaurant');
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('restaurant');
    navigate('/your-restaurant-auth'); // Use navigate for redirection
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
