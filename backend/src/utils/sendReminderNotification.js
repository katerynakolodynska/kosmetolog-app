import { Booking } from "../db/models/booking.js";
import { Service } from "../db/models/service.js";
import { sendPushNotification } from "./sendPush.js";
import mongoose from "mongoose";

export const sendReminderNotification = async () => {
  const now = new Date();
  const reminderTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // через 24 год

  const targetDate = reminderTime.toISOString().split("T")[0];
  const targetHour =
    reminderTime.getHours().toString().padStart(2, "0") + ":00";

  console.log("🔔 Перевірка нагадувань на", targetDate, targetHour);

  const bookings = await Booking.find({
    date: targetDate,
    time: targetHour,
    playerId: { $exists: true },
  });

  for (const booking of bookings) {
    const service = await Service.findById(booking.service);
    if (!service || !booking.playerId) continue;

    const title = {
      pl: "Jutrzejsza wizyta",
      uk: "Завтрашній запис",
      en: "Tomorrow's appointment",
    };

    const body = {
      pl: `Przypomnienie: '${service.title.pl}' jutro o ${booking.time}`,
      uk: `Нагадування: '${service.title.uk}' завтра о ${booking.time}`,
      en: `Reminder: '${service.title.en}' tomorrow at ${booking.time}`,
    };

    try {
      await sendPushNotification(booking.playerId, title, body);
      console.log(`📤 Нагадування надіслано для ${booking.phone}`);
    } catch (err) {
      console.warn("❌ Помилка нагадування:", err.message);
    }
  }
};
