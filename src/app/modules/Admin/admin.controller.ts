import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterFields } from "./admin.constant";
import { sendRes } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../middlewares/catchAsync";

const getAllAdmin = catchAsync(async (req, res) => {
  const filter = pick(req.query, adminFilterFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await adminService.getAllAdminFromDB(filter, options);
  return sendRes(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "admin found successfully",
    ...result,
  });
});
const getAdmin = catchAsync(async (req, res) => {
  const result = await adminService.getAdminFromDB(req.params.id);
  return sendRes(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "admin found by id successfully",
    data: result,
  });
});
const updateAdmin = catchAsync(async (req, res) => {
  const result = await adminService.updateIntoDB(req.params.id, req.body);
  return sendRes(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "admin updated by id successfully",
    data: result,
  });
});
const deleteAdmin = catchAsync(async (req, res) => {
  const result = await adminService.deleteIntoDB(req.params.id);
  return sendRes(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "admin deleted  successfully",
    data: result,
  });
});
const softDeleteAdmin = catchAsync(async (req, res) => {
  const result = await adminService.softDeleteAdminIntoDB(req.params.id);
  return sendRes(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "admin deleted  successfully",
    data: result,
  });
});
export const adminController = {
  getAllAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
