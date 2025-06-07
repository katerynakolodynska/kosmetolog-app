import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs/promises";
import { getEnvVar } from "./getEnvVar.js";
import { CLOUDINARY } from "../constants/index.js";

cloudinary.config({
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
  secure: true,
});

export const saveFileToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(file.path);
  await fs.unlink(file.path);
  return result.secure_url;
};
