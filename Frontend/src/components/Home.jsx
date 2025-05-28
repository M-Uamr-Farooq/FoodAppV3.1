import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });

  // --- New states for Order Now modal ---
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderItem, setOrderItem] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

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

  // --- New: Handle Order Now ---
  const handleOrderNow = (item) => {
    const buyer = JSON.parse(localStorage.getItem("buyer"));
    if (!buyer) {
      setPopup({
        show: true,
        type: 'warning',
        message: 'Please log in to order.'
      });
      return;
    }
    setOrderItem(item);
    setShowOrderModal(true);
    setName(buyer.name || "");
    setPhone("");
    setAddress("");
  };

  const handleOrderNowSubmit = async () => {
    if (!name || !phone || !address) {
      alert('Please fill in all the details.');
      return;
    }
    if (!orderItem) {
      alert('No item selected.');
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      buyer_name: name,
      address,
      contact: phone,
      total: Number(orderItem.price),
      status: 'Placed',
      restaurantName: orderItem.restaurant_name || "Unknown Restaurant",
    };

    try {
      const res = await fetch('http://localhost:3000/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error('Server error. Please try again.');
      }

      if (res.ok) {
        alert(data.message || 'Order placed successfully!');
        setShowOrderModal(false);
        setOrderItem(null);
        setName('');
        setPhone('');
        setAddress('');
        // Pass all order details to Order.jsx
        navigate('/order', { state: { ...orderData, ...data } });
      } else {
        alert(data.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Error placing order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Order Now Modal */}
      {showOrderModal && orderItem && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content rounded-4">
              <div className="modal-header border-0">
                <h5 className="modal-title">
                  <i className="bi bi-person-lines-fill me-2"></i>
                  Order: {orderItem.item_name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowOrderModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone Number</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Delivery Address</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Full Address"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Total</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={`Rs ${Number(orderItem.price).toFixed(2)}`}
                    disabled
                  />
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowOrderModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-4"
                  onClick={handleOrderNowSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Placing...
                    </>
                  ) : (
                    "Order Now"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
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
            <div key={idx} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div
                className="card h-100 shadow-lg border-0 menu-item-card"
                style={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #fffbe7 60%, #ffe0e0 100%)",
                  boxShadow: "0 8px 16px rgba(255, 111, 97, 0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 24px rgba(255, 111, 97, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(255, 111, 97, 0.08)";
                }}
              >
                <img
                  src={item.image}
                  className="card-img-top"
                  alt={item.item_name}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "10px 10px 0 0",
                    borderBottom: "2px solid #ffcc33",
                  }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title text-primary mb-1" style={{ fontWeight: 700 }}>
                    {item.item_name}
                  </h5>
                  <p className="text-muted mb-1" style={{ fontSize: "0.95rem" }}>
                    by <strong>{item.restaurant_name}</strong>
                  </p>
                  <p className="text-success fw-bold mb-3" style={{ fontSize: "1.1rem" }}>
                    Rs {Number(item.price).toFixed(2)}
                  </p>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-danger btn-sm px-3"
                      onClick={() => handleAddToCart(item)}
                      style={{ fontSize: "0.92rem", borderRadius: "20px" }}
                    >
                      <i className="bi bi-cart-plus me-1"></i>Cart
                    </button>
                    <button
                      className="btn btn-success btn-sm px-3"
                      onClick={() => handleOrderNow(item)}
                      style={{ fontSize: "0.92rem", borderRadius: "20px" }}
                    >
                      <i className="bi bi-bag-check me-1"></i>Order Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}