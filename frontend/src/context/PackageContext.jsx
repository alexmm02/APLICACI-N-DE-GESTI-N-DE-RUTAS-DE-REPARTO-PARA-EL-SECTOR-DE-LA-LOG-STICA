import { createContext, useState, useContext } from "react";
import {
  getAllPackagesRequest,
  deletePackageRequest,
  createPackageRequest,
  getPackageRequest,
  updatePackageRequest,
  markPackageAsDeliveredRequest,
  unmarkPackageAsDeliveredRequest,
} from "../api/packages.api";

const PackageContext = createContext();

export const usePackages = () => {
  const context = useContext(PackageContext);
  if (!context) {
    throw new Error("usePackages must be used within a PackageProvider");
  }
  return context;
};

export const PackageProvider = ({ children }) => {
  const [packages, setPackages] = useState([]);
  const [errors, setErrors] = useState([]);

  const loadPackages = async () => {
    try {
      const res = await getAllPackagesRequest();
      setPackages(res.data);
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Failed to load packages",
      ]);
    }
  };

  const loadPackage = async (id) => {
    try {
      const res = await getPackageRequest(id);
      return res.data;
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Failed to load package",
      ]);
    }
  };

  const createPackage = async (pack) => {
    try {
      const res = await createPackageRequest(pack);
      setPackages([...packages, res.data]);
      return res.data;
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Failed to create package",
      ]);
    }
  };

  const deletePackage = async (id) => {
    try {
      const res = await deletePackageRequest(id);
      if (res.status === 204) {
        setPackages(packages.filter((pack) => pack.id !== id));
      }
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Failed to delete package",
      ]);
    }
  };

  const updatePackage = async (id, pack) => {
    try {
      const res = await updatePackageRequest(id, pack);
      return res.data;
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Failed to update package",
      ]);
    }
  };

  const markPackageAsDelivered = async (id) => {
    try {
      const res = await markPackageAsDeliveredRequest(id);
      setPackages(
        packages.map((pack) =>
          pack.id === id ? { ...pack, delivered: true } : pack
        )
      );
      return res.data;
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Failed to mark package as delivered",
      ]);
    }
  };

  const unmarkPackageAsDelivered = async (id) => {
    try {
      const res = await unmarkPackageAsDeliveredRequest(id);
      return res.data;
    } catch (error) {
      setErrors([
        error.response?.data?.message || "Failed to unmark package as delivered",
      ]);
    }
  };

  return (
    <PackageContext.Provider
      value={{
        packages,
        loadPackages,
        deletePackage,
        createPackage,
        loadPackage,
        errors,
        updatePackage,
        markPackageAsDelivered,
        unmarkPackageAsDelivered,
      }}
    >
      {children}
    </PackageContext.Provider>
  );
};
