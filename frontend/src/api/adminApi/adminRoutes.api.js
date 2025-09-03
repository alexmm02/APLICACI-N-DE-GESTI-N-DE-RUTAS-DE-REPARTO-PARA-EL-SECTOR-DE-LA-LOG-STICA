import axios from "../axios"

export const getAllRoutesRequest = () => axios.get("/admin/routes");

export const getRouteByIdRequest = (id) => axios.get(`/admin/routes/${id}`);

export const getRoutePackagesRequest = (id) => axios.get(`/admin/routes/${id}/packages`);

export const updateRouteStatusRequest = (id, status) =>
  axios.put(`/admin/routes/${id}`, { status });

export const adminUpdateRouteRequest = (id, routeData) =>
  axios.put(`/admin/routes-ad/${id}`, routeData);

export const adminCreateRouteRequest = (userId, routeData) =>
  axios.post(`/admin/users/${userId}/routes`, routeData);

export const deleteRouteRequest = (id) => axios.delete(`/admin/routes/${id}`);

export const getUserRoutesRequest = (userId) =>
  axios.get(`/admin/users/${userId}/routes`);
