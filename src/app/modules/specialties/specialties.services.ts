import { Specialties } from "@prisma/client";
import { prisma } from "../../../app";
import { sendImageToCloudinary } from "../../../shared/uploadImage";
import { TFileImage } from "../../interface/ImageResponseType";

const insertIntoDB = async (data: Specialties, file: TFileImage) => {
  const path = file.path;
  if (file) {
    const uploadIcon = await sendImageToCloudinary(data.title, path);
    data.icon = uploadIcon?.secure_url;
  }
  const result = await prisma.specialties.create({
    data: data,
  });
  return result;
};

const getAllFromDB = async () => {
  return await prisma.specialties.findMany();
};

const deleteFromDB = async (id: string) => {
  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};

export const SpecialtiesService = {
  insertIntoDB,
  getAllFromDB,
  deleteFromDB,
};
