import express from "express";
import ctrlWrapper from "../middlewares/ctrlWrapper.js";
import { validateBody } from "../utils/validateBody.js";
import { bookingSchema } from "../validation/bookingSchema.js";
import * as bookingsCtrl from "../controllers/bookingsController.js";

const router = express.Router();

router.get("/", ctrlWrapper(bookingsCtrl.getAllBooking));
router.post(
  "/",
  validateBody(bookingSchema),
  ctrlWrapper(bookingsCtrl.createBooking)
);
router.put("/:id", ctrlWrapper(bookingsCtrl.updateBooking));
router.delete("/:id", ctrlWrapper(bookingsCtrl.deleteBooking));
router.get("/busy", ctrlWrapper(bookingsCtrl.getBusyTimes));

export default router;
