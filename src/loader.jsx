import React, { createContext, useContext, useState } from "react";

// Create Context
const LoadingContext = createContext();

// Provider Component
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom Hook to Use Loading Context
export const useLoading = () => useContext(LoadingContext);
