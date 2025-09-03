import Router from "express-promise-router";
import {
  adminDeleteSupportMessage,
  adminGetAllSupportMessages,
  adminGetSupportMessageById,
  adminUpdateSupportMessageStatus,
  createSupportMessage
} from "../controllers/support.controller.js";
import { isAuth, isAdmin } from "../middlewares/auth.middleware.js"; // Si tienes control de roles
import { validateSchema } from "../middlewares/validate.middleware.js";
import { createSupportSchema } from "../schemas/support.schema.js";

const router = Router();

router.post("/support", isAuth, validateSchema(createSupportSchema), createSupportMessage);

router.get("/admin/support", isAuth, isAdmin, adminGetAllSupportMessages);

router.get("/admin/support/:id", isAuth, isAdmin, adminGetSupportMessageById);

router.put("/admin/support/:id", isAuth, isAdmin, adminUpdateSupportMessageStatus);

router.delete("/admin/support/:id", isAuth, isAdmin, adminDeleteSupportMessage);

export default router;
