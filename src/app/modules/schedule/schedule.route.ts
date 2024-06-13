import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ScheduleValidation } from './schedule.validations';
import { ScheduleController } from './schedule.controller';
import auth from '../../middlewares/auth';
import { userRole } from '@prisma/client';


const router = express.Router();
router.get(
  '/',
  auth(userRole.SUPER_ADMIN, userRole.ADMIN, userRole.DOCTOR),
  ScheduleController.getAllFromDB
);

router.get(
  '/:id',
  auth(userRole.SUPER_ADMIN, userRole.ADMIN, userRole.DOCTOR),
  ScheduleController.getByIdFromDB
);

// router.patch('/:id', PatientController.updateIntoDB);
router.post(
  '/',
  auth(userRole.SUPER_ADMIN, userRole.ADMIN),
  validateRequest(ScheduleValidation.create),
  ScheduleController.insertIntoDB,
);

router.delete(
  '/:id',
  auth(userRole.SUPER_ADMIN, userRole.ADMIN),
  ScheduleController.deleteFromDB
);

export const ScheduleRoutes = router;
