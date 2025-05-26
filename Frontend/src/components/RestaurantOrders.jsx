import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("restaurant");
    if (!stored) {
      navigate("/your-restaurant-auth");
      return;
    }
    const data = JSON.parse(stored);

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await axios.get(
          `http://localhost:3000/api/orders/${encodeURIComponent(data.name)}`
        );
        setOrders(res.data);
      } catch (err) {
        setError("Failed to fetch orders.");
      }
      setIsLoading(false);
    };
    fetchOrders();
  }, [navigate]);

  const handleMarkAsDispatched = async (orderId) => {
    if (!window.confirm("Mark this order as dispatched?")) return;
    try {
      await axios.patch(`http://localhost:3000/api/orders/${orderId}`, {
        status: "dispatched",
      });
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: "dispatched" } : order
        )
      );
      setActionMsg("Order marked as dispatched!");
    } catch {
      setActionMsg("Failed to update order status");
    }
    setTimeout(() => setActionMsg(""), 2000);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container py-5">
      <h2 className="text-center text-warning mb-4">
        <i className="bi bi-receipt-cutoff me-2"></i> Orders for Your Restaurant
      </h2>
      {actionMsg && (
        <div className="alert alert-info text-center">{actionMsg}</div>
      )}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      {orders.length === 0 ? (
        <div className="alert alert-info text-center">No orders yet.</div>
      ) : (
        <div className="row g-4">
          {orders.map((order, idx) => (
            <div key={idx} className="col-lg-4 col-md-6 col-sm-12">
              <div className="card h-100 shadow-lg border-0">
                <div className="card-body">
                  <h5 className="card-title text-primary">{order.buyer_name}</h5>
                  <p>
                    <strong>Address:</strong> {order.address}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.phone}
                  </p>
                  <p>
                    <strong>Total:</strong> Rs {order.total}
                  </p>
                  <button
                    className="btn btn-success w-100 mt-3"
                    onClick={() => handleMarkAsDispatched(order.id)}
                  >
                    <i className="bi bi-truck me-2"></i>Mark as Dispatched
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