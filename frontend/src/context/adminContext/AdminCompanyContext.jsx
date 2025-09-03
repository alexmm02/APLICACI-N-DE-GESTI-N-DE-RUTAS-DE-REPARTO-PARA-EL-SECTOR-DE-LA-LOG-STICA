import { createContext, useContext, useState } from "react";
import {
  getAllCompaniesRequest,
  getEmployeesByCompanyIdRequest,
  deleteCompanyByIdRequest,
  getAdminMonthlyEntriesRequest,
  removeEmployeeRequest,
  getCompanyByIdRequest, 
} from "../../api/adminApi/adminCompanies.api";

const AdminCompanyContext = createContext();

export const useAdminCompanies = () => {
  const context = useContext(AdminCompanyContext);
  if (!context) {
    throw new Error("useAdminCompanies must be used within an AdminCompanyProvider");
  }
  return context;
};

export const AdminCompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [monthlyEntries, setMonthlyEntries] = useState([]);
  const [errors, setErrors] = useState([]);

  const loadCompanies = async () => {
    try {
      const res = await getAllCompaniesRequest();
      setCompanies(res.data);
    } catch (error) {
      setErrors(["Failed to load companies"]);
    }
  };

  const loadEmployeesByCompany = async (companyId) => {
    try {
      const res = await getEmployeesByCompanyIdRequest(companyId);
      setEmployees(res.data);
    } catch (error) {
      setErrors(["Failed to load employees"]);
    }
  };

  const deleteCompany = async (companyId) => {
    try {
      await deleteCompanyByIdRequest(companyId);
      setCompanies((prev) => prev.filter((c) => c.id !== companyId));
    } catch (error) {
      console.error("❌ Actual error:", error?.response?.data || error.message);
      setErrors(["Failed to delete company"]);
    }
  };

  const loadMonthlyEntries = async (userId, month, year) => {
    try {
      const res = await getAdminMonthlyEntriesRequest(userId, month, year);
      setMonthlyEntries(res.data);
    } catch (error) {
      setErrors(["Failed to fetch user time entries"]);
    }
  };

  const removeEmployee = async (companyId, userId) => {
    try {
      await removeEmployeeRequest(companyId, userId);
      setEmployees((prev) => prev.filter((e) => e.id !== userId));
    } catch (error) {
      console.error("❌ Actual error removing employee:", error?.response?.data || error.message);
      setErrors(["Failed to remove employee"]);
    }
  };

  const getCompanyById = async (companyId) => {
    try {
      const res = await getCompanyByIdRequest(companyId);
      return res.data;
    } catch (error) {
      setErrors(["Failed to get company"]);
      throw error;
    }
  };

  return (
    <AdminCompanyContext.Provider
      value={{
        companies,
        employees,
        monthlyEntries,
        loadCompanies,
        loadEmployeesByCompany,
        deleteCompany,
        loadMonthlyEntries,
        removeEmployee,
        getCompanyById,
        errors,
      }}
    >
      {children}
    </AdminCompanyContext.Provider>
  );
};
