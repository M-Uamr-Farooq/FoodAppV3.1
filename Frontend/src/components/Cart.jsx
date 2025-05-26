import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CashOnDeliveryMessage from "./CashOnDeliveryMessage";

const Cart = () => {
  const navigate = useNavigate();
  const buyer = JSON.parse(localStorage.getItem("buyer"));
  const cartKey = buyer ? `cartItems_${buyer.email}` : 'cartItems_guest';
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(cartKey);
    if (stored) setCartItems(JSON.parse(stored));
  }, [cartKey]);

  const handleRemove = (idx) => {
    const updated = cartItems.filter((_, i) => i !== idx);
    setCartItems(updated);
    localStorage.setItem(cartKey, JSON.stringify(updated));
  };

  const handleOrder = () => {
    setShowModal(true);
  };

  const handleOrderSubmit = async () => {
    if (!name || !phone || !address) {
      alert('Please fill in all the details.');
      return;
    }
    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

    const orderData = {
      buyer_name: name,
      buyer_email: "", // Always empty, not used
      address,
      contact: phone,
      total,
      items: cartItems,
      restaurantName: cartItems[0]?.restaurant_name || "",
    };

    try {
      const res = await fetch('http://localhost:3000/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        setShowModal(false);
        setCartItems([]);
        localStorage.removeItem(cartKey);
        navigate('/order', { state: orderData });
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      alert('Error placing order. Please try again.');
    }
    setIsSubmitting(false);
  };

  const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div className="container py-4">
      <h2 className="text-center text-warning mb-4">
        <i className="bi bi-cart me-2"></i>Your Cart
      </h2>
      <CashOnDeliveryMessage />
      {cartItems.length === 0 ? (
        <div className="alert alert-warning text-center shadow-sm rounded-3">
          <i className="bi bi-emoji-frown me-2"></i>Your cart is empty.
        </div>
      ) : (
        <div className="row g-4">
          {cartItems.map((item, idx) => (
            <div key={idx} className="col-lg-4 col-md-6 col-sm-12">
              <div className="card h-100 shadow-lg border-0">
                <img
                  src={item.image}
                  className="card-img-top"
                  alt={item.item_name}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title text-primary">{item.item_name}</h5>
                  <p className="text-success fw-bold mb-3 fs-5">
                    Rs {Number(item.price).toFixed(2)}
                  </p>
                  <button
                    className="btn btn-danger w-100 mb-2"
                    onClick={() => handleRemove(item.id)}
                  >
                    <i className="bi bi-trash me-2"></i>Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {cartItems.length > 0 && (
        <div className="mt-5 text-center">
          <h4 className="text-warning mb-3">
            <i className="bi bi-cash-coin me-2"></i>
            Total: <span className="fw-bold">Rs {total.toFixed(2)}</span>
          </h4>
          <button
            className="btn btn-success btn-lg px-5 shadow"
            style={{ borderRadius: "30px" }}
            onClick={handleOrder}
          >
            <i className="bi bi-bag-check me-2"></i>Order Now
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
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
                  Enter Your Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
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
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-4"
                  onClick={handleOrderSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Placing...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
