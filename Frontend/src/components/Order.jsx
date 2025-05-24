import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state;
  const printRef = useRef(); // Ref for the bill section

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

  // Get current date and time
  const currentDateTime = new Date().toLocaleString();

  const handlePrint = () => {
    const printContent = printRef.current; // Get the bill section
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Bill</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .text-primary { color: #007bff; }
            .text-success { color: #28a745; }
            .text-muted { color: #6c757d; }
            h3 { margin-bottom: 10px; }
            hr { border: 1px solid #ddd; margin: 20px 0; }
            .date-time { font-size: 0.9rem; color: #6c757d; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="date-time">Generated on: ${currentDateTime}</div>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-danger mb-4">
        <i className="bi bi-check-circle-fill me-2 text-success"></i> Order Confirmation
      </h2>
      <div className="card p-4 shadow-lg rounded-4 border-0" ref={printRef}>
        <h3 className="text-primary mb-3">Delivery Details:</h3>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Address:</strong> {address}</p>
        <hr />
        <h3 className="text-primary mb-3">Order Items:</h3>
        {items.map((item, idx) => (
          <div key={idx} className="mb-2">
            <p>
              <strong>{item.item_name}</strong> 
              <span className="text-muted"> by {item.restaurant_name}</span> 
              <span className="text-success"> - Rs {Number(item.price).toFixed(2)}</span>
            </p>
          </div>
        ))}
        <hr />
        <h3 className="text-success">Total: Rs {total.toFixed(2)}</h3>
        <p className="text-muted mt-3">Generated on: {currentDateTime}</p>
      </div>
      <div className="text-center mt-4">
        <button className="btn btn-success btn-lg px-5" onClick={handlePrint}>
          <i className="bi bi-printer me-2"></i> Print Bill
        </button>
      </div>
    </div>
  );
};

export default Order;
