import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Delivered = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeliveries = async () => {
      const stored = sessionStorage.getItem('restaurant');
      if (!stored) return;

      const { name } = JSON.parse(stored);

      try {
        const res = await axios.get(`http://localhost:3000/api/deliveries/${encodeURIComponent(name)}`);
        setDeliveries(res.data);
      } catch (err) {
        console.error('Failed to fetch deliveries:', err);
        setError('Failed to fetch deliveries.');
      }

      setIsLoading(false);
    };

    fetchDeliveries();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 text-success">
        <i className="bi bi-truck me-2"></i>
        Delivered Orders
      </h2>
      {error && <div className="alert alert-danger text-center">{error}</div>}
      {deliveries.length === 0 ? (
        <div className="alert alert-info text-center">No delivered orders yet.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {deliveries.map((delivery, idx) => (
            <div key={delivery.id || idx} className="col">
              <div className="card border-0 shadow-sm h-100 rounded-3">
                <div className="card-body">
                  <h5 className="card-title text-primary">{delivery.buyer_name}</h5>
                  <p><strong>Address:</strong> {delivery.address}</p>
                  <p><strong>Phone:</strong> {delivery.contact}</p>
                  <p><strong>Total:</strong> Rs {delivery.total}</p>
                  <p><strong>Delivery Person:</strong> {delivery.delivery_person}</p>
                  <p><strong>Delivery Time:</strong> {new Date(delivery.delivery_time).toLocaleString()}</p>
                  <span className="badge bg-success">{delivery.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Delivered;