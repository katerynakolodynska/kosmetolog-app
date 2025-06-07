import { Booking } from "../db/models/Booking";

export const createBooking = async (req, res) => {
  try {
    const newBooking = await Booking.create(requestAnimationFrame.body);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
};

export const getBookingsByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const bookings = await Booking.find({ date });
    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: error.message });
  }
};
