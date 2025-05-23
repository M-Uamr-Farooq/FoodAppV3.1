import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem('restaurant');
    if (!stored) {
      navigate('/your-restaurant-auth');
      return;
    }
    const data = JSON.parse(stored);
    setRestaurant(data);

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `http://localhost:3000/api/orders/${encodeURIComponent(data.name)}`
        );
        setOrders(res.data);
      } catch {}
      setIsLoading(false);
    };
    fetchOrders();

    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [navigate, actionMsg]);

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Mark this order as dispatched and remove it?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/orders/${orderId}`);
      setOrders(orders.filter(order => order.id !== orderId));
      setActionMsg('Order removed!');
    } catch {
      setActionMsg('Failed to remove order');
    }
    setTimeout(() => setActionMsg(''), 2000);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 text-warning">
        <i className="bi bi-receipt-cutoff me-2"></i>
        Orders for {restaurant?.name}
      </h2>
      {actionMsg && (
        <div className="alert alert-info text-center">{actionMsg}</div>
      )}
      {orders.length === 0 ? (
        <div className="alert alert-info text-center">No orders yet.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {orders.map((order, idx) => (
            <div key={idx} className="col">
              <div className="card border-0 shadow-sm h-100 rounded-3">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-person-circle fs-4 text-primary me-2"></i>
                    <span className="fw-bold">{order.name}</span>
                  </div>
                  <div className="mb-1">
                    <i className="bi bi-geo-alt text-danger me-1"></i>
                    <strong>Address:</strong> {order.address}
                  </div>
                  <div className="mb-1">
                    <i className="bi bi-telephone text-success me-1"></i>
                    <strong>Phone:</strong> {order.phone}
                  </div>
                  <div className="mb-1">
                    <i className="bi bi-clock text-secondary me-1"></i>
                    <strong>Time:</strong> {order.time}
                  </div>
                  <div className="mt-2">
                    <strong>Items:</strong>
                    <ul className="mb-0">
                      {order.items.map((item, i) => (
                        <li key={i}>
                          <span className="badge bg-warning text-dark me-2">{item.item_name}</span>
                          <span className="text-success">Rs {item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    className="btn btn-outline-danger btn-sm mt-3 w-100"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    <i className="bi bi-check2-circle me-1"></i>
                    Mark as Dispatched & Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders;