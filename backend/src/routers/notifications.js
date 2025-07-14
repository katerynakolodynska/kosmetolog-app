import express from "express";
import {
  createNotification,
  getAllNotifications,
  sendNotification,
} from "../controllers/notificationsController.js";

const router = express.Router();

router.post("/", createNotification);
router.get("/", getAllNotifications);
router.post("/send/:id", sendNotification);

export default router;
