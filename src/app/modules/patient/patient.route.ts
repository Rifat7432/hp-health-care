import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PatientController } from "./patient.controller";
import auth from "../../middlewares/auth";
import { userRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(userRole.SUPER_ADMIN, userRole.SUPER_ADMIN),
  PatientController.getAllFromDB
);

router.get(
  "/:id",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN, userRole.PATIENT),
  PatientController.getByIdFromDB
);

router.patch(
  "/:id",
  auth(userRole.SUPER_ADMIN, userRole.ADMIN, userRole.PATIENT),
  PatientController.updateIntoDB
);

router.delete(
  "/:id",
  auth(userRole.SUPER_ADMIN, userRole.ADMIN),
  PatientController.deleteFromDB
);
router.delete(
  "/soft/:id",
  auth(userRole.SUPER_ADMIN, userRole.ADMIN),
  PatientController.softDelete
);

export const PatientRoutes = router;
