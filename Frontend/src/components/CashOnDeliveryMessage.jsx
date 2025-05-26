import React from "react";

const CashOnDeliveryMessage = () => {
  return (
    <div
      className="alert alert-success d-flex align-items-center justify-content-between p-4 rounded-3 shadow-sm"
      style={{
        background: "linear-gradient(90deg, #28a745, #218838)",
        color: "#fff",
        fontFamily: "'Quicksand', sans-serif",
      }}
    >
      <div>
        <h5 className="fw-bold mb-2">
          <i className="bi bi-cash-coin me-2"></i> Cash on Delivery Available!
        </h5>
        <p className="mb-0" style={{ fontSize: "0.95rem" }}>
          Enjoy the convenience of paying for your order when it arrives at your
          doorstep. No online payment required!
        </p>
        <p className="mb-0" style={{ fontSize: "0.95rem" }}>
          Place your order now and pay in cash upon delivery.
        </p>
      </div>
      <div>
        <i
          className="bi bi-wallet2"
          style={{
            fontSize: "3rem",
            color: "#fff",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        ></i>
      </div>
    </div>
  );
};

export default CashOnDeliveryMessage;