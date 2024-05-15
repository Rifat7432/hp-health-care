/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import path from "path";
import { AppError } from "../../errors/appErrors";

const gobbleError: ErrorRequestHandler = (err, req, res, next) => {
  let errorSources = [
    {
      path: err.name,
      message: err.message || "something went wrong !!",
    },
  ];
  let statusCode = 500;
  let message = err.name || "something went wrong !!";

  if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorSources = [
      {
        path: 'AppError',
        message: err?.message,
      },
    ];
  }
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    error: err,
    stack: err?.stack || null,
  });
};
const notFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    massage: "API Not Fount !!",
    error: {
      path: req.originalUrl,
      massage: "Your Url Is Not Fount !!",
    },
  });
};
export const gobbleErrorHandler = {
  gobbleError,
  notFound,
};
