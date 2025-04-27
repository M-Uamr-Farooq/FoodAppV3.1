import React from 'react';
import { useLocation } from 'react-router-dom';

const Order = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const name = params.get('name');
  const phone = params.get('phone');
  const address = params.get('address');
  const items = params.getAll('items').map(item => JSON.parse(item));

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
