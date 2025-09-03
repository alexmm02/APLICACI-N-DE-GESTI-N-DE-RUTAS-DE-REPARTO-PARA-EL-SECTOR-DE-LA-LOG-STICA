import Router from "express-promise-router";
import {
  adminCreatePackage,
  adminDeletePackage,
  adminGetAllPackages,
  adminGetPackageById,
  adminGetUserPackages,
  adminUpdatePackage,
  createPackage,
  deletePackage,
  getAllPackages,
  getPackage,
  markPackageAsDelivered,
  ownerCreatePackageForUser,
  ownerDeletePackageForUser,
  ownerGetCompanyUserPackages,
  ownerGetPackageById,
  ownerUpdateEmployeePackage,
  unmarkPackageAsDelivered,
  updatePackage,
} from "../controllers/packages.controller.js";
import { isAdmin, isAdminOrOwner, isAuth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { createPackageSchema, updatePackageSchema } from "../schemas/package.schema.js";

const router = Router();

router.get("/packages", isAuth, getAllPackages);

router.get("/packages/:id", isAuth, getPackage);

router.post("/packages", isAuth, validateSchema(createPackageSchema), createPackage);

router.put("/packages/:id", isAuth, validateSchema(updatePackageSchema), updatePackage);

router.delete("/packages/:id", isAuth, deletePackage);

router.put("/packages/:id/delivered", isAuth, markPackageAsDelivered);

router.put("/packages/:id/unmark-delivered", isAuth, unmarkPackageAsDelivered);

router.get("/admin/packages", isAuth, isAdmin, adminGetAllPackages);

router.get("/admin/packages/:id", isAuth, isAdmin, adminGetPackageById);

router.put("/admin/packages/:id", isAuth, isAdmin, adminUpdatePackage);

router.delete("/admin/packages/:id", isAuth, isAdmin, adminDeletePackage);

router.post("/admin/users/:userId/packages", isAuth, isAdmin, adminCreatePackage);

router.get("/admin/users/:userId/packages", isAuth, isAdmin, adminGetUserPackages);

router.get("/companies/user/:userId/packages", isAuth, isAdminOrOwner, ownerGetCompanyUserPackages);

router.post("/companies/:companyId/users/:userId/packages", isAuth, isAdminOrOwner, ownerCreatePackageForUser);

router.delete("/companies/:companyId/users/:userId/packages/:packageId", isAuth, isAdminOrOwner, ownerDeletePackageForUser);

router.put("/companies/:companyId/users/:userId/packages/:packageId", isAuth, isAdminOrOwner, ownerUpdateEmployeePackage);

router.get("/companies/:companyId/users/:userId/packages/:packageId", isAuth, isAdminOrOwner,
ownerGetPackageById);

export default router;