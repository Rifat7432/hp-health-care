import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { DoctorService } from './doctor.services';
import httpStatus from 'http-status';
import { doctorFilterableFields } from './doctor.constants';
import pick from '../../../shared/pick';
import { sendRes } from '../../../shared/sendResponse';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.insertIntoDB(req.body);
  sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, doctorFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await DoctorService.getAllFromDB(filters, options);
  sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctors retrieval successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.getByIdFromDB(id);
  sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor retrieval successfully',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  console.log(payload);
  const { ...doctorData } = payload;
  const result = await DoctorService.updateIntoDB(id, doctorData);
  sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor updated successfully',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.deleteFromDB(id);
  sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor deleted successfully',
    data: result,
  });
});
const softDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.softDelete(id);
  sendRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor soft deleted successfully',
    data: result,
  });
});

export const DoctorController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDelete,
};
