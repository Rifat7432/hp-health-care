import { Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import { sendRes } from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createAdmin = catchAsync(async (req, res) => {
  const result = await userService.createAdminIntoDB(req.body,req.file);
  sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});
export const userController = {
  createAdmin,
};
