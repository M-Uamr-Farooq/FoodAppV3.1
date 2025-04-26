import React, { useEffect, useState } from "react";

const Cart = () => {
  const buyer = JSON.parse(localStorage.getItem('buyer'));
  const cartKey = buyer ? `cartItems_${buyer.email}` : 'cartItems_guest';
  const [cartItems, setCartItems] = useState([]);

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
    // Save order to backend if needed, then redirect
    window.location.href = '/order';
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
                  <p className="text-success fw-bold mb-3">${Number(item.price).toFixed(2)}</p>
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
          <h4 className="text-warning">Total: ${total.toFixed(2)}</h4>
          <button className="btn btn-success btn-lg mt-3" onClick={handleOrder}>
            Order Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
