/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';

import { TErrorResponse, TErrorSources } from '../interface/error';

const handleDuplicateError = (err: any): TErrorResponse => {
  const [[path, value]] = Object.entries(err?.keyValue);
  const errorSources: TErrorSources = [
    {
      path: path,
      message: `${value} is already exist`,
    },
  ];
  const statusCode = httpStatus.NOT_ACCEPTABLE;
  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};
export default handleDuplicateError;
