import axios from "../axios"

export const getAllAdminPackagesRequest = async () => {
  return await axios.get("/admin/packages");
};

export const getAdminUserPackagesRequest = async (userId) => {
  return await axios.get(`/admin/users/${userId}/packages`);
};

export const getAdminPackageRequest = async (id) => {
  return await axios.get(`/admin/packages/${id}`);
};

export const createAdminPackageRequest = async (userId, packageData) => {
  return await axios.post(`/admin/users/${userId}/packages`, packageData);
};

export const updateAdminPackageRequest = async (id, packageData) => {
  return await axios.put(`/admin/packages/${id}`, packageData);
};

export const deleteAdminPackageRequest = async (id) => {
  return await axios.delete(`/admin/packages/${id}`);
};
