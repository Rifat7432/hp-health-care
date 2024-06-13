import express from "express";
import { userController } from "./user.controller";
import { upload } from "../../../shared/uploadImage";
import makeJson from "../../middlewares/makeJson";
import auth from "../../middlewares/auth";
import { userRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const router = express.Router();
router.get(
  "/get-user",
  // auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  userController.getAllUser
);
router.get(
  "/profile",
  auth(
    userRole.ADMIN,
    userRole.SUPER_ADMIN,
    userRole.PATIENT,
    userRole.PATIENT
  ),
  userController.getProfile
);
router.patch(
  "/update-my-profile",
  auth(
    userRole.ADMIN,
    userRole.SUPER_ADMIN,
    userRole.PATIENT,
    userRole.PATIENT
  ),
  upload.single("file"),
  makeJson("data"),
  userController.updateMyProfile
);
router.patch(
  "/change-status/:id",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  validateRequest(userValidation.updateStatusUserValidation),
  userController.changedStatus
);
router.post(
  "/create-admin",
  upload.single("file"),
  makeJson("data"),
  // auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  validateRequest(userValidation.createAdminValidation),
  userController.createAdmin
);
router.post(
  "/create-doctor",
  upload.single("file"),
  makeJson("data"),
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  validateRequest(userValidation.createDoctorValidation),
  userController.createDoctor
);
router.post(
  "/create-patient",
  upload.single("file"),
  makeJson("data"),
  validateRequest(userValidation.createPatientValidation),
  userController.createPatient
);

export const userRoute = router;
