import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false }
);

const beforeAfterSchema = new mongoose.Schema(
  {
    serviceKey: { type: String, required: true },
    beforeImg: { type: imageSchema, required: true },
    afterImg: { type: imageSchema, required: true },
  },
  { timestamps: true }
);

export const BeforeAfter = mongoose.model("BeforeAfter", beforeAfterSchema);
