import httpStatus from 'http-status';
import { authenticationServices } from './auth.service';
import { responseHandler } from '../../config/utils/sendResponse';
import catchAsync from '../../config/utils/catchAsync';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const result = await authenticationServices.loginUserIntoDB(req.body);
  const { refreshToken, accessToken, needsPasswordChange } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });
  responseHandler.sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category created successfully',
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});
const changePassword = catchAsync(async (req, res) => {
  const result = await authenticationServices.changePasswordIntoDB(
    req.user,
    req.body,
  );
  responseHandler.sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authenticationServices.refreshTokenIntoDB(refreshToken);
  responseHandler.sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieve successfully',
    data: result,
  });
});
const forgetPassword = catchAsync(async (req, res) => {
  const  userId  = req.body;
  const result = await authenticationServices.forgetPasswordIntoDB(userId);
  responseHandler.sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieve successfully',
    data: result,
  });
});
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization
  const result = await authenticationServices.resetPasswordIntoDB(req.body,token as string);
  responseHandler.sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password Reset successfully',
    data: result,
  });
});

export const authenticationControllers = {
  loginUser,
  forgetPassword,
  changePassword,
  refreshToken,
  resetPassword
};
