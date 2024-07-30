import React from "react";

const LoadingSpinner: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div className="border-t-4 border-b-4 border-indigo-600 w-16 h-16 border-solid rounded-full animate-spin"></div>
  </div>
);

export default LoadingSpinner;
