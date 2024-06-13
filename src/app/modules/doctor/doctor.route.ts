import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorValidation } from "./doctor.validation";
import { DoctorController } from "./doctor.controller";
import auth from "../../middlewares/auth";
import { userRole } from "@prisma/client";

const router = express.Router();

router.get("/", DoctorController.getAllFromDB);

router.get("/:id", DoctorController.getByIdFromDB);

router.post(
  "/",
  validateRequest(DoctorValidation.create),
  DoctorController.insertIntoDB
);

router.patch(
  "/:id",
  auth(
    userRole.ADMIN,
    userRole.SUPER_ADMIN,
    userRole.PATIENT,
    userRole.PATIENT
  ),
  validateRequest(DoctorValidation.update),
  DoctorController.updateIntoDB
);

router.delete(
  "/:id",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  DoctorController.deleteFromDB
);

router.delete(
  "/soft/:id",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  DoctorController.softDelete
);

export const DoctorRoutes = router;
