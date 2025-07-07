import mongoose from "mongoose";

const daySchema = new mongoose.Schema({
  date: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },
  open: {
    type: String,
    validate: {
      validator: (v) => v === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(v),
      message: "Невірний формат часу (HH:mm або пусто)",
    },
    default: "",
  },
  close: {
    type: String,
    validate: {
      validator: (v) => v === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(v),
      message: "Невірний формат часу (HH:mm або пусто)",
    },
    default: "",
  },
  comment: {
    type: String,
    default: "",
  },
});

const contactSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    match: /^\+48\s?\d{3}-\d{3}-\d{3}$/,
  },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  mapsLink: {
    type: String,
    required: true,
    match: /^https:\/\/www\.google\.com\/maps\/dir\/\?api=1&destination=.+/,
  },
  socialLinks: {
    telegram: { type: String, match: /^https?:\/\/.+/, default: "" },
    whatsapp: { type: String, match: /^https?:\/\/.+/, default: "" },
    viber: { type: String, match: /^https?:\/\/.+/, default: "" },
    instagram: { type: String, match: /^https?:\/\/.+/, default: "" },
    facebook: { type: String, match: /^https?:\/\/.+/, default: "" },
  },
  workHour: {
    type: [daySchema],
    validate: [(val) => val.length === 7, "Потрібно вказати 7 днів"],
  },
});

export const ContactInfo = mongoose.model("ContactInfo", contactSchema);
