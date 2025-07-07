import { ContactInfo } from "../db/models/contact.js";
import { contactSchema } from "../validation/contactSchema.js";

export const getContactInfo = async (req, res) => {
  try {
    const data = await ContactInfo.findOne();
    if (!data)
      return res
        .status(404)
        .json({ message: "Контактна інформація ще не створена" });
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Помилка отримання даних", error: error.message });
  }
};

export const createContactInfo = async (req, res) => {
  try {
    const existing = await ContactInfo.findOne();
    if (existing) {
      return res
        .status(400)
        .json({ message: "Контактна інформація вже існує" });
    }

    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const contact = await ContactInfo.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Помилка створення", error: error.message });
  }
};

export const updateContactInfo = async (req, res) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const updated = await ContactInfo.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });

    res.json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Помилка оновлення", error: error.message });
  }
};

export const deleteContactInfo = async (req, res) => {
  try {
    const result = await ContactInfo.deleteMany({});
    res.json({ message: "Контакт видалено", deleted: result.deletedCount });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Помилка видалення", error: error.message });
  }
};
