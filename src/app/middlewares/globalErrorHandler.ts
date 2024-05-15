
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import path from 'path';


const gobbleError: ErrorRequestHandler = (err, req, res, next) => {
  let errorSources = [
    {
      path: '',
      message: 'something went wrong !!',
    },
  ];
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let massage = err.name || 'something went wrong !!';



  return res.status(statusCode).json({
    success: false,
    massage,
    errorSources,
    error: err,
    stack:  err?.stack || null,
  });
};
const notFound = ( req:Request, res:Response, next:NextFunction) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    massage: 'API Not Fount !!',
    error: {
        path:req.originalUrl,
        massage: 'Your Url Is Not Fount !!',
    },
  });
};
export const gobbleErrorHandler = {
  gobbleError,
  notFound,
};
