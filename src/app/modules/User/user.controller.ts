import { Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import { sendRes } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { TFileImage } from "../../interface/ImageResponseType";
import { userFilterFields } from "./user.constant";
import pick from "../../../shared/pick";

const createAdmin = catchAsync(async (req, res) => {
  const result = await userService.createAdminIntoDB(
    req.body,
    req.file as TFileImage
  );
  sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});
const createDoctor = catchAsync(async (req, res) => {
  const result = await userService.createDoctorIntoDB(
    req.body,
    req.file as TFileImage
  );
  sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});
const createPatient = catchAsync(async (req, res) => {
  const result = await userService.createPatientIntoDB(
    req.body,
    req.file as TFileImage
  );
  sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});
const getAllUser = catchAsync(async (req, res) => {
  const filter = pick(req.query, userFilterFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await userService.getAllUserFromDB(filter, options);
  return sendRes(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "user data found successfully",
    ...result,
  });
});
const changedStatus = catchAsync(async (req, res) => {
  const result = await userService.changedStatusIntoDB(req.params.id, req.body);
  return sendRes(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Status changed successfully",
    data: result,
  });
});
const getProfile = catchAsync(async (req, res) => {
  const result = await userService.getProfileFromDB(req.user);
  return sendRes(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile get successfully",
    data: result,
  });
});
const updateMyProfile = catchAsync(async (req, res) => {
  const result = await userService.updateMyProfile(
    req.user,
    req.body,
    req.file as TFileImage
  );
  return sendRes(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile Updated successfully",
    data: result,
  });
});
export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUser,
  changedStatus,
  getProfile,
  updateMyProfile,
};
