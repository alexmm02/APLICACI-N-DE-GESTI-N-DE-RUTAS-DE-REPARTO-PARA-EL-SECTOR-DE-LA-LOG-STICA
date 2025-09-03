import { createContext, useState, useContext } from "react";
import {
  getAllRoutesRequest,
  getRouteByIdRequest,
  updateRouteStatusRequest,
  deleteRouteRequest,
  getRoutePackagesRequest,
  adminUpdateRouteRequest,
  adminCreateRouteRequest,
  getUserRoutesRequest,
} from "../../api/adminApi/adminRoutes.api";

const AdminRouteContext = createContext();

export const useAdminRoutes = () => {
  const context = useContext(AdminRouteContext);
  if (!context) {
    throw new Error("useAdminRoutes must be used within an AdminRouteProvider");
  }
  return context;
};

export const AdminRouteProvider = ({ children }) => {
  const [routes, setRoutes] = useState([]);
  const [userRoutes, setUserRoutes] = useState([]);
  const [route, setRoute] = useState(null);
  const [routePackages, setRoutePackages] = useState([]);
  const [errors, setErrors] = useState([]);

  const loadRoutes = async () => {
    try {
      const res = await getAllRoutesRequest();
      setRoutes(res.data);
    } catch (error) {
      setErrors(["Failed to load routes"]);
    }
  };

  const loadUserRoutes = async (userId) => {
    try {
      const res = await getUserRoutesRequest(userId);
      setUserRoutes(res.data);
    } catch (error) {
      setErrors(["Failed to load user's routes"]);
    }
  };

  const loadRoute = async (routeId) => {
    try {
      const res = await getRouteByIdRequest(routeId);
      setRoute(res.data);
    } catch (error) {
      setErrors(["Failed to load route details"]);
    }
  };

  const loadRoutePackages = async (routeId) => {
    try {
      const res = await getRoutePackagesRequest(routeId);
      setRoutePackages(res.data);
    } catch (error) {
      setErrors(["Failed to load route packages"]);
    }
  };

  const updateRouteStatus = async (id, status) => {
    try {
      await updateRouteStatusRequest(id, status);
      setRoutes((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch (error) {
      setErrors(["Failed to update route status"]);
    }
  };

  const updateRoute = async (id, routeData) => {
    try {
      const res = await adminUpdateRouteRequest(id, routeData);
      return res.data;
    } catch (error) {
      setErrors(["Failed to update route"]);
    }
  };

  const createRoute = async (userId, routeData) => {
    try {
      const res = await adminCreateRouteRequest(userId, routeData);
      return res.data;
    } catch (error) {
      setErrors(["Failed to create route"]);
    }
  };

  const deleteRoute = async (id) => {
    try {
      await deleteRouteRequest(id);
      setRoutes((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      setErrors(["Failed to delete route"]);
    }
  };

  return (
    <AdminRouteContext.Provider
      value={{
        routes,
        userRoutes,
        route,
        routePackages,
        loadRoutes,
        loadUserRoutes,
        loadRoute,
        loadRoutePackages,
        updateRouteStatus,
        updateRoute,
        createRoute,
        deleteRoute,
        errors,
      }}
    >
      {children}
    </AdminRouteContext.Provider>
  );
};
