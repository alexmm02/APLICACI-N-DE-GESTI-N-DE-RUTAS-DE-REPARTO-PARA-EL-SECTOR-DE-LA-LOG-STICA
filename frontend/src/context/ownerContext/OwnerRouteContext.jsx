import { createContext, useState, useContext, useCallback } from "react";
import {
  getCompanyUserRoutesRequest,
  createRouteForUserRequest,
  updateEmployeeRouteRequest,
  deleteRouteForUserRequest,
  getRouteByIdRequest,
  getRoutePackagesRequest,
} from "../../api/ownerApi/ownerRoutes.api";

const OwnerRouteContext = createContext();

export const useOwnerRoutes = () => {
  const context = useContext(OwnerRouteContext);
  if (!context) {
    throw new Error("useOwnerRoutes must be used within an OwnerRouteProvider");
  }
  return context;
};

export const OwnerRouteProvider = ({ children }) => {
  const [routes, setRoutes] = useState([]);
  const [route, setRoute] = useState(null);
  const [routePackages, setRoutePackages] = useState([]);
  const [errors, setErrors] = useState([]);

  const loadUserRoutes = useCallback(async (userId) => {
    try {
      const res = await getCompanyUserRoutesRequest(userId);
      setRoutes(res.data);
    } catch (error) {
      console.error(error);
      setErrors(["Error loading user's routes"]);
    }
  }, []);

  const createRoute = useCallback(async (companyId, userId, routeData) => {
    try {
      const res = await createRouteForUserRequest(companyId, userId, routeData);
      setRoutes((prev) => [...prev, res.data]);
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors(["Error creating route"]);
    }
  }, []);

  const updateRoute = useCallback(async (companyId, userId, routeId, routeData) => {
    try {
      const res = await updateEmployeeRouteRequest(companyId, userId, routeId, routeData);
      setRoutes((prev) =>
        prev.map((r) => (r.id === routeId ? { ...r, ...res.data } : r))
      );
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors(["Error updating route"]);
    }
  }, []);

  const deleteRoute = useCallback(async (companyId, userId, routeId) => {
    try {
      await deleteRouteForUserRequest(companyId, userId, routeId);
      setRoutes((prev) => prev.filter((r) => r.id !== routeId));
    } catch (error) {
      console.error(error);
      setErrors(["Error deleting route"]);
    }
  }, []);

  const loadRouteById = useCallback(async (companyId, userId, routeId) => {
    try {
      const res = await getRouteByIdRequest(companyId, userId, routeId);
      setRoute(res.data);
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors(["Error loading route details"]);
    }
  }, []);

  const loadRoutePackages = useCallback(async (companyId, userId, routeId) => {
    try {
      const res = await getRoutePackagesRequest(companyId, userId, routeId);
      setRoutePackages(res.data);
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors(["Error loading route packages"]);
    }
  }, []);

  return (
    <OwnerRouteContext.Provider
      value={{
        routes,
        route,
        routePackages,
        errors,
        loadUserRoutes,
        createRoute,
        updateRoute,
        deleteRoute,
        loadRouteById,
        loadRoutePackages,
      }}
    >
      {children}
    </OwnerRouteContext.Provider>
  );
};
