import { Booking } from "../db/models/booking.js";
import { Service } from "../db/models/service.js";
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
  });

  for (const booking of bookings) {
    const service = await Service.findById(booking.service);
    if (!service) continue;

    // Тут можна зробити лог, додати в Google Calendar або надіслати email
    console.log(
      `✅ Знайдено запис: ${booking.name}, ${booking.phone}, ${service.title?.pl}`
    );
  }
};
