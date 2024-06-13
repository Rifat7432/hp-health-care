import { Gender, userStatus } from "@prisma/client";
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
const createDoctorValidation = z.object({
  body: z.object({
    password: z.string(),
    doctor: z.object({
      name: z.string(),
      email: z.string().email(),
      contactNumber: z.string(),
      address: z.string().optional(),
      registrationNumber: z.string(),
      experience: z.number().int().nonnegative().default(0).optional(),
      gender: z.enum([Gender.MALE, Gender.FEMALE]),
      appointmentFee: z.number().int().nonnegative(),
      qualification: z.string(),
      currentWorkingPlace: z.string(),
      designation: z.string(),
    }),
  }),
});
const createPatientValidation = z.object({
  body: z.object({
    password: z.string(),
    patient: z.object({
      name: z.string(),
      email: z.string().email(),
      contactNumber: z.string(),
      address: z.string().optional(),
    }),
  }),
});
const updateStatusUserValidation = z.object({
  body: z.object({
    status: z.enum([userStatus.ACTIVE,userStatus.BLOCKED,userStatus.DELETED]),
  }),
});

export const userValidation = {
  createAdminValidation,
  createDoctorValidation,
  createPatientValidation,
  updateStatusUserValidation
};
