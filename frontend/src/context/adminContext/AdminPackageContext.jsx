import { createContext, useState, useContext } from "react";
import {
  getAllAdminPackagesRequest,
  getAdminPackageRequest,
  createAdminPackageRequest,
  updateAdminPackageRequest,
  deleteAdminPackageRequest,
  getAdminUserPackagesRequest,
} from "../../api/adminApi/adminPackages.api";

const AdminPackageContext = createContext();

export const useAdminPackages = () => {
  const context = useContext(AdminPackageContext);
  if (!context) {
    throw new Error("useAdminPackages must be used within an AdminPackageProvider");
  }
  return context;
};

export const AdminPackageProvider = ({ children }) => {
  const [packages, setPackages] = useState([]);
  const [errors, setErrors] = useState([]);

  const loadPackages = async () => {
    try {
      const res = await getAllAdminPackagesRequest();
      setPackages(res.data);
    } catch (error) {
      setErrors(["Failed to load packages"]);
    }
  };

  const loadUserPackages = async (userId) => {
    try {
      const res = await getAdminUserPackagesRequest(userId);
      setPackages(res.data);
    } catch (error) {
      setErrors(["Failed to load user packages"]);
    }
  };

  const getPackageById = async (id) => {
    try {
      const res = await getAdminPackageRequest(id);
      return res.data;
    } catch (error) {
      setErrors(["Failed to get package"]);
    }
  };

  const createPackage = async (userId, pack) => {
    try {
      const res = await createAdminPackageRequest(userId, pack);
      setPackages([...packages, res.data]);
      return res.data;
    } catch (error) {
      setErrors(["Failed to create package"]);
    }
  };

  const updatePackage = async (id, pack) => {
    try {
      const res = await updateAdminPackageRequest(id, pack);
      setPackages(packages.map((p) => (p.id === id ? { ...p, ...res.data } : p)));
    } catch (error) {
      setErrors(["Failed to update package"]);
    }
  };

  const deletePackage = async (id) => {
    try {
      await deleteAdminPackageRequest(id);
      setPackages(packages.filter((p) => p.id !== id));
    } catch (error) {
      setErrors(["Failed to delete package"]);
    }
  };

  return (
    <AdminPackageContext.Provider
      value={{
        packages,
        loadPackages,
        loadUserPackages,
        getPackageById,
        createPackage,
        updatePackage,
        deletePackage,
        errors,
      }}
    >
      {children}
    </AdminPackageContext.Provider>
  );
};
