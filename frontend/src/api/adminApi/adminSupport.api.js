import axios from "../axios"

export const getAllSupportMessagesRequest = () => axios.get("/admin/support");

export const getSupportMessageRequest = (id) => axios.get(`/admin/support/${id}`);

export const updateSupportMessageRequest = (id, data) => axios.put(`/admin/support/${id}`, data);

export const deleteSupportMessageRequest = (id) => axios.delete(`/admin/support/${id}`);
