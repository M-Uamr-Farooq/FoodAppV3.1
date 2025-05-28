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
        const res = await axios.get(`http://localhost:3000/api/orders/${encodeURIComponent(name)}`);
        setDeliveries(res.data.filter((order) => order.status === 'dispatched'));
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
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-3">
          {deliveries.map((delivery, idx) => (
            <div key={delivery.id || idx} className="col">
              <div
                className="card border-0 shadow-sm h-100 rounded-3"
                style={{
                  backgroundColor: '#ffffff',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
              >
                <div className="card-body p-2">
                  <h6 className="card-title text-primary mb-2">{delivery.buyer_name}</h6>
                  <p className="mb-1" style={{ fontSize: '0.85rem' }}>
                    <strong>Address:</strong> {delivery.address}
                  </p>
                  <p className="mb-1" style={{ fontSize: '0.85rem' }}>
                    <strong>Phone:</strong> {delivery.contact}
                  </p>
                  <p className="mb-1" style={{ fontSize: '0.85rem' }}>
                    <strong>Total:</strong> Rs {delivery.total}
                  </p>
                  <p className="mb-1" style={{ fontSize: '0.85rem' }}>
                    <strong>Delivery Person:</strong> {delivery.delivery_person || 'N/A'}
                  </p>
                  <p className="mb-1" style={{ fontSize: '0.85rem' }}>
                    <strong>Delivery Time:</strong>{' '}
                    {delivery.delivery_time
                      ? new Date(delivery.delivery_time).toLocaleString()
                      : 'N/A'}
                  </p>
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