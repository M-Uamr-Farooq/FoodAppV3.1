import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state;

  if (!order) {
    // If accessed directly, redirect to home or show a message
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          No order found. <button className="btn btn-link" onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  const { name, phone, address, items } = order;
  const total = items.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div className="container py-5">
      <h2 className="text-center text-danger mb-4">Order Confirmation</h2>
      <div className="card p-4 shadow-lg">
        <h3>Delivery Details:</h3>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Address:</strong> {address}</p>
        <hr />
        <h3>Order Items:</h3>
        {items.map((item, idx) => (
          <div key={idx} className="mb-2">
            <p><strong>{item.item_name}</strong> by {item.restaurant_name} - Rs {Number(item.price).toFixed(2)}</p>
          </div>
        ))}
        <hr />
        <h3>Total: Rs {total.toFixed(2)}</h3>
        <button className="btn btn-success" onClick={() => window.print()}>Print Bill</button>
      </div>
    </div>
  );
};

export default Order;
