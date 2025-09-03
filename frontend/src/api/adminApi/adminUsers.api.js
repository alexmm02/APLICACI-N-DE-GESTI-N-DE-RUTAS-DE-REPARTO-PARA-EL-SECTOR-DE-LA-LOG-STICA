import axios from "../axios"

export const getAllUsersRequest = async () => {
  return await axios.get("/admin/users");
};

export const getUserByIdRequest = async (userId) => {
  return await axios.get(`/admin/users/${userId}`);
};

export const updateUserRequest = async (userId, userData) => {
  return await axios.put(`/admin/users/${userId}`, userData);
};

export const deleteUserRequest = async (userId) => {
  return await axios.delete(`/admin/users/${userId}`);
};
