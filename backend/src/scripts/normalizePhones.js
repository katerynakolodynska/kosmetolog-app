// scripts/normalizePhones.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { Booking } from "../db/models/booking.js";
import { TelegramUser } from "../db/models/telegramUser.js";

const normalizePhone = (phone) => {
  if (!phone) return phone;
  return phone.replace(/\D/g, "");
};

const updatePhones = async () => {
  await mongoose.connect(process.env.MONGO_URL);

  console.log("🔗 Підключено до MongoDB");

  // === Booking Collection ===
  const bookings = await Booking.find({});
  for (const booking of bookings) {
    const clean = normalizePhone(booking.phone);
    if (clean && clean !== booking.phone) {
      console.log(`📞 Booking: ${booking.phone} → ${clean}`);
      booking.phone = clean;
      await booking.save();
    }
  }

  // === TelegramUser Collection ===
  const users = await TelegramUser.find({});
  for (const user of users) {
    const clean = normalizePhone(user.phone);
    if (clean && clean !== user.phone) {
      console.log(`📞 TelegramUser: ${user.phone} → ${clean}`);
      user.phone = clean;
      await user.save();
    }
  }

  console.log("✅ Номери успішно оновлено");

  await mongoose.disconnect();
  process.exit();
};

updatePhones().catch((err) => {
  console.error("❌ Сталася помилка:", err);
  process.exit(1);
});
