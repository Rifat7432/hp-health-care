import httpStatus from "http-status";
import { TLoginUser } from "./auth.interface";
import { createToken, verifyToken } from "./auth.utils";
import bcrypt from "bcrypt";
import { prisma } from "../../../app";
import { userStatus } from "@prisma/client";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../../errors/appErrors";
import { sendEmail } from "../../../shared/sendEmail";

const loginUserIntoDB = async (payload: TLoginUser) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: userStatus.ACTIVE,
    },
  });
  const isPasswordMatched: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, "Incorrect password");
  }
  const jwtPayload = {
    email: userData.email,
    role: userData.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );
  return {
    accessToken,
    refreshToken,
    needsPasswordChange: userData.needPasswordChang,
  };
};
const changePasswordIntoDB = async (
  decodeToken: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodeToken.email,
      status: userStatus.ACTIVE,
    },
  });
  const isPasswordMatched: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, "Incorrect password");
  }
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds as string)
  );
  const result = await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: { password: hashedPassword, needPasswordChang: false },
  });
  return result;
};

const refreshTokenIntoDB = async (token: string) => {
  let decodeToken;
  try {
    decodeToken = verifyToken(token, config.jwt_refresh_secret as string);
  } catch (err) {
    throw new Error("Unauthorized");
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodeToken.email,
      status: userStatus.ACTIVE,
    },
  });
  const jwtPayload = {
    email: userData.email,
    role: userData.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  return { accessToken, needsPasswordChange: userData.needPasswordChang };
};

const forgetPasswordIntoDB = async (email: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
      status: userStatus.ACTIVE,
    },
  });
  const jwtPayload = {
    email: userData.email,
    role: userData.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_reset_secret as string,
    "10m"
  );
  const resetUILink = `${config.reset_pass_ui_link}?id=${userData.id}&token=${resetToken} `;
  sendEmail(userData.email, resetUILink);
};

const resetPasswordIntoDB = async (
  payload: { id: string; newPassword: string },
  token: string
) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: userStatus.ACTIVE,
    },
  });
  const decodeToken = verifyToken(token, config.jwt_reset_secret as string);
  if (!decodeToken) {
    throw new AppError(httpStatus.FORBIDDEN, "you are not verified");
  }
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds as string)
  );
  const result = await prisma.user.update({
    where: {
      email: decodeToken.email,
      id: payload.id,
      status: userStatus.ACTIVE,
    },
    data: { password: hashedPassword },
  });
  return result;
};
export const authenticationServices = {
  loginUserIntoDB,
  resetPasswordIntoDB,
  forgetPasswordIntoDB,
  refreshTokenIntoDB,
  changePasswordIntoDB,
};
