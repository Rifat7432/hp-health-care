import express, { NextFunction, Request, Response } from "express";

import { SpecialtiesValidation } from "./specialties.validations";
import { SpecialtiesController } from "./specialties.controller";
import auth from "../../middlewares/auth";
import { userRole } from "@prisma/client";
import { upload } from "../../../shared/uploadImage";

const router = express.Router();

router.get("/", SpecialtiesController.getAllFromDB);

router.post(
  "/",
  auth(userRole.ADMIN, userRole.DOCTOR, userRole.SUPER_ADMIN, userRole.PATIENT),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidation.create.parse(JSON.parse(req.body.data));
    return SpecialtiesController.insertIntoDB(req, res, next);
  }
);
router.delete(
  "/:id",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  SpecialtiesController.deleteFromDB
);

export const SpecialtiesRoutes = router;
