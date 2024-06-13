import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PrescriptionValidation } from './prescription.validations';
import { PrescriptionController } from './prescription.controller';
import auth from '../../middlewares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();
router.get(
  '/',
  auth(userRole.SUPER_ADMIN, userRole.ADMIN),
  PrescriptionController.getAllFromDB
);

//router.get('/:id', PrescriptionController.getByIdFromDB);
router.get(
  '/my-prescriptions',
  auth(userRole.PATIENT),
  PrescriptionController.patientPrescriptions
);

router.post(
  '/',
  auth(userRole.DOCTOR),
  validateRequest(PrescriptionValidation.create),
  PrescriptionController.insertIntoDB
);

export const PrescriptionsRoutes = router;
