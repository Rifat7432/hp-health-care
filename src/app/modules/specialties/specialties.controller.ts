import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import httpStatus from "http-status";
import { SpecialtiesService } from "./specialties.services";
import { sendRes } from "../../../shared/sendResponse";
import { TFileImage } from "../../interface/ImageResponseType";

const insertIntoDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await SpecialtiesService.insertIntoDB(
      req.body,
      req.file as TFileImage
    );
    sendRes(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Specialty created successfully",
      data: result,
    });
  }
);

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.getAllFromDB();
  sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties data fetched successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SpecialtiesService.deleteFromDB(id);
  sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialty deleted successfully",
    data: result,
  });
});

export const SpecialtiesController = {
  insertIntoDB,
  getAllFromDB,
  deleteFromDB,
};
