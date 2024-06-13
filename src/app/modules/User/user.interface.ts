import { Gender } from "@prisma/client";

export type TCreateAdminData = {
  password: string;
  admin: TAdmin;
};

export type TAdmin = {
  name: string;
  email: string;
  contactNumber: string;
};

export type TCreateDoctorData = {
  password: string;
  doctor: TDoctor;
};

export type TDoctor = {
  name: string;
  email: string;
  contactNumber: string;
  address: string;
  registrationNumber: string;
  experience: number;
  gender: Gender;
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
};
export type TCreatePatientData = {
  password: string;
  patient: TPatient;
};

export type TPatient = {
  name: string;
  email: string;
  contactNumber: string;
  address: string;
};
export type TFilterUser = {
  name?: string;
  email?: string;
  searchTerm?: string;
  contactNumber?: string;
  address?: string;
};
