import { Admin, Prisma, userStatus } from "@prisma/client";
import { searchFields } from "./admin.constant";
import { paginationHelper } from "../../../helper/pagination";
import { TFilterAdmin } from "./admin.interface";
import { TPagination } from "../../interface/pagination";
import { prisma } from "../../../app";


const getAllAdminFromDB = async (query: TFilterAdmin, options: TPagination) => {
  const { searchTerm, ...filterData } = query;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const andCondition: Prisma.AdminWhereInput[] = [];

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
  andCondition.push({
    isDeleted: false,
  });
  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };
  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.admin.count({ where: whereCondition });
  return {
    meta: { page, limit, total },
    data: result,
  };
};
const getAdminFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};
const updateIntoDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });
  return result;
};
const deleteIntoDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (tx) => {
    const adminDeletedData = await tx.admin.delete({
      where: {
        id,
      },
    });
    await tx.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });
    return adminDeletedData;
  });

  return result;
};
const softDeleteAdminIntoDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (tx) => {
    const adminDeletedData = await tx.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await tx.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: userStatus.DELETED,
      },
    });
    return adminDeletedData;
  });

  return result;
};
export const adminService = {
  getAllAdminFromDB,
  getAdminFromDB,
  updateIntoDB,
  deleteIntoDB,
  softDeleteAdminIntoDB,
};
