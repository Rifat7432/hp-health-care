import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();

router.post('/ipn', PaymentController.validate)

router.post(
    '/init/:appointmentId',
    auth(userRole.PATIENT),
    PaymentController.initPayment
);



export const paymentRoutes = router;

