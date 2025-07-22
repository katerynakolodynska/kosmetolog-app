import { Booking } from "../db/models/booking.js";
import { Specialist } from "../db/models/specialist.js";
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
      return res.status(400).json({ message: "validationError" });
    }

    const {
      name,
      phone,
      service,
      date,
      time,
      comment,
      specialistId,
      playerId,
      occupiedSlots,
    } = value;
    const cleanPhone = phone.replace(/\D/g, "");

    // ❗ Перевірка на дубль
    const duplicateBooking = await Booking.findOne({
      phone: cleanPhone,
      date,
      time,
    });
    if (duplicateBooking) {
      return res.status(409).json({ message: "alreadyBookedByClient" });
    }

    // ❗ Перевірка послуги
    const serviceData = await Service.findById(service);
    if (!serviceData) {
      return res.status(400).json({ message: "invalidService" });
    }

    // ❗ Перевірка зайнятості спеціаліста (якщо обраний)
    const query = { date, time };
    if (specialistId)
      query.specialistId = new mongoose.Types.ObjectId(specialistId);

    const alreadyExists = await Booking.findOne(query);
    if (alreadyExists) {
      return res.status(409).json({ message: "slotAlreadyTaken" });
    }

    // ❗ Автовибір спеціаліста
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
        return res.status(400).json({ message: "noAvailableSpecialist" });
      }

      finalSpecialistId = available._id;
    }
    console.log("✅ Валідація пройдена. value:", value);
    const newBooking = await Booking.create({
      name,
      phone: cleanPhone,
      service,
      date,
      time,
      comment,
      specialistId: finalSpecialistId,
      occupiedSlots,
    });

    console.log("✅ Створено новий запис:", newBooking);

    // === Telegram
    const telegramUser = await TelegramUser.findOne({ phone: cleanPhone });
    const message = `✅ Привіт, ${name}!\nВаша реєстрація на '${serviceData.title.pl}' підтверджена.\n🗓 ${date}, 🕒 ${time}`;

    if (telegramUser?.chatId) {
      try {
        await bot.sendMessage(telegramUser.chatId, message);
        console.log("📤 Надіслано в Telegram");
      } catch (err) {
        console.warn("⚠️ Telegram помилка:", err.message);
      }
    }

    return res.status(201).json(newBooking);
  } catch (err) {
    console.error("❌ Booking error:", err.message);
    return res.status(500).json({ message: "bookingError" });
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
      "date time specialistId occupiedSlots"
    );

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
