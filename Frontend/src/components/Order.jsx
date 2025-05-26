import React, { useRef } from "react";
import CashOnDeliveryMessage from "./CashOnDeliveryMessage";

const Order = ({ orderDetails }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Bill</title>
        </head>
        <body>${printContent.innerHTML}</body>
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
        <p><strong>Name:</strong> {orderDetails.name}</p>
        <p><strong>Phone:</strong> {orderDetails.phone}</p>
        <p><strong>Address:</strong> {orderDetails.address}</p>
        <hr />
        <h3 className="text-success">Total: Rs {orderDetails.total.toFixed(2)}</h3>
      </div>
      <div className="text-center mt-4">
        <button className="btn btn-success btn-lg px-5" onClick={handlePrint}>
          <i className="bi bi-printer me-2"></i>Print Bill
        </button>
      </div>
    </div>
  );
};

export default Order;
