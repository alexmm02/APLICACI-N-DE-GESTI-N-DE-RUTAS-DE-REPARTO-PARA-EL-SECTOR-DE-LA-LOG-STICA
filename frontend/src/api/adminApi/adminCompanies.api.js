import axios from "../axios"

export const getAllCompaniesRequest = () => axios.get("/admin/companies");

export const getEmployeesByCompanyIdRequest = (companyId) =>
  axios.get(`/admin/companies/${companyId}/employees`);

export const deleteCompanyByIdRequest = (companyId) =>
  axios.delete(`/admin/companies/${companyId}`);

export const getAdminMonthlyEntriesRequest = (userId, month, year) =>
  axios.get(`/admin/clock-history/${userId}`, {
    params: { month, year },
  });

export const removeEmployeeRequest = (companyId, userId) =>
  axios.delete(`/admin/companies/${companyId}/users/${userId}`);

export const getCompanyByIdRequest = (companyId) =>
  axios.get(`/admin/companies/${companyId}`);
