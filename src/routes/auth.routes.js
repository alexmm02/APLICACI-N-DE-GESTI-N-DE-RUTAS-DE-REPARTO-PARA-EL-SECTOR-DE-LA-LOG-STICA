import Router from "express-promise-router";
import {
  profile,
  updateProfile,
  signin,
  signout,
  signup,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  leaveCompany,
  adminGetAllUsers,
  adminGetUserById,
  adminDeleteUser,
  adminUpdateUser,
  deleteUser,
} from "../controllers/auth.controller.js";
import { isAdmin, isAuth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { signinSchema, signupSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post("/signin", validateSchema(signinSchema), signin);

router.post("/signup", validateSchema(signupSchema), signup);

router.post("/signout", signout);

router.get("/profile", isAuth, profile);

router.put("/profile", isAuth, updateProfile);

router.delete("/profile", isAuth, deleteUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.put("/change-password", isAuth, changePassword);

router.get("/verify/:token", verifyEmail);

router.put("/leave-company",isAuth,leaveCompany);

router.get("/admin/users", isAuth, isAdmin, adminGetAllUsers);

router.get("/admin/users/:id", isAuth, isAdmin, adminGetUserById);

router.put("/admin/users/:id", isAuth, isAdmin, adminUpdateUser);

router.delete("/admin/users/:id", isAuth, isAdmin, adminDeleteUser);

export default router;
