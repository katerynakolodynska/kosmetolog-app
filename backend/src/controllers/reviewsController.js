import { Review } from "../db/models/review.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

export const getAll = async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
};

export const createReview = async (req, res) => {
  const { name, comment, rating, emailOrPhone } = req.body;

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
    emailOrPhone,
    photos,
  });
  res.status(201).json(review);
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;
  await Review.findByIdAndDelete(id);
  res.status(204).send();
};
