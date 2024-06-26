import { z } from 'zod';

const loginUserZodSchema = z.object({
  body: z.object({
    email: z.string({
      invalid_type_error: 'Name must be a string',
      required_error: 'name is required',
    }).email(),
    password: z.string({
      invalid_type_error: 'Name must be a string',
      required_error: 'name is required',
    }),
  }),
});
const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      invalid_type_error: 'oldPassword must be a string',
      required_error: 'oldPassword is required',
    }),
    newPassword: z.string({
      invalid_type_error: 'newPassword must be a string',
      required_error: 'newPassword is required',
    }),
  }),
});
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'User id is required!',
    }).email(),
  }),
});
const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'User id is required!',
    }),
    newPassword: z.string({
      required_error: 'User password is required!',
    }),
  }),
});
export const authenticationZodSchema = {
  loginUserZodSchema,
  changePasswordZodSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
