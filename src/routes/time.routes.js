import { Router } from "express";
import {
  clockIn,
  clockOut,
  getTodayEntry,
  getMonthlyEntries,
  ownerGetUserMonthlyEntries,
  adminGetUserMonthlyEntries
} from "../controllers/time.controller.js";
import { isAuth, isAdminOrOwner, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/clock-in", isAuth, clockIn);

router.post("/clock-out", isAuth, clockOut);

router.get("/clock-today", isAuth, getTodayEntry);

router.get("/clock-history", isAuth, getMonthlyEntries);

router.get("/companies/user/:userId/clock-history", isAuth, isAdminOrOwner, ownerGetUserMonthlyEntries);

router.get("/admin/clock-history/:userId", isAuth, isAdmin, adminGetUserMonthlyEntries);



export default router;
