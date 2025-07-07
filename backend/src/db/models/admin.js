import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

adminSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

export const Admin = mongoose.model("Admin", adminSchema);
