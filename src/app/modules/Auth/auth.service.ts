import httpStatus from "http-status";
import { TLoginUser } from "./auth.interface";
import { createToken, verifyToken } from "./auth.utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../../../app";
import { userStatus } from "@prisma/client";
import config from "../../config";

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
    throw new Error("Incorrect password");
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
  // userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {};

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

const forgetPasswordIntoDB = async (userId: string) => {
  // checking if the user is exist
};

const resetPasswordIntoDB = async (
  payload: { id: string; newPassword: string },
  token: string
) => {};
export const authenticationServices = {
  loginUserIntoDB,
  resetPasswordIntoDB,
  forgetPasswordIntoDB,
  refreshTokenIntoDB,
  changePasswordIntoDB,
};
