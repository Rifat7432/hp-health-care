import { Doctor, Prisma, Specialties, userStatus } from "@prisma/client";
import {
  IDoctorFilterRequest,
  IDoctorUpdate,
  ISpecialties,
} from "./doctor.interface";
import { prisma } from "../../../app";
import { AppError } from "../../../errors/appErrors";
import httpStatus from "http-status";
import { asyncForEach } from "../../../shared/utils";
import { paginationHelper } from "../../../helper/pagination";
import { TPagination } from "../../interface/pagination";
import { doctorSearchableFields } from "./doctor.constants";

const insertIntoDB = async (data: Doctor): Promise<Doctor> => {
  const result = await prisma.doctor.create({
    data,
  });
  return result;
};

const getAllFromDB = async (
  filters: IDoctorFilterRequest,
  options: TPagination
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (specialties && specialties.length > 0) {
    // Corrected specialties condition
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.doctor.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
  console.log(id);
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
      doctorSchedule: true,
      Review: true,
    },
  });
  console.log(result);
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IDoctorUpdate>
): Promise<Doctor | null> => {
  const { specialties, ...doctorData } = payload;
  await prisma.$transaction(async (transactionClient) => {
    const result = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, "Unable to update Doctor");
    }
    if (specialties && specialties.length > 0) {
      const deleteSpecialties = specialties.filter(
        (specialty) => specialty.specialtiesId && specialty.isDeleted
      );

      const newSpecialties = specialties.filter(
        (specialty) => specialty.specialtiesId && !specialty.isDeleted
      );

      await asyncForEach(
        deleteSpecialties,
        async (deleteDoctorSpeciality: ISpecialties) => {
          await transactionClient.doctorSpecialties.deleteMany({
            where: {
              AND: [
                {
                  doctorId: id,
                },
                {
                  specialtiesId: deleteDoctorSpeciality.specialtiesId,
                },
              ],
            },
          });
        }
      );
      await asyncForEach(
        newSpecialties,
        async (insertDoctorSpecialty: ISpecialties) => {
          //@ needed for already added specialties
          const existingSpecialties = await prisma.doctorSpecialties.findFirst({
            where: {
              specialtiesId: insertDoctorSpecialty.specialtiesId,
              doctorId: id,
            },
          });

          if (!existingSpecialties) {
            await transactionClient.doctorSpecialties.create({
              data: {
                doctorId: id,
                specialtiesId: insertDoctorSpecialty.specialtiesId,
              },
            });
          }
        }
      );
    }

    return result;
  });

  const responseData = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  return responseData;
};

const deleteFromDB = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: deleteDoctor.email,
      },
    });

    // await deleteDoctorFromMeili(deleteDoctor.id);

    return deleteDoctor;
  });
};

const softDelete = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deleteDoctor.email,
      },
      data: {
        status: userStatus.DELETED,
      },
    });

    return deleteDoctor;
  });
};

export const DoctorService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDelete,
};
