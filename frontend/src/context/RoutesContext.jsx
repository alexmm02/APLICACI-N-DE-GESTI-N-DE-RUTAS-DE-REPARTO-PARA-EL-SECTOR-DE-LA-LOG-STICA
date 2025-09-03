import { createContext, useState, useContext } from "react";
import {
  getUserRoutesRequest,
  createRouteRequest,
  deleteRouteRequest,
  updateRouteStatusRequest,
  getRoutePackagesRequest,
  getRouteRequest,
  updateRouteRequest,
  getRouteNameRequest,
} from "../api/routes.api";

const RouteContext = createContext();

export const useRoutes = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error("useRoutes must be used within a RouteProvider");
  }
  return context;
};

export const RouteProvider = ({ children }) => {
  const [routes, setRoutes] = useState([]);
  const [errors, setErrors] = useState([]);

  const loadRoutes = async () => {
    try {
      const res = await getUserRoutesRequest();
      setRoutes(res.data);
    } catch (error) {
      setErrors(["Failed to fetch routes"]);
    }
  };

  const getRoutePackages = async (routeId) => {
    try {
      const res = await getRoutePackagesRequest(routeId);
      return res.data;
    } catch (error) {
      setErrors(["Failed to fetch route packages"]);
    }
  };

  const createRoute = async (route) => {
    try {
      const res = await createRouteRequest(route);
      setRoutes([...routes, res.data]);
      return res.data;
    } catch (error) {
      setErrors(["Failed to create route"]);
    }
  };

  const deleteRoute = async (id) => {
    try {
      await deleteRouteRequest(id);
      setRoutes(routes.filter((route) => route.id !== id));
    } catch (error) {
      setErrors(["Failed to delete route"]);
    }
  };

  const updateRouteStatus = async (id, status) => {
    try {
      await updateRouteStatusRequest(id, status);
      setRoutes(
        routes.map((route) => (route.id === id ? { ...route, status } : route))
      );
    } catch (error) {
      setErrors(["Failed to update route status"]);
    }
  };

  const loadRoute = async (id) => {
    try {
      const res = await getRouteRequest(id);
      return res.data;
    } catch (error) {
      setErrors(["Failed to load route"]);
    }
  };

  const updateRoute = async (id, route) => {
    try {
      const res = await updateRouteRequest(id, route);
      return res.data;
    } catch (error) {
      setErrors(["Failed to update route"]);
    }
  };

  const getRouteName = async (id) => {
    try {
      const res = await getRouteNameRequest(id);
      return res.data.name;
    } catch (error) {
      setErrors(["Failed to fetch route name"]);
    }
  };

  return (
    <RouteContext.Provider
      value={{
        routes,
        loadRoutes,
        createRoute,
        deleteRoute,
        updateRouteStatus,
        getRoutePackages,
        loadRoute,
        updateRoute,
        getRouteName,
        errors,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};
