import axios from "../axios";

export const getCompanyUserRoutesRequest = (userId) =>
  axios.get(`/companies/user/${userId}/routes`);

export const createRouteForUserRequest = (companyId, userId, data) =>
  axios.post(`/companies/${companyId}/users/${userId}/routes`, data);

export const updateEmployeeRouteRequest = (companyId, userId, routeId, data) =>
  axios.put(`/companies/${companyId}/users/${userId}/routes/${routeId}`, data);

export const deleteRouteForUserRequest = (companyId, userId, routeId) =>
  axios.delete(`/companies/${companyId}/users/${userId}/routes/${routeId}`);

export const getRouteByIdRequest = (companyId, userId, routeId) =>
  axios.get(`/companies/${companyId}/users/${userId}/routes/${routeId}`);

export const getRoutePackagesRequest = (companyId, userId, routeId) =>
  axios.get(`/companies/${companyId}/users/${userId}/routes/${routeId}/packages`);
