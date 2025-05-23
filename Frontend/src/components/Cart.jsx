import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const buyer = JSON.parse(localStorage.getItem('buyer'));
  const cartKey = buyer ? `cartItems_${buyer.email}` : 'cartItems_guest';
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

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

    const orderData = {
      name,
      phone,
      address,
      time: new Date().toLocaleString(),
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
        // Pass orderData to Order page using state
        navigate('/order', { state: orderData });
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (err) {
      alert('Error placing order. Please try again.');
    }
  };

  const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div className="container py-5">
      <h2 className="text-center text-danger mb-4">🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="alert alert-warning text-center">Your cart is empty.</div>
      ) : (
        <div className="row g-4">
          {cartItems.map((item, idx) => (
            <div key={idx} className="col-lg-4 col-md-6 col-sm-12">
              <div className="card h-100 shadow-lg border-0">
                <img src={item.image} className="card-img-top" alt={item.item_name}
                  style={{ height: "200px", objectFit: "cover", borderRadius: "10px 10px 0 0" }} />
                <div className="card-body text-center">
                  <h5 className="card-title text-primary">{item.item_name}</h5>
                  <p className="text-muted mb-1">by <strong>{item.restaurant_name}</strong></p>
                  <p className="text-success fw-bold mb-3">
                    Rs {Number(item.price).toFixed(2)}
                  </p>
                  <button className="btn btn-outline-danger w-100" onClick={() => handleRemove(idx)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {cartItems.length > 0 && (
        <div className="mt-5 text-center">
          <h4 className="text-warning">Total: Rs {total.toFixed(2)}</h4>
          <button className="btn btn-success btn-lg mt-3" onClick={handleOrder}>
            Order Now
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter Your Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Delivery Address</label>
                  <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleOrderSubmit}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
