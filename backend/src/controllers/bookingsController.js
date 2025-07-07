import { Booking } from "../db/models/booking.js";
import { Specialist } from "../db/models/specialist.js";
import { twilioClient } from "../utils/twilioClient.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import mongoose from "mongoose";
import { Service } from "../db/models/service.js";
import { bookingSchema } from "../validation/bookingSchema.js";
// import { format } from "date-fns";
// import { sendTelegramMessage } from "../utils/telegramBot.js";

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
    const { error, value } = bookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, phone, service, date, time, comment, specialistId } = value;

    const serviceData = await Service.findById(service);
    if (!serviceData) {
      return res.status(400).json({ message: "Невірна послуга" });
    }

    const query = { date, time };
    if (specialistId) {
      query.specialistId = new mongoose.Types.ObjectId(specialistId);
    }

    const alreadyExists = await Booking.findOne(query);
    if (alreadyExists) {
      return res
        .status(409)
        .json({ message: "Wybrany termin jest już zajęty." });
    }

    let finalSpecialistId = specialistId;
    if (!finalSpecialistId) {
      const allCandidates = await Specialist.find({
        categories: serviceData.category,
        isActive: true,
      });

      const allBookings = await Booking.find({ date, time });
      const busyIds = allBookings.map((b) => String(b.specialistId));

      const foundSpecialist = allCandidates.find(
        (s) => !busyIds.includes(String(s._id))
      );

      if (!foundSpecialist) {
        return res.status(400).json({
          message: "Brak dostępnego specjalisty dla tej kategorii",
        });
      }

      finalSpecialistId = foundSpecialist._id;
    }

    const newBooking = await Booking.create({
      name,
      phone,
      service: new mongoose.Types.ObjectId(service),
      date,
      time,
      comment,
      specialistId: new mongoose.Types.ObjectId(finalSpecialistId),
    });

    const normalizedPhone = phone.replace(/\D/g, "");
    const e164Phone = `+${normalizedPhone}`;

    try {
      const sms = await twilioClient.messages.create({
        body: `Witaj, ${name}! Twoja rezerwacja na '${serviceData.title.pl}' została przyjęta na ${date} o ${time}. Dziękujemy!`,
        from: getEnvVar("TWILIO_PHONE_NUMBER"),
        to: e164Phone,
      });

      console.log(
        "✅ SMS sent to:",
        e164Phone,
        "| SID:",
        sms.sid,
        "| Status:",
        sms.status
      );
    } catch (smsError) {
      console.error("❌ SMS sending error:", smsError.message);
      console.error("🔍 Code:", smsError.code, "| Info:", smsError.moreInfo);
    }

    return res.status(201).json(newBooking);
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({ message: error.message });
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
    res.json(bookings); // [{ date, time, specialistId }]
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
