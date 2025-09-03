import { createContext, useContext, useState, useCallback } from "react";
import {
  getCompanyUserPackagesRequest,
  getCompanyUserPackageByIdRequest,
  createPackageForUserRequest,
  updateEmployeePackageRequest,
  deletePackageForUserRequest,
} from "../../api/ownerApi/ownerPackages.api";

const OwnerPackageContext = createContext();

export const useOwnerPackages = () => {
  const context = useContext(OwnerPackageContext);
  if (!context) {
    throw new Error("useOwnerPackages must be used within an OwnerPackageProvider");
  }
  return context;
};

export const OwnerPackageProvider = ({ children }) => {
  const [packages, setPackages] = useState([]);
  const [errors, setErrors] = useState([]);

  const loadUserPackages = useCallback(async (userId) => {
    try {
      setErrors([]);
      const res = await getCompanyUserPackagesRequest(userId);
      setPackages(res.data);
    } catch (error) {
      console.error(error);
      setErrors([
        error.response?.data?.message || "Error loading user's packages",
      ]);
    }
  }, []);

  const getPackageById = useCallback(async (companyId, userId, packageId) => {
    try {
      setErrors([]);
      const res = await getCompanyUserPackageByIdRequest(companyId, userId, packageId);
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors([
        error.response?.data?.message || "Error fetching package details",
      ]);
    }
  }, []);

  const createPackage = useCallback(async (companyId, userId, packageData) => {
    try {
      setErrors([]);
      const res = await createPackageForUserRequest(companyId, userId, packageData);
      setPackages((prev) => [...prev, res.data]);
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors([
        error.response?.data?.message || "Error creating package",
      ]);
    }
  }, []);

  const updatePackage = useCallback(async (companyId, userId, packageId, packageData) => {
    try {
      setErrors([]);
      const res = await updateEmployeePackageRequest(companyId, userId, packageId, packageData);
      setPackages((prev) =>
        prev.map((p) => (p.id === packageId ? { ...p, ...res.data } : p))
      );
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors([
        error.response?.data?.message || "Error updating package",
      ]);
    }
  }, []);

  const deletePackage = useCallback(async (companyId, userId, packageId) => {
    try {
      setErrors([]);
      await deletePackageForUserRequest(companyId, userId, packageId);
      setPackages((prev) => prev.filter((p) => p.id !== packageId));
    } catch (error) {
      console.error(error);
      setErrors([
        error.response?.data?.message || "Error deleting package",
      ]);
    }
  }, []);

  return (
    <OwnerPackageContext.Provider
      value={{
        packages,
        loadUserPackages,
        getPackageById,
        createPackage,
        updatePackage,
        deletePackage,
        errors,
      }}
    >
      {children}
    </OwnerPackageContext.Provider>
  );
};
