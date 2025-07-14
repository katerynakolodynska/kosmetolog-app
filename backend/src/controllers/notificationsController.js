import { Notification } from "../db/models/notification.js";
import { NotificationSubscriber } from "../db/models/notificationSubscriber.js";
import { bot } from "../utils/telegramBot.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// 👉 Створити нове повідомлення
export const createNotification = async (req, res) => {
  try {
    const { title, text } = req.body;

    if (!title || !text) {
      return res.status(400).json({ message: "Title і text обов’язкові" });
    }

    const notification = await Notification.create({ title, text });
    res.status(201).json(notification);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Помилка при створенні", error: e.message });
  }
};

// 👉 Отримати всі повідомлення (для адмінки)
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Помилка при завантаженні", error: e.message });
  }
};

// 👉 Масова розсилка
export const sendNotification = async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findById(id);

  if (!notification)
    return res.status(404).json({ message: "Notification not found" });

  // 🔄 Всі підписники (Telegram + WebPush)
  const subscribers = await NotificationSubscriber.find();

  // === 1. Telegram
  for (const user of subscribers) {
    if (!user.chatId) continue;

    try {
      await bot.sendMessage(
        user.chatId,
        `📢 *${notification.title}*\n\n${notification.text}`,
        { parse_mode: "Markdown" }
      );
    } catch (e) {
      console.log(`❌ Telegram помилка для ${user.chatId}:`, e.message);
    }
  }

  // === 2. WebPush (OneSignal)
  const playerIds = subscribers.map((user) => user.playerId).filter(Boolean);

  if (playerIds.length > 0) {
    try {
      await axios.post(
        "https://onesignal.com/api/v1/notifications",
        {
          app_id: process.env.ONESIGNAL_APP_ID,
          include_player_ids: playerIds,
          headings: { pl: notification.title, uk: notification.title },
          contents: { pl: notification.text, uk: notification.text },
        },
        {
          headers: {
            Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (e) {
      console.log("❌ WebPush помилка:", e.message);
    }
  }

  // ✅ Позначити як надіслане
  notification.sent = true;
  await notification.save();

  res.json({ message: "Сповіщення надіслано через Telegram і WebPush." });
};
