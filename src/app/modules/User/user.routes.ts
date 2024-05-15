import express from "express";
import { userController } from "./user.controller";
import { upload } from "../../../shared/uploadImage";
import makeJson from "../../middlewares/makeJson";
import auth from "../../middlewares/auth";
import { userRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const router = express.Router();

router.post(
  "/create-admin",
  upload.single("file"),
  makeJson("data"),
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  validateRequest(userValidation.createAdminValidation),
  userController.createAdmin
);

export const userRoute = router;
