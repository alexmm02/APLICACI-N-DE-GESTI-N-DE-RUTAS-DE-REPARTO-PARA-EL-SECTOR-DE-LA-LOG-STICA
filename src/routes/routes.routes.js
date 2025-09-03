import Router from "express-promise-router";
import {
  createRoute,
  getUserRoutes,
  getRoutePackages,
  updateRouteStatus,
  deleteRoute,
  getRouteById,     
  updateRoute,       
  getRouteName,
  adminGetAllRoutes,
  adminGetRouteById,
  adminUpdateRouteStatus,
  adminDeleteRoute,
  adminGetRoutePackages,
  adminGetUserRoutes,
  adminUpdateRoute,
  adminCreateRoute,
  ownerGetCompanyUserRoutes,
  ownerCreateRouteForUser,
  ownerDeleteRouteForUser,
  ownerUpdateRouteForUser,
  ownerGetRoutePackages,
  ownerGetRouteById
} from "../controllers/routes.controller.js";

import { isAdmin, isAdminOrOwner, isAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/routes", isAuth, createRoute);

router.get("/routes", isAuth, getUserRoutes);

router.get("/routes/:id", isAuth, getRouteById);

router.put("/routes/:id", isAuth, updateRoute); 

router.get("/routes/:id/packages", isAuth, getRoutePackages);

router.patch("/routes/:id/status", isAuth, updateRouteStatus);

router.delete("/routes/:id", isAuth, deleteRoute);

router.get("/routes/:id/name", isAuth, getRouteName);

router.get("/admin/routes", isAuth, isAdmin, adminGetAllRoutes);

router.get("/admin/routes/:id", isAuth, isAdmin, adminGetRouteById);

router.put("/admin/routes/:id", isAuth, isAdmin, adminUpdateRouteStatus);

router.delete("/admin/routes/:id", isAuth, isAdmin, adminDeleteRoute);

router.get("/admin/routes/:id/packages", isAuth, isAdmin, adminGetRoutePackages);

router.get("/admin/users/:userId/routes", isAuth, isAdmin, adminGetUserRoutes);

router.put("/admin/routes-ad/:id", isAuth, isAdmin, adminUpdateRoute);

router.post("/admin/users/:userId/routes", isAuth, isAdmin, adminCreateRoute);

router.get("/companies/user/:userId/routes", isAuth, isAdminOrOwner, ownerGetCompanyUserRoutes);

router.post("/companies/:companyId/users/:userId/routes", isAuth, isAdminOrOwner, ownerCreateRouteForUser);

router.delete("/companies/:companyId/users/:userId/routes/:routeId", isAuth, isAdminOrOwner, ownerDeleteRouteForUser);

router.put("/companies/:companyId/users/:userId/routes/:routeId", isAuth, isAdminOrOwner, ownerUpdateRouteForUser);

router.get("/companies/:companyId/users/:userId/routes/:routeId/packages", isAuth, isAdminOrOwner,
ownerGetRoutePackages
);

router.get("/companies/:companyId/users/:userId/routes/:routeId", isAuth, isAdminOrOwner,
 ownerGetRouteById);

export default router;
