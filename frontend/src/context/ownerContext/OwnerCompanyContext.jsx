import { createContext, useContext, useState } from "react";
import {
  getMyCompaniesRequest,
  getCompanyByIdRequest,
  getCompanyEmployeesRequest,
  getEmployeeByIdRequest, 
  removeEmployeeRequest,
  getUserMonthlyEntriesRequest,
  deleteCompanyRequest,
  createCompanyRequest,
} from "../../api/ownerApi/ownerCompanies.api";

const OwnerCompanyContext = createContext();

export const useOwnerCompanies = () => {
  const context = useContext(OwnerCompanyContext);
  if (!context) {
    throw new Error("useOwnerCompanies must be used within an OwnerCompanyProvider");
  }
  return context;
};

export const OwnerCompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [monthlyEntries, setMonthlyEntries] = useState([]);
  const [errors, setErrors] = useState([]);

  const loadMyCompanies = async () => {
    try {
      const res = await getMyCompaniesRequest();
      setCompanies(res.data);
    } catch (error) {
      console.error(error);
      setErrors(["Failed to load your companies"]);
    }
  };

  const loadCompany = async (companyId) => {
    try {
      const res = await getCompanyByIdRequest(companyId);
      setCompany(res.data);
    } catch (error) {
      console.error(error);
      setErrors(["Failed to load the company"]);
    }
  };

  const loadCompanyEmployees = async (companyId) => {
    try {
      const res = await getCompanyEmployeesRequest(companyId);
      setEmployees(res.data);
    } catch (error) {
      console.error(error);
      setErrors(["Failed to load employees"]);
    }
  };

  const loadEmployeeById = async (companyId, userId) => {
    try {
      const res = await getEmployeeByIdRequest(companyId, userId);
      setEmployee(res.data);
    } catch (error) {
      console.error(error);
      setErrors(["Failed to load employee"]);
    }
  };

  const removeEmployee = async (companyId, userId) => {
    try {
      await removeEmployeeRequest(companyId, userId);
      setEmployees((prev) => prev.filter((emp) => emp.id !== userId));
    } catch (error) {
      console.error(error);
      setErrors(["Failed to remove employee"]);
    }
  };

  const loadUserMonthlyEntries = async (userId, month, year) => {
    try {
      const res = await getUserMonthlyEntriesRequest(userId, month, year);
      setMonthlyEntries(res.data);
    } catch (error) {
      console.error(error);
      setErrors(["Failed to retrieve work entries"]);
    }
  };

  const deleteCompany = async (companyId) => {
    try {
      await deleteCompanyRequest(companyId);
      setCompanies((prev) => prev.filter((comp) => comp.id !== companyId));
      if (company?.id === companyId) {
        setCompany(null);
      }
    } catch (error) {
      console.error(error);
      setErrors(["Failed to delete company"]);
    }
  };

  const createCompany = async (companyData) => {
    try {
      setErrors([]);
      const res = await createCompanyRequest(companyData);
      setCompanies((prev) => [...prev, res.data.company]);
      return res.data;
    } catch (error) {
      console.error("❌ Error in createCompany:", error);
      setErrors([
        error.response?.data?.message || "Failed to create company",
      ]);
    }
  };

  return (
    <OwnerCompanyContext.Provider
      value={{
        companies,
        company,
        employees,
        employee, 
        monthlyEntries,
        loadMyCompanies,
        loadCompany,
        loadCompanyEmployees,
        loadEmployeeById, 
        removeEmployee,
        loadUserMonthlyEntries,
        deleteCompany,
        createCompany,
        errors,
      }}
    >
      {children}
    </OwnerCompanyContext.Provider>
  );
};
