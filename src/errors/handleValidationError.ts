import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { TErrorResponse, TErrorSources } from '../interface/error';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TErrorResponse => {
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );
  const statusCode = httpStatus.NOT_ACCEPTABLE;
  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};
export default handleValidationError;
