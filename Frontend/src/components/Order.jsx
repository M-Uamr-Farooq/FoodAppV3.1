import React, { useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import CashOnDeliveryMessage from "./CashOnDeliveryMessage";

const Order = () => {
  const { state: orderDetails } = useLocation();
  const printRef = useRef();
  const navigate = useNavigate();

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

  // Prefer id/order_id, fallback to status if not present
  const orderId =
    orderDetails.id ||
    orderDetails.order_id ||
    orderDetails.status ||
    "N/A";

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
              max-width: 80px;
              margin-bottom: 10px;
            }
            .header h1 {
              font-size: 22px;
              margin: 0;
            }
            .content {
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="https://via.placeholder.com/80" alt="Website Logo" />
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
    <div className="container py-4">
      <h2 className="text-center text-success mb-3" style={{ fontSize: "1.2rem" }}>
        <i className="bi bi-check-circle-fill me-2 text-success"></i>Order Confirmed!
      </h2>
      <CashOnDeliveryMessage />
      <div
        className="card mx-auto p-3 shadow-sm rounded-4 border-0"
        ref={printRef}
        style={{
          maxWidth: 320,
          fontSize: "0.97rem",
          background: "linear-gradient(135deg, #fffbe7 60%, #ffe0e0 100%)",
        }}
      >
        <h5 className="text-primary mb-2" style={{ fontWeight: 700, fontSize: "1.08rem" }}>
          Order Details
        </h5>
        <div className="mb-1">
          <span className="fw-semibold">Order ID:</span> {orderId}
        </div>
        <div className="mb-1">
          <span className="fw-semibold">Name:</span> {orderDetails.buyer_name || orderDetails.name || "N/A"}
        </div>
        <div className="mb-1">
          <span className="fw-semibold">Phone:</span> {orderDetails.contact || orderDetails.phone || "N/A"}
        </div>
        <div className="mb-1">
          <span className="fw-semibold">Address:</span> {orderDetails.address}
        </div>
        <div className="mb-1">
          <span className="fw-semibold">Restaurant:</span> {orderDetails.restaurantName}
        </div>
        <div className="mb-1">
          <span className="fw-semibold">Date & Time:</span>{" "}
          {orderDetails.created_at
            ? new Date(orderDetails.created_at).toLocaleString()
            : new Date().toLocaleString()}
        </div>
        <hr className="my-2" />
        <div className="mb-1 text-success" style={{ fontSize: "1.05rem", fontWeight: 600 }}>
          Total: Rs {Number(orderDetails.total).toFixed(2)}
        </div>
        <div className="text-center text-muted mt-2" style={{ fontSize: "0.93rem" }}>
          <i className="bi bi-truck me-1"></i>
          Your order will be delivered soon!
        </div>
      </div>
      <div className="text-center mt-3">
        <button className="btn btn-outline-success btn-sm px-4 me-2" onClick={handlePrint}>
          <i className="bi bi-printer me-1"></i>Print Bill
        </button>
        <Link to="/" className="btn btn-primary btn-sm px-4">
          <i className="bi bi-house-door me-1"></i>Order Again
        </Link>
      </div>
      <p className="text-center text-muted mt-3" style={{ fontSize: "0.93rem" }}>
        <i className="bi bi-heart-fill me-1 text-danger"></i>
        Thank you for choosing Foodie Haven!
      </p>
    </div>
  );
};

export default Order;
