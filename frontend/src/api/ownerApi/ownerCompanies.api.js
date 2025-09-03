import axios from "../axios";

export const getMyCompaniesRequest = () => axios.get("/companies");

export const getCompanyByIdRequest = (companyId) =>
  axios.get(`/companies/${companyId}`);

export const getCompanyEmployeesRequest = (companyId) =>
  axios.get(`/companies/${companyId}/employees`);

export const removeEmployeeRequest = (companyId, userId) =>
  axios.delete(`/companies/${companyId}/users/${userId}`);

export const getUserMonthlyEntriesRequest = (userId, month, year) =>
  axios.get(`/companies/user/${userId}/clock-history`, { params: { month, year } });

export const deleteCompanyRequest = (companyId) =>
  axios.delete(`/companies/${companyId}`);

export const createCompanyRequest = (companyData) =>
  axios.post("/companies", companyData);

export const getEmployeeByIdRequest = (companyId, userId) =>
  axios.get(`/companies/${companyId}/employees/${userId}`);