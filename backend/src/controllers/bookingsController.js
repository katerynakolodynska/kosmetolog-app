import { Booking } from "../db/models/booking.js";
import { Specialist } from "../db/models/specialist.js";
import { twilioClient } from "../utils/twilioClient.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import mongoose from "mongoose";
import { Service } from "../db/models/service.js";
import { bookingSchema } from "../validation/bookingSchema.js";
import { TelegramUser } from "../db/models/telegramUser.js";
import { bot } from "../utils/telegramBot.js";

export const getAllBooking = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("specialistId", "name")
      .sort({ date: 1, time: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    console.log("📥 Новий запит на створення запису:", req.body);

    const { error, value } = bookingSchema.validate(req.body);
    if (error) {
      console.log("❌ Валідація не пройдена:", error.details[0].message);
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, phone, service, date, time, comment, specialistId } = value;
    const cleanPhone = phone.replace(/\D/g, ""); // очищений номер типу 48690682583

    const serviceData = await Service.findById(service);
    if (!serviceData) {
      console.log("❌ Послугу не знайдено в базі");
      return res.status(400).json({ message: "Невірна послуга" });
    }

    const query = { date, time };
    if (specialistId) {
      query.specialistId = new mongoose.Types.ObjectId(specialistId);
    }

    const alreadyExists = await Booking.findOne(query);
    if (alreadyExists) {
      console.log("⚠️ Обраний слот зайнятий:", query);
      return res
        .status(409)
        .json({ message: "Wybrany termin jest już zajęty." });
    }

    let finalSpecialistId = specialistId;
    if (!finalSpecialistId) {
      const candidates = await Specialist.find({
        categories: serviceData.category,
        isActive: true,
      });

      const bookings = await Booking.find({ date, time });
      const busyIds = bookings.map((b) => String(b.specialistId));
      const available = candidates.find(
        (s) => !busyIds.includes(String(s._id))
      );

      if (!available) {
        console.log("❌ Немає вільного спеціаліста");
        return res.status(400).json({ message: "Brak dostępnego specjalisty" });
      }

      finalSpecialistId = available._id;
    }

    const newBooking = await Booking.create({
      name,
      phone: cleanPhone, // <=== зберігаємо в єдиному форматі
      service,
      date,
      time,
      comment,
      specialistId: finalSpecialistId,
    });

    console.log("✅ Створено новий запис:", newBooking);

    const telegramUser = await TelegramUser.findOne({ phone: cleanPhone });
    const message = `✅ Привіт, ${name}!\nВаша реєстрація на '${serviceData.title.pl}' підтверджена.\n🗓 ${date}, 🕒 ${time}`;

    if (telegramUser?.chatId) {
      try {
        await bot.sendMessage(telegramUser.chatId, message);
        console.log("📤 Надіслано повідомлення в Telegram.");
      } catch (err) {
        console.warn("⚠️ Не вдалося надіслати повідомлення:", err.message);
      }
    } else {
      console.log("ℹ️ TelegramUser не знайдений або без chatId");
    }

    const e164 = `+${cleanPhone}`;
    try {
      await twilioClient.messages.create({
        body: `Witaj, ${name}! Twoja rezerwacja na '${serviceData.title.pl}' została przyjęta na ${date} o ${time}.`,
        from: getEnvVar("TWILIO_PHONE_NUMBER"),
        to: e164,
      });
      console.log("📤 SMS відправлено на:", e164);
    } catch (err) {
      console.error("❌ SMS помилка:", err.message);
    }

    return res.status(201).json(newBooking);
  } catch (err) {
    console.error("❌ Booking error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await Booking.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("specialistId", "name");

    if (!updated) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBusyTimes = async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: "Missing date" });

  try {
    const bookings = await Booking.find({ date }).select(
      "date time specialistId"
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
