import { Hero } from "../db/models/hero.js";
import { heroSchema } from "../validation/heroSchema.js";
import {
  saveFileToCloudinary,
  deleteFromCloudinary,
} from "../utils/saveFileToCloudinary.js";

export const getHero = async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

export const createHero = async (req, res) => {
  try {
    const { introText, aboutText, specialistIntro } = req.body;
    const files = req.files;

    if (!files || files.length !== 4) {
      return res
        .status(400)
        .json({ message: "Потрібно завантажити рівно 4 зображення." });
    }

    const uploadedImages = await Promise.all(
      files.map((file) => saveFileToCloudinary(file))
    );

    const data = {
      introText: JSON.parse(introText),
      aboutText: JSON.parse(aboutText),
      specialistIntro: JSON.parse(specialistIntro),
      images: uploadedImages,
    };

    const { error } = heroSchema.validate(data, { abortEarly: false });
    if (error) {
      return res
        .status(400)
        .json({ message: "Помилка валідації", details: error.details });
    }

    const created = await Hero.create(data);
    res.status(201).json(created);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Помилка створення hero", error: error.message });
  }
};

export const updateHero = async (req, res) => {
  try {
    const existing = await Hero.findOne();
    if (!existing) {
      return res.status(404).json({ message: "Hero не знайдено" });
    }

    const { introText, aboutText, specialistIntro } = req.body;
    const files = req.files;

    let updatedImages = existing.images;

    if (files && files.length === 4) {
      await Promise.all(
        existing.images.map((img) => deleteFromCloudinary(img.public_id))
      );
      updatedImages = await Promise.all(
        files.map((file) => saveFileToCloudinary(file))
      );
    }

    const data = {
      introText: JSON.parse(introText),
      aboutText: JSON.parse(aboutText),
      specialistIntro: JSON.parse(specialistIntro),
      images: updatedImages,
    };

    const { error } = heroSchema.validate(data, { abortEarly: false });
    if (error) {
      return res
        .status(400)
        .json({ message: "Помилка валідації", details: error.details });
    }

    const updated = await Hero.findByIdAndUpdate(existing._id, data, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Помилка оновлення hero", error: error.message });
  }
};

export const deleteHeroImage = async (req, res) => {
  try {
    const { id } = req.params;

    const hero = await Hero.findOne();
    if (!hero) return res.status(404).json({ message: "Hero не знайдено" });

    const image = hero.images.find((img) => img.public_id === id);
    if (!image)
      return res.status(404).json({ message: "Зображення не знайдено" });

    await deleteFromCloudinary(id);

    hero.images = hero.images.filter((img) => img.public_id !== id);
    await hero.save();

    res.status(200).json({ message: "Зображення видалено" });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};
