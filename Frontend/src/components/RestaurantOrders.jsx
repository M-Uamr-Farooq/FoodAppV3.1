import  { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
        setOrders(res.data.filter((order) => order.status !== "dispatched"));
      } catch (err) {
        setError("Failed to fetch orders.");
      }
      setIsLoading(false);
    };
    fetchOrders();
  }, [navigate]);

  const handleMarkAsDispatched = async (orderId) => {
    try {
      // Optimistically remove the order from the UI
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));

      // Update the backend
      await axios.patch(`http://localhost:3000/api/orders/${orderId}`, {
        status: 'dispatched',
        deliveryPerson: 'John Doe', // Replace with actual delivery person
      });
    } catch (err) {
      console.error('Error updating order status:', err.response?.data || err.message);
      setError('Failed to update order status.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">
        <i className="bi bi-receipt-cutoff me-2"></i> Orders for Your Restaurant
      </h2>
      {error && <div className="alert alert-danger text-center">{error}</div>}
      {orders.length === 0 ? (
        <div className="alert alert-info text-center">No orders yet.</div>
      ) : (
        <div className="row g-4">
          {orders.map((order, idx) => (
            <div key={idx} className="col-lg-4 col-md-6 col-sm-12">
              <div
                className="card h-100 shadow border-0"
                style={{
                  borderRadius: "12px",
                  backgroundColor: "#f8f9fa",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
              >
                <div className="card-body">
                  <h5 className="card-title text-dark">{order.buyer_name}</h5>
                  <p className="text-muted">
                    <strong>Address:</strong> {order.address}
                  </p>
                  <p className="text-muted">
                    <strong>Phone:</strong> {order.phone}
                  </p>
                  <p className="text-muted">
                    <strong>Order Date:</strong> {new Date(order.created_at).toLocaleString()}
                  </p>
                  <p className="text-muted">
                    <strong>Total:</strong> Rs {order.total}
                  </p>
                  <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={() => handleMarkAsDispatched(order.id)}
                    style={{
                      backgroundColor: "#007bff",
                      borderColor: "#007bff",
                      color: "#fff",
                    }}
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