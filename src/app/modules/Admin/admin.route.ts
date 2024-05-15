import express from "express";
import { adminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidation } from "./admin.validation";

const router = express.Router();

router.get("/get-admin", adminController.getAllAdmin);
router.get("/get-admin/:id", adminController.getAdmin);
router.patch(
  "/update-admin/:id",
  validateRequest(adminValidation.adminUpdateValidation),
  adminController.updateAdmin
);
router.delete("/:id", adminController.deleteAdmin);
router.delete("/delete-admin/:id", adminController.softDeleteAdmin);

export const adminRoute = router;
