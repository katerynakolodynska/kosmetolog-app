import mongoose from "mongoose";

const telegramUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    chatId: { type: String, required: true },
  },
  { timestamps: true }
);

export const TelegramUser = mongoose.model("TelegramUser", telegramUserSchema);
