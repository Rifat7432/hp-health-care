import { z } from "zod";

const createAdminValidation = z.object({
  body: z.object({
    password: z.string(),
    admin: z.object({
      name: z.string(),
      email: z.string().email(),
      contactNumber: z.string(),
    }),
  }),
});


export const userValidation = {
    createAdminValidation
}