import axios from "../axios";

export const getCompanyUserPackagesRequest = (userId) =>
  axios.get(`/companies/user/${userId}/packages`);

export const createPackageForUserRequest = (companyId, userId, packageData) =>
  axios.post(`/companies/${companyId}/users/${userId}/packages`, packageData);

export const updateEmployeePackageRequest = (companyId, userId, packageId, packageData) =>
  axios.put(`/companies/${companyId}/users/${userId}/packages/${packageId}`, packageData);

export const deletePackageForUserRequest = (companyId, userId, packageId) =>
  axios.delete(`/companies/${companyId}/users/${userId}/packages/${packageId}`);

export const getCompanyUserPackageByIdRequest = (companyId, userId, packageId) =>
  axios.get(`/companies/${companyId}/users/${userId}/packages/${packageId}`);
