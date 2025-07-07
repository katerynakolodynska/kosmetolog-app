import { Specialist } from "../db/models/specialist.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import {
  specialistSchema,
  statusSchema,
} from "../validation/specialistSchema.js";

const safeParse = (str, fallback = undefined) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

const normalizeDateFields = (period = {}, key = "vacation") => {
  const isOnFlag = key === "vacation" ? "isOnVacation" : "isOnSickLeave";
  return {
    [isOnFlag]: !!period?.from && !!period?.to,
    from: period?.from || null,
    to: period?.to || null,
  };
};

const checkAndUpdateStatuses = (specialist) => {
  const today = new Date();
  let updated = false;

  if (
    specialist.vacation?.isOnVacation &&
    specialist.vacation.to &&
    today > new Date(specialist.vacation.to)
  ) {
    specialist.isActive = true;
    specialist.vacation.isOnVacation = false;
    updated = true;
  }

  if (
    specialist.sickLeave?.isOnSickLeave &&
    specialist.sickLeave.to &&
    today > new Date(specialist.sickLeave.to)
  ) {
    specialist.isActive = true;
    specialist.sickLeave.isOnSickLeave = false;
    updated = true;
  }

  return updated;
};

export const getAllSpecialists = async (req, res) => {
  try {
    const specialists = await Specialist.find();
    for (const spec of specialists) {
      const changed = checkAndUpdateStatuses(spec);
      if (changed) await spec.save();
    }
    res.json(specialists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSpecialist = async (req, res) => {
  try {
    const {
      name,
      phone,
      availability,
      categories,
      description,
      isActive,
      vacation,
      sickLeave,
    } = req.body;

    const parsedCategories = safeParse(categories, []);
    const parsedDescription = safeParse(description, {});
    const parsedAvailability = safeParse(availability, []);
    const parsedVacation = normalizeDateFields(
      safeParse(vacation, {}),
      "vacation"
    );
    const parsedSickLeave = normalizeDateFields(
      safeParse(sickLeave, {}),
      "sickLeave"
    );

    const { error } = specialistSchema.validate({
      name,
      phone,
      availability: parsedAvailability,
      categories: parsedCategories,
      description: parsedDescription,
      photo: req.file ? "https://cloudinary.com" : "",
      vacation: parsedVacation,
      sickLeave: parsedSickLeave,
      isActive,
    });

    if (error) return res.status(400).json({ message: error.message });

    let photo = "";
    if (req.file) {
      photo = await saveFileToCloudinary(req.file);
    }

    const specialist = await Specialist.create({
      name,
      phone,
      availability: parsedAvailability,
      categories: parsedCategories,
      description: parsedDescription,
      vacation: parsedVacation,
      sickLeave: parsedSickLeave,
      photo,
      isActive: isActive === "true" || isActive === true,
    });

    res.status(201).json(specialist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSpecialist = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      name,
      phone,
      availability,
      categories,
      description,
      isActive,
      vacation,
      sickLeave,
      removePhoto,
    } = req.body;

    const specialist = await Specialist.findById(id);
    if (!specialist)
      return res.status(404).json({ message: "Specialist not found" });

    const parsedCategories = safeParse(categories, []);
    const parsedDescription = safeParse(description, {});
    const parsedAvailability = safeParse(availability, []);
    const parsedVacation = normalizeDateFields(
      safeParse(vacation, specialist.vacation),
      "vacation"
    );
    const parsedSickLeave = normalizeDateFields(
      safeParse(sickLeave, specialist.sickLeave),
      "sickLeave"
    );

    const { error } = specialistSchema.validate({
      name,
      phone,
      availability: parsedAvailability,
      categories: parsedCategories,
      description: parsedDescription,
      photo: specialist.photo,
      vacation: parsedVacation,
      sickLeave: parsedSickLeave,
      isActive,
    });

    if (error) return res.status(400).json({ message: error.message });

    let photo = specialist.photo;
    if (removePhoto === "true") photo = "";
    if (req.file) photo = await saveFileToCloudinary(req.file);

    const updated = await Specialist.findByIdAndUpdate(
      id,
      {
        name,
        phone,
        availability: parsedAvailability,
        categories: parsedCategories,
        description: parsedDescription,
        vacation: parsedVacation,
        sickLeave: parsedSickLeave,
        photo,
        isActive: isActive === "true" || isActive === true,
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSpecialist = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Specialist.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Specialist not found" });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const toggleSpecialistStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const { error } = statusSchema.validate({ isActive });
  if (error) return res.status(400).json({ message: error.message });

  try {
    const specialist = await Specialist.findById(id);
    if (!specialist)
      return res.status(404).json({ message: "Specialist not found" });

    specialist.isActive = isActive;
    await specialist.save();

    res.json(specialist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
