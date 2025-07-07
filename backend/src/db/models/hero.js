import mongoose from "mongoose";

const langTextSchema = new mongoose.Schema(
  {
    uk: { type: String, required: true },
    en: { type: String, required: true },
    pl: { type: String, required: true },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false }
);

const heroSchema = new mongoose.Schema(
  {
    introText: { type: langTextSchema, required: true },
    aboutText: { type: langTextSchema, required: true },
    specialistIntro: { type: langTextSchema, required: true },
    images: {
      type: [imageSchema],
      validate: {
        validator: (val) => val.length === 4,
        message: "Має бути рівно 4 зображення.",
      },
      required: true,
    },
  },
  { timestamps: true }
);

export const Hero = mongoose.model("Hero", heroSchema);
