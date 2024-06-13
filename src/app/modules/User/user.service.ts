import {
  Admin,
  Doctor,
  Patient,
  Prisma,
  userRole,
  userStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../../app";
import config from "../../config";
import { sendImageToCloudinary } from "../../../shared/uploadImage";
import { TFileImage } from "../../interface/ImageResponseType";
import {
  TCreateAdminData,
  TCreateDoctorData,
  TCreatePatientData,
  TFilterUser,
} from "./user.interface";
import { TPagination } from "../../interface/pagination";
import { paginationHelper } from "../../../helper/pagination";
import { searchFields } from "./user.constant";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../../errors/appErrors";
import httpStatus from "http-status";

const createAdminIntoDB = async (data: TCreateAdminData, file: TFileImage) => {
  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(config.bcrypt_salt_rounds as string)
  );
  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: userRole.ADMIN,
  };
  const path = file.path;
  const { secure_url } = await sendImageToCloudinary(data.admin.email, path);
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });

    const createdAdminData = await tx.admin.create({
      data: { ...data.admin, profilePhoto: secure_url },
    });
    return createdAdminData;
  });
  return result;
};
const createDoctorIntoDB = async (
  data: TCreateDoctorData,
  file: TFileImage
) => {
  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(config.bcrypt_salt_rounds as string)
  );
  const userData = {
    email: data.doctor.email,
    password: hashedPassword,
    role: userRole.DOCTOR,
  };
  const path = file.path;
  const { secure_url } = await sendImageToCloudinary(data.doctor.email, path);
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });

    const createdDoctorData = await tx.doctor.create({
      data: { ...data.doctor, profilePhoto: secure_url },
    });
    return createdDoctorData;
  });
  return result;
};
const createPatientIntoDB = async (
  data: TCreatePatientData,
  file: TFileImage
) => {
  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(config.bcrypt_salt_rounds as string)
  );
  const userData = {
    email: data.patient.email,
    password: hashedPassword,
    role: userRole.PATIENT,
  };
  const path = file.path;
  const { secure_url } = await sendImageToCloudinary(data.patient.email, path);

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });

    const createdPatientData = await tx.patient.create({
      data: { ...data.patient, profilePhoto: secure_url },
    });
    return createdPatientData;
  });
  return result;
};

const getAllUserFromDB = async (query: TFilterUser, options: TPagination) => {
  const { searchTerm, ...filterData } = query;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const andCondition: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: searchFields.map((filed) => ({
        [filed]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereCondition: Prisma.UserWhereInput = { AND: andCondition };
  console.log(andCondition);
  const result = await prisma.user.findMany({
    where: whereCondition,
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChang: true,
      status: true,
      updatedAt: true,
      createdAt: true,
    },
  });
  const total = await prisma.user.count({ where: whereCondition });
  return {
    meta: { page, limit, total },
    data: result,
  };
};
const changedStatusIntoDB = async (id: string, status: userStatus) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });
  return result;
};
const getProfileFromDB = async (user: JwtPayload) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
    include: {
      admin: user.role === userRole.ADMIN || user.role === userRole.SUPER_ADMIN,
      doctor: user.role === userRole.DOCTOR,
      patient: user.role === userRole.PATIENT,
    },
  });
  return result;
};
const updateMyProfile = async (
  user: JwtPayload,
  data: Partial<Admin | Doctor | Patient>,
  file: TFileImage
) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: user.userId,
      status: userStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exists!");
  }

  if (file) {
    const path = file.path;
    const { secure_url } = await sendImageToCloudinary("", path);
    data.profilePhoto = secure_url;
  }

  let profileData;
  if (userData?.role === userRole.ADMIN) {
    profileData = await prisma.admin.update({
      where: {
        email: userData.email,
      },
      data: data as Partial<Admin>,
    });
  } else if (userData?.role === userRole.DOCTOR) {
    profileData = await prisma.doctor.update({
      where: {
        email: userData.email,
      },
      data: data as Partial<Doctor>,
    });
  } else if (userData?.role === userRole.PATIENT) {
    profileData = await prisma.patient.update({
      where: {
        email: userData.email,
      },
      data: data as Partial<Patient>,
    });
  }

  // if (profileData && "address" in profileData) {
  //   const { id, email, name, contactNumber, address } = profileData;
  //   await index.updateDocuments([{ id, email, name, contactNumber, address }]);
  // }

  return { ...profileData, ...userData };
};
export const userService = {
  createAdminIntoDB,
  createDoctorIntoDB,
  createPatientIntoDB,
  getAllUserFromDB,
  changedStatusIntoDB,
  getProfileFromDB,
  updateMyProfile
};
