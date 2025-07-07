import { BeforeAfter } from "../db/models/beforeAfter.js";
import { beforeAfterSchema } from "../validation/beforeAfterSchema.js";
import {
  saveFileToCloudinary,
  deleteFromCloudinary,
} from "../utils/saveFileToCloudinary.js";

export const getAllBeforeAfter = async (req, res) => {
  const items = await BeforeAfter.find().sort({ createdAt: -1 });
  res.json(items);
};

export const createBeforeAfter = async (req, res) => {
  const { serviceKey } = req.body;

  const { error } = beforeAfterSchema.validate({ serviceKey });
  if (error) return res.status(400).json({ message: error.details[0].message });

  if (!req.files?.before || !req.files?.after) {
    return res.status(400).json({ message: "Передайте зображення до і після" });
  }

  const before = await saveFileToCloudinary(
    req.files.before[0],
    "before-after"
  );
  const after = await saveFileToCloudinary(req.files.after[0], "before-after");

  const newItem = await BeforeAfter.create({
    serviceKey,
    beforeImg: before,
    afterImg: after,
  });

  res.status(201).json(newItem);
};

export const updateBeforeAfter = async (req, res) => {
  const { id } = req.params;
  const { serviceKey } = req.body;

  const { error } = beforeAfterSchema.validate({ serviceKey }); // ✅ перевірка
  if (error) return res.status(400).json({ message: error.details[0].message });

  const item = await BeforeAfter.findById(id);
  if (!item) return res.status(404).json({ message: "Не знайдено" });

  const updated = {
    serviceKey,
    beforeImg: item.beforeImg,
    afterImg: item.afterImg,
  };

  if (req.files?.before) {
    await deleteFromCloudinary(item.beforeImg.public_id);
    updated.beforeImg = await saveFileToCloudinary(
      req.files.before[0],
      "before-after"
    );
  }

  if (req.files?.after) {
    await deleteFromCloudinary(item.afterImg.public_id);
    updated.afterImg = await saveFileToCloudinary(
      req.files.after[0],
      "before-after"
    );
  }

  const result = await BeforeAfter.findByIdAndUpdate(id, updated, {
    new: true,
  });
  res.json(result);
};

export const deleteBeforeAfter = async (req, res) => {
  const { id } = req.params;
  const item = await BeforeAfter.findById(id);
  if (!item) return res.status(404).json({ message: "Не знайдено" });

  await deleteFromCloudinary(item.beforeImg.public_id);
  await deleteFromCloudinary(item.afterImg.public_id);
  await BeforeAfter.findByIdAndDelete(id);

  res.status(204).send();
};
