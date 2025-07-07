import mongoose from "mongoose";

const specialistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      enum: ["cleaning", "massage", "injection"],
      required: true,
      default: [],
    },
    phone: {
      type: String,
      required: true,
    },
    availability: {
      type: [String],
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    description: {
      pl: { type: String },
      en: { type: String },
      uk: { type: String },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    vacation: {
      isOnVacation: { type: Boolean, default: false },
      from: { type: Date },
      to: { type: Date },
    },
    sickLeave: {
      isOnSickLeave: { type: Boolean, default: false },
      from: { type: Date },
      to: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

export const Specialist = mongoose.model("Specialist", specialistSchema);
