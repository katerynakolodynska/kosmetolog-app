import mongoose from "mongoose";

const telegramUserSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true },
    username: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);

export const TelegramUser = mongoose.model("TelegramUser", telegramUserSchema);
