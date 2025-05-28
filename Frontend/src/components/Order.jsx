import React, { useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom"; // Import Link for navigation
import CashOnDeliveryMessage from "./CashOnDeliveryMessage";

const Order = () => {
  const { state: orderDetails } = useLocation(); // Retrieve orderDetails from state
  const printRef = useRef();
  const navigate = useNavigate();

  // Handle missing orderDetails
  if (!orderDetails) {
    return (
      <div className="container py-5">
        <h2 className="text-center text-danger mb-4">
          <i className="bi bi-x-circle-fill me-2 text-danger"></i> No Order Details Found
        </h2>
        <p className="text-center">Please place an order first.</p>
      </div>
    );
  }

  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Bill</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header img {
              max-width: 100px;
              margin-bottom: 10px;
            }
            .header h1 {
              font-size: 24px;
              margin: 0;
            }
            .content {
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="https://via.placeholder.com/100" alt="Website Logo" />
            <h1>Foodie Haven</h1>
          </div>
          <div class="content">
            ${printContent.innerHTML}
          </div>
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
      <CashOnDeliveryMessage />
      <div className="card p-4 shadow-lg rounded-4 border-0" ref={printRef}>
        <h3 className="text-primary mb-3">Order Details:</h3>
        <p><strong>Order ID:</strong> {orderDetails.id || orderDetails.order_id || "N/A"}</p>
        <p><strong>Name:</strong> {orderDetails.buyer_name || orderDetails.name || "N/A"}</p>
        <p><strong>Phone:</strong> {orderDetails.contact || orderDetails.phone || "N/A"}</p>
        <p><strong>Address:</strong> {orderDetails.address}</p>
        <p><strong>Restaurant:</strong> {orderDetails.restaurantName}</p>
        <p>
          <strong>Date & Time:</strong>{" "}
          {orderDetails.created_at
            ? new Date(orderDetails.created_at).toLocaleString()
            : new Date().toLocaleString()}
        </p>
        <hr />
        <h3 className="text-success">Total: Rs {Number(orderDetails.total).toFixed(2)}</h3>
        <hr />
        <p className="text-center text-muted mt-3">
          <i className="bi bi-truck me-2"></i>
          <strong>Your order will be delivered soon. Thank you for trusting us!</strong>
        </p>
      </div>
      <div className="text-center mt-4">
        <button className="btn btn-success btn-lg px-5" onClick={handlePrint}>
          <i className="bi bi-printer me-2"></i>Print Bill
        </button>
      </div>
      <p className="text-center text-muted mt-4">
        <i className="bi bi-heart-fill me-2 text-danger"></i>
        <strong>We hope you enjoyed ordering with us! Feel free to explore more delicious options.</strong>
      </p>
      <div className="text-center mt-3">
        <Link to="/" className="btn btn-primary btn-lg px-5">
          <i className="bi bi-house-door me-2"></i>Craving more delicious food? Explore our menu and order again!
        </Link>
      </div>
    </div>
  );
};

export default Order;
