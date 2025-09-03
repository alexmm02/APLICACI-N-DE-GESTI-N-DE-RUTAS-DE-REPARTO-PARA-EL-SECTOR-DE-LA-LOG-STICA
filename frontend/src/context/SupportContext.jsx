import { createContext, useState, useContext } from "react";
import { createSupportMessageRequest } from "../api/support.api";

const SupportContext = createContext();

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error("useSupport must be used within a SupportProvider");
  }
  return context;
};

export const SupportProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  const sendSupportMessage = async (messageData) => {
    try {
      await createSupportMessageRequest(messageData);
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Failed to send support message",
      ]);
    }
  };

  return (
    <SupportContext.Provider value={{ sendSupportMessage, errors }}>
      {children}
    </SupportContext.Provider>
  );
};
