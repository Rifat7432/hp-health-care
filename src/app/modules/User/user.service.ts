import {userRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../../app";


const createAdminIntoDB = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 12);
  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: userRole.ADMIN,
  };

  const result = await prisma.$transaction(async (tx) => {
    const createdUserData = await tx.user.create({
      data: userData,
    });
    const createdAdminData = await tx.admin.create({
      data: data.admin,
    });
    return { createdUserData, createdAdminData };
  });
  return result;
};
export const userService = {
  createAdminIntoDB,
};
