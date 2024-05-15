/* eslint-disable @typescript-eslint/no-unused-vars */
import { userRole, userStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import Jwt, { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../shared/catchAsync";
import config from "../config";
import { prisma } from "../../app";
import { verifyToken } from "../modules/Auth/auth.utils";
import { AppError } from "../../errors/appErrors";

const auth = (...requireRoles: userRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You do not have the necessary permissions to access this resource"
      );
    }

    const decoded = verifyToken(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;
    const { role, email, iat } = decoded;

    await prisma.user.findUniqueOrThrow({
      where: {
        email,
        status: userStatus.ACTIVE,
      },
    });

    if (requireRoles.length && !requireRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You do not have the necessary permissions to access this resource"
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
