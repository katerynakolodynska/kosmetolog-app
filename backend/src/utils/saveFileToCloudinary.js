import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getEnvVar } from "./getEnvVar.js";
import { CLOUDINARY } from "../constants/index.js";

cloudinary.config({
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
  secure: true,
});

// Зменшення та завантаження зображення на Cloudinary
export const saveFileToCloudinary = async (file, folder = "gallery") => {
  const resizedPath = `${file.path}-resized${path.extname(file.originalname)}`;

  // 🔧 Зменшуємо розмір до max 1200px (автоформат, автоякість)
  await sharp(file.path)
    .resize({ width: 1200, withoutEnlargement: true })
    .toFile(resizedPath);

  const result = await cloudinary.uploader.upload(resizedPath, {
    folder,
    resource_type: "image",
  });

  // 🧹 Видаляємо тимчасові файли
  await fs.unlink(file.path);
  await fs.unlink(resizedPath);

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

// Видалення з Cloudinary
export const deleteFromCloudinary = async (public_id) => {
  if (!public_id) return;
  await cloudinary.uploader.destroy(public_id);
};
