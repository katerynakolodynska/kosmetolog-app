import cron from "node-cron";
import { sendReminderNotification } from "../utils/sendReminderNotification.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

// 🔁 Запускаємо щодня о 08:00 ранку
cron.schedule("0 8 * * *", async () => {
  console.log("🕗 Щоденний запуск о 08:00 — надсилаємо нагадування...");
  try {
    await sendReminderNotification();
  } catch (err) {
    console.error("❌ Помилка під час надсилання нагадування:", err.message);
  }
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("🟢 Підключено до MongoDB");
    console.log("⏳ Очікування запуску нагадувань...");
  })
  .catch((err) => {
    console.error("❌ MongoDB помилка:", err.message);
  });
