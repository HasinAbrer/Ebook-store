import { Request } from "express";
import { File, FileJSON, Files } from "formidable";
import cloudinary from "src/cloud/cloudinary";

export const updateAvatarToCloudinary = async (
  file: File,
  avartarId?: string
) => {
  if (avartarId) {
    // if user already has a profile image remove the old first
    await cloudinary.uploader.destroy(avartarId);
  }

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    file.filepath,
    {
      width: 300,
      height: 300,
      gravity: "face",
      crop: "fill",
    }
  );

  return { id: public_id, url: secure_url };
};
