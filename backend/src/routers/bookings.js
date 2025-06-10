import express from "express";
import ctrlWrapper from "../middlewares/ctrlWrapper.js";
import { validateBody } from "../utils/validateBody.js";
import { bookingSchema } from "../validation/bookingSchema.js";
import * as bookingsCtrl from "../controllers/bookingsController.js";

const router = express.Router();

router.get("/", ctrlWrapper(bookingsCtrl.getAll));
router.post(
  "/",
  validateBody(bookingSchema),
  ctrlWrapper(bookingsCtrl.createBooking)
);
router.delete("/:id", ctrlWrapper(bookingsCtrl.deleteBooking));

export default router;
