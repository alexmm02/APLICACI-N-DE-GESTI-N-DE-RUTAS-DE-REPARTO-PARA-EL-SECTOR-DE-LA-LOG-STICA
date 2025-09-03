import axios from "./axios";

export const getUserRoutesRequest = async () => axios.get("/routes");

export const getRoutePackagesRequest = async (routeId) =>
  axios.get(`/routes/${routeId}/packages`);

export const createRouteRequest = async (routeData) =>
  axios.post("/routes", routeData);

export const deleteRouteRequest = async (routeId) =>
  axios.delete(`/routes/${routeId}`);

export const updateRouteStatusRequest = async (routeId, status) =>
  axios.patch(`/routes/${routeId}/status`, { status }); // ✅ Ojo, es PATCH

export const getRouteRequest = async (routeId) =>
  axios.get(`/routes/${routeId}`);

export const updateRouteRequest = async (routeId, routeData) =>
  axios.put(`/routes/${routeId}`, routeData);

export const getRouteNameRequest = async (routeId) =>
  axios.get(`/routes/${routeId}/name`);