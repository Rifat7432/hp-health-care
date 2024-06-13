import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validations';
import { ReviewController } from './review.controller';
import auth from '../../middlewares/auth';
import { userRole } from '@prisma/client';

const router = express.Router();
router.get('/', ReviewController.getAllFromDB);

router.post(
  '/',
  auth(userRole.PATIENT),
  validateRequest(ReviewValidation.create),
  ReviewController.insertIntoDB,
);

export const ReviewRoutes = router;
