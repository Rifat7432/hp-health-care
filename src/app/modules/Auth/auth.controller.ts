import httpStatus from "http-status";
import { authenticationServices } from "./auth.service";
import catchAsync from "../../../shared/catchAsync";
import { sendRes } from "../../../shared/sendResponse";

const loginUser = catchAsync(async (req, res) => {
  const result = await authenticationServices.loginUserIntoDB(req.body);
  const { refreshToken, accessToken, needsPasswordChange } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });
  sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login  successfully",
    data: { accessToken, needsPasswordChange },
  });
});
const changePassword = catchAsync(async (req, res) => {
  const result = await authenticationServices.changePasswordIntoDB(
    req.user,
    req.body
  );
  sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authenticationServices.refreshTokenIntoDB(refreshToken);
  sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is retrieve successfully",
    data: result,
  });
});
const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  await authenticationServices.forgetPasswordIntoDB(email);
  sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Check your email",
    data: null,
  });
});
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await authenticationServices.resetPasswordIntoDB(
    req.body,
    token as string
  );
  sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Reset successfully",
    data: result,
  });
});

export const authenticationControllers = {
  loginUser,
  forgetPassword,
  changePassword,
  refreshToken,
  resetPassword,
};
