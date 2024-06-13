import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { DoctorScheduleValidation } from './doctorSchedule.validations';
import { ScheduleController } from './doctorSchedule.controller';
import auth from '../../middlewares/auth';
import { userRole } from '@prisma/client';


const router = express.Router();
router.get(
  '/',
  auth(userRole.SUPER_ADMIN, userRole.ADMIN, userRole.DOCTOR, userRole.PATIENT),
  ScheduleController.getAllFromDB);

router.get(
  '/my-schedules',
  auth(userRole.DOCTOR),
  ScheduleController.getMySchedules
);

// router.patch('/:id', ScheduleController.updateIntoDB);
router.post(
  '/',
  validateRequest(DoctorScheduleValidation.create),
  auth(userRole.DOCTOR),
  ScheduleController.insertIntoDB,
);
router.delete(
  '/:id',
  auth(userRole.DOCTOR),
  ScheduleController.deleteFromDB
);

export const DoctorScheduleRoutes = router;
