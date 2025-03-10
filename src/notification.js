import React, { createContext, useContext } from "react";
import { notification } from "antd";

// Create Context
const NotificationContext = createContext();

// Provider Component
export const NotificationProvider = ({ children }) => {
  const showNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight", // Change position if needed
    });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom Hook to Use Notification Context
export const useNotification = () => useContext(NotificationContext);
