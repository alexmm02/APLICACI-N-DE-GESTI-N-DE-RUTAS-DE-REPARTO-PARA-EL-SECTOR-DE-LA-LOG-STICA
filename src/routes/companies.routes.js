import Router from "express-promise-router";
import { adminDeleteCompanyById, adminGetAllCompanies, adminGetCompanyById, adminGetEmployeesByCompanyId, adminRemoveEmployeeFromCompany, createCompany,deleteOwnCompanyById,getCompanyById, getCompanyEmployees, getEmployeeById, getMyCompanies, removeEmployeeFromCompany } from "../controllers/company.controller.js";
import { isAuth, isAdminOrOwner, isAdmin} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/companies", isAuth, isAdminOrOwner, createCompany);

router.get("/companies/:id",isAuth,getCompanyById);

router.get("/companies", isAuth, isAdminOrOwner, getMyCompanies);

router.get("/companies/:companyId/employees", isAuth, isAdminOrOwner, getCompanyEmployees);

router.delete("/companies/:companyId/users/:userId", isAuth, isAdminOrOwner, removeEmployeeFromCompany);

router.delete("/companies/:id", isAuth, isAdminOrOwner, deleteOwnCompanyById);

router.get("/companies/:companyId/employees/:userId", isAuth, isAdminOrOwner, getEmployeeById);

router.get("/admin/companies", isAuth, isAdmin, adminGetAllCompanies);

router.get("/admin/companies/:id/employees", isAuth, isAdmin, adminGetEmployeesByCompanyId);

router.delete("/admin/companies/:id", isAuth, isAdmin, adminDeleteCompanyById);

router.delete("/admin/companies/:companyId/users/:userId", isAuth, isAdmin, adminRemoveEmployeeFromCompany);

router.get("/admin/companies/:id", isAuth, isAdmin, adminGetCompanyById);

export default router;
