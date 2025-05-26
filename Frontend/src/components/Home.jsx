import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/menu");
        setMenuItems(res.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        alert("Failed to fetch menu items.");
      }
    };
    fetchMenuItems();
  }, []);

  const handleAddToCart = (item) => {
    const buyer = JSON.parse(localStorage.getItem("buyer"));

    if (!buyer) {
      setPopup({
        show: true,
        type: 'warning',
        message: 'Please log in to add items to your cart.'
      });
      return;
    }

    const cartKey = `cartItems_${buyer.email}`;
    const stored = localStorage.getItem(cartKey);
    const cartItems = stored ? JSON.parse(stored) : [];
    cartItems.push(item);
    localStorage.setItem(cartKey, JSON.stringify(cartItems));

    setPopup({
      show: true,
      type: 'success',
      message: `${item.item_name} has been added to your cart!`
    });
  };

  const closePopup = () => {
    setPopup({ show: false, type: '', message: '' });
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-danger mb-4">🍴 Explore Delicious Menus 🍴</h2>
      <p className="text-center text-muted mb-2">
        Discover mouth-watering dishes from the best restaurants in town. Let your cravings guide you!
      </p>
      <p
        className="text-center text-success mb-4"
        style={{ fontWeight: 500, fontSize: "1.1rem" }}
      >
        💸 Enjoy hassle-free <span style={{ color: "#ff9800" }}>Cash on Delivery</span> on every order!
      </p>

      {/* Search Bar */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control form-control-lg search-input shadow-none"
            placeholder="Hungry? Search for burgers, pizza, biryani..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Popup window */}
      {popup.show && (
        <>
          {/* Modal Backdrop */}
          <div className="modal-backdrop fade show"></div>

          {/* Modal */}
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="popupModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-md" role="document">
              <div className="modal-content border-0 shadow-lg">
                {/* Modal Header */}
                <div
                  className={`modal-header ${
                    popup.type === "success" ? "bg-success text-white" : "bg-warning text-white"
                  }`}
                  style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}
                >
                  <h5 className="modal-title" id="popupModalLabel">
                    {popup.type === "success" ? "🎉 Success!" : "🔒 Authentication Required"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    aria-label="Close"
                    onClick={closePopup}
                  ></button>
                </div>

                {/* Modal Body */}
                <div className="modal-body text-center">
                  {/* Icon */}
                  <div className="display-1 mb-3">
                    {popup.type === "success" ? "✅" : "⚠️"}
                  </div>

                  {/* Message */}
                  <p className="text-muted mb-4" style={{ fontSize: "1.1rem" }}>
                    {popup.type === "success"
                      ? `${popup.message}`
                      : "You need to sign in to add items to your cart. Please sign in to continue."}
                  </p>

                  {/* Buttons */}
                  <div className="d-flex justify-content-center gap-3">
                    {popup.type === "warning" ? (
                      <>
                        <button
                          onClick={() => {
                            closePopup();
                            window.location.href = "/buyer-signin";
                          }}
                          className="btn btn-primary px-4 py-2"
                        >
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Sign In
                        </button>
                        <button
                          onClick={closePopup}
                          className="btn btn-outline-secondary px-4 py-2 bg-danger "
                        >
                          <i className="bi bi-x-lg me-2 "></i>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={closePopup}
                        className="btn btn-success px-4 py-2"
                      >
                        <i className="bi bi-cart-check me-2"></i>
                        Continue Shopping
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="row g-4">
        {menuItems
          .filter(
            (item) =>
              !search ||
              item.item_name.toLowerCase().includes(search.toLowerCase()) ||
              item.restaurant_name.toLowerCase().includes(search.toLowerCase())
          )
          .map((item, idx) => (
            <div key={idx} className="col-lg-4 col-md-6 col-sm-12">
              <div
                className="card h-100 shadow-lg border-0 menu-item-card"
                style={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  borderRadius: "16px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 24px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(0, 0, 0, 0.1)";
                }}
              >
                <img
                  src={item.image}
                  className="card-img-top"
                  alt={item.item_name}
                  style={{
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "10px 10px 0 0",
                  }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title text-primary">{item.item_name}</h5>
                  <p className="text-muted mb-1">
                    by <strong>{item.restaurant_name}</strong>
                  </p>
                  <p className="text-success fw-bold mb-3">
                    Rs {Number(item.price).toFixed(2)}
                  </p>
                  <button
                    className="btn btn-danger w-100"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}