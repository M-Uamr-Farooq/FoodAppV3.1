import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="spinner-border text-warning" role="status"></div>
    </div>
  );
};

export default LoadingSpinner;