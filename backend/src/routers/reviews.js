import express from "express";
import { upload } from "../middlewares/multer.js";
import ctrlWrapper from "../middlewares/ctrlWrapper.js";
import { reviewSchema } from "../validation/reviewSchema.js";
import * as reviewsCtrl from "../controllers/reviewsController.js";
import { validateBody } from "../utils/validateBody.js";

const router = express.Router();

router.get("/", ctrlWrapper(reviewsCtrl.getAllReview));
router.post(
  "/",
  validateBody(reviewSchema),
  upload.array("photos", 2),
  ctrlWrapper(reviewsCtrl.createReview)
);

router.delete("/:id", ctrlWrapper(reviewsCtrl.deleteReview));

export default router;
