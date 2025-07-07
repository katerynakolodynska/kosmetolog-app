import { Review } from "../db/models/review.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

export const getAllReview = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { name, comment = "", rating, phone } = req.body;

    const exists = await Review.findOne({ phone });
    if (exists) {
      return res
        .status(409)
        .json({ message: "Ten numer telefonu już został użyty do opinii." });
    }

    const photos = [];
    if (req.files?.length) {
      for (const file of req.files) {
        const url = await saveFileToCloudinary(file);
        photos.push(url);
      }
    }

    const review = await Review.create({
      name,
      comment,
      rating,
      phone,
      photos,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
