import { ZodError } from 'zod';
import { TErrorResponse, TErrorSources } from '../interface/error';
import httpStatus from 'http-status';

const handleZodError = (err: ZodError): TErrorResponse => {
  const errorSources: TErrorSources = err.issues.map((issue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });
  const statusCode = httpStatus.NOT_ACCEPTABLE;
  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};
export default handleZodError;
