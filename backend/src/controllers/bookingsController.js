import { Booking } from "../db/models/Booking.js";

export const getAll = async (req, res) => {
  const bookings = await Booking.find().sort({ date: 1, time: 1 });
  res.json(bookings);
};

export const createBooking = async (req, res) => {
  const { name, phone, service, date, time, comment } = req.body;

  // Заборона дублю по часу (опційно)
  const alreadyExists = await Booking.findOne({ date, time, service });
  if (alreadyExists) {
    return res.status(409).json({
      message: "Wybrany termin jest już zajęty.",
    });
  }

  const booking = await Booking.create({
    name,
    phone,
    service,
    date,
    time,
    comment,
  });
  res.status(201).json(booking);
};

export const deleteBooking = async (req, res) => {
  const { id } = req.params;
  await Booking.findByIdAndDelete(id);
  res.status(204).send();
};
