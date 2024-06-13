import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AppointmentController } from './appointment.controller';
import auth from '../../middlewares/auth';
import { AppointmentValidation } from './appointment.validation';
import { userRole } from '@prisma/client';


const router = express.Router();

router.get(
    '/',
    auth(userRole.SUPER_ADMIN, userRole.ADMIN),
    AppointmentController.getAllFromDB
);

router.get(
    '/my-appointments',
    auth(userRole.PATIENT, userRole.DOCTOR),
    AppointmentController.getMyAppointment
);

router.post(
    '/',
    auth(userRole.PATIENT),
    validateRequest(AppointmentValidation.createAppointment),
    AppointmentController.createAppointment
);

router.patch(
    '/status/:id',
    auth(userRole.DOCTOR, userRole.ADMIN, userRole.SUPER_ADMIN),
    AppointmentController.changeAppointmentStatus
);



export const AppointmentRoutes = router;
