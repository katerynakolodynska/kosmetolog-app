import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Admin } from "../db/models/admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const login = "KOLAKSA";
    const plainPassword = "kolaksa2025";
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const exists = await Admin.findOne({ login });
    if (exists) {
      console.log("Admin już istnieje");
    } else {
      await Admin.create({ login, passwordHash });
      console.log("Admin successfull");
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    mongoose.disconnect();
  }
};

run();
