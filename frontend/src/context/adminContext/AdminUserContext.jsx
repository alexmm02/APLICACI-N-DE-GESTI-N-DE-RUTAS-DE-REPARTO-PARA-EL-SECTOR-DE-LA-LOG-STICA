import { createContext, useState, useContext } from "react";
import {
  getAllUsersRequest,
  getUserByIdRequest,
  updateUserRequest,
  deleteUserRequest,
} from "../../api/adminApi/adminUsers.api";

const AdminUserContext = createContext();

export const useAdminUsers = () => {
  const context = useContext(AdminUserContext);
  if (!context) {
    throw new Error("useAdminUsers must be used within an AdminUserProvider");
  }
  return context;
};

export const AdminUserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);

  const loadUsers = async () => {
    try {
      const res = await getAllUsersRequest();
      setUsers(res.data);
    } catch (error) {
      setErrors(["Failed to load users"]);
    }
  };

  const loadUser = async (userId) => {
    try {
      const res = await getUserByIdRequest(userId);
      setUser(res.data);
    } catch (error) {
      setErrors(["Failed to load user details"]);
    }
  };

  const getUserById = async (id) => {
    try {
      const res = await getUserByIdRequest(id);
      return res.data;
    } catch (error) {
      setErrors(["Failed to get user"]);
      throw error;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      await updateUserRequest(id, userData);
      setUsers(users.map((u) => (u.id === id ? { ...u, ...userData } : u)));
    } catch (error) {
      setErrors(["Failed to update user"]);
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteUserRequest(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      setErrors(["Failed to delete user"]);
    }
  };

  return (
    <AdminUserContext.Provider
      value={{
        users,
        user,
        loadUsers,
        getUserById,
        loadUser,
        updateUser,
        deleteUser,
        errors,
      }}
    >
      {children}
    </AdminUserContext.Provider>
  );
};
