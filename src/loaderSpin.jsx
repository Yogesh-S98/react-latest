import React from "react";
import { Spin } from "antd";
import { useLoading } from "./loader"; // Import Loading Context
import "./loaderSpin.css"; // Import CSS for styling

const FullScreenLoader = () => {
  const { loading } = useLoading(); // Get loading state

  if (!loading) return null; // Hide when not loading

  return (
    <div className="fullscreen-loader">
      <Spin size="large" />
    </div>
  );
};

export default FullScreenLoader;
