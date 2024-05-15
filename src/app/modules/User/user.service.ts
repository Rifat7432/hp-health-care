import { userRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../../app";
import config from "../../config";
import { sendImageToCloudinary } from "../../../shared/uploadImage";
import { TFileImage } from "../../interface/ImageResponseType";
import { TCreateAdminData } from "./user.interface";

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
    const createdUserData = await tx.user.create({
      data: userData,
    });

    const createdAdminData = await tx.admin.create({
      data: { ...data.admin, profilePhoto: secure_url },
    });
    return { createdUserData, createdAdminData };
  });
  return result;
};
export const userService = {
  createAdminIntoDB,
};
