import express from "express";
import { handleTelegramMessage } from "../controllers/telegramController.js";

const router = express.Router();

router.post("/webhook", handleTelegramMessage);

export default router;
