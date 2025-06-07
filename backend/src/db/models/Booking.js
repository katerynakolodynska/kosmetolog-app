import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    service: { type: String, required: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
