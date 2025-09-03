import axios from "./axios";

export const getAllPackagesRequest = () => axios.get("/packages");

export const createPackageRequest = (packageData) => axios.post("/packages", packageData);

export const deletePackageRequest = (id) => axios.delete(`/packages/${id}`);

export const getPackageRequest = (id) => axios.get(`/packages/${id}`);

export const updatePackageRequest = (id, packageData) => axios.put(`/packages/${id}`, packageData);

export const markPackageAsDeliveredRequest = (id) => axios.put(`/packages/${id}/delivered`);
  
export const unmarkPackageAsDeliveredRequest = (id) => axios.put(`/packages/${id}/unmark-delivered`);
  