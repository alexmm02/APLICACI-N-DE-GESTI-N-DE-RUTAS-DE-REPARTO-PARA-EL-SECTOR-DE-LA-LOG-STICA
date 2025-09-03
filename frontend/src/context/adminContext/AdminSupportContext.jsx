import { createContext, useState, useContext } from "react";
import {
  getAllSupportMessagesRequest,
  getSupportMessageRequest,
  updateSupportMessageRequest,
  deleteSupportMessageRequest,
} from "../../api/adminApi/adminSupport.api";

const AdminSupportContext = createContext();

export const useAdminSupport = () => {
  const context = useContext(AdminSupportContext);
  if (!context) {
    throw new Error("useAdminSupport must be used within an AdminSupportProvider");
  }
  return context;
};

export const AdminSupportProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [errors, setErrors] = useState([]);

  const loadMessages = async () => {
    try {
      const res = await getAllSupportMessagesRequest();
      setMessages(res.data);
    } catch (error) {
      setErrors(["Failed to load support messages"]);
    }
  };

  const loadMessage = async (id) => {
    try {
      const res = await getSupportMessageRequest(id);
      return res.data;
    } catch (error) {
      setErrors(["Failed to load the support message"]);
    }
  };

  const updateMessage = async (id, message) => {
    try {
      const res = await updateSupportMessageRequest(id, message);
      return res.data;
    } catch (error) {
      setErrors(["Failed to update the message"]);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await deleteSupportMessageRequest(id);
      setMessages(messages.filter((msg) => msg.id !== id));
    } catch (error) {
      setErrors(["Failed to delete the support message"]);
    }
  };

  return (
    <AdminSupportContext.Provider
      value={{
        messages,
        loadMessages,
        loadMessage,
        updateMessage,
        deleteMessage,
        errors,
      }}
    >
      {children}
    </AdminSupportContext.Provider>
  );
};
