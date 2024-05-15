import express from 'express';
import { authenticationZodSchema } from './auth.validation';
import { authenticationControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';


const router = express.Router();

router.post(
  '/login',
  // validateRequest(authenticationZodSchema.loginUserZodSchema),
  authenticationControllers.loginUser,
);
router.post(
  '/change-password',
  validateRequest(authenticationZodSchema.changePasswordZodSchema),
  authenticationControllers.changePassword,
);
router.post(
  '/refresh-token',
  // validateRequest(authenticationZodSchema.refreshTokenValidationSchema),
  authenticationControllers.refreshToken,);
router.post(
  '/forget-password',
  validateRequest(authenticationZodSchema.forgetPasswordValidationSchema),
  authenticationControllers.forgetPassword,
);
router.post(
  '/reset-password',
  validateRequest(authenticationZodSchema.forgetPasswordValidationSchema),
  authenticationControllers.resetPassword,
);
export const authRoutes = router;
