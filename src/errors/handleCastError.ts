import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { TErrorResponse, TErrorSources } from '../interface/error';

const handleCastError = (
  err: mongoose.Error.CastError,
): TErrorResponse => {
  const errorSources: TErrorSources = [{
    path:err?.path,
    message:err?.message
  }]
  const statusCode = httpStatus.NOT_ACCEPTABLE;
  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};
export default handleCastError;
