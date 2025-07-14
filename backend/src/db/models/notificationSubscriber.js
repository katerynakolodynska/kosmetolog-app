import mongoose from "mongoose";

const notificationSubscriberSchema = new mongoose.Schema(
  {
    playerId: { type: String }, // Web Push ID
    chatId: { type: String }, // Telegram ID
    phone: { type: String }, // для ідентифікації
    language: { type: String, default: "pl" },
  },
  { timestamps: true }
);

export const NotificationSubscriber = mongoose.model(
  "NotificationSubscriber",
  notificationSubscriberSchema
);
