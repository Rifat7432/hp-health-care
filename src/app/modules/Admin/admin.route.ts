import express from "express";
import { adminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidation } from "./admin.validation";
import auth from "../../middlewares/auth";
import { userRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/get-admin",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  adminController.getAllAdmin
);
router.get("/get-admin/:id", adminController.getAdmin);
router.patch(
  "/update-admin/:id",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  validateRequest(adminValidation.adminUpdateValidation),
  adminController.updateAdmin
);
router.delete("/:id", auth(userRole.SUPER_ADMIN), adminController.deleteAdmin);
router.delete(
  "/delete-admin/:id",
  auth(userRole.SUPER_ADMIN),
  adminController.softDeleteAdmin
);

export const adminRoute = router;