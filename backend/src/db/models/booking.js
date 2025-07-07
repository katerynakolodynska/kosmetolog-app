import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      default: "",
    },
    specialistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialist",
      required: false,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "cancelled"],
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = mongoose.model("Booking", bookingSchema);
