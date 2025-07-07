import mongoose from "mongoose";

const translationSchema = new mongoose.Schema({
  pl: { type: String, required: true },
  uk: { type: String, required: true },
  en: { type: String, required: true },
});

const serviceSchema = new mongoose.Schema({
  title: {
    type: translationSchema,
    required: true,
  },
  description: {
    type: translationSchema,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["cleaning", "massage", "injection"],
    required: true,
  },
  specialists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialist",
    },
  ],
});

export const Service = mongoose.model("Service", serviceSchema);
