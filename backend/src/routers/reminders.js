import express from "express";
import { sendReminderNotification } from "../utils/sendReminderNotification.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await sendReminderNotification();
    res.status(200).json({ message: "Нагадування надіслані" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
