import { z } from "zod";

const adminUpdateValidation = z.object({
  body: z.object({
    name: z.string().optional(),
      contactNumber: z.string().optional(),
  }),
});

export const adminValidation = {
  adminUpdateValidation,
};
