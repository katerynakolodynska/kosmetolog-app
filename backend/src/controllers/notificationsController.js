import { Notification } from "../db/models/notification.js";
import { NotificationSubscriber } from "../db/models/notificationSubscriber.js";
import { bot } from "../utils/telegramBot.js";

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

// 👉 Масова розсилка тільки через Telegram
export const sendNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    const subscribers = await NotificationSubscriber.find({
      chatId: { $exists: true, $ne: null },
    });

    for (const user of subscribers) {
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

    notification.sent = true;
    await notification.save();

    res.json({ message: "Сповіщення надіслано тільки через Telegram." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Помилка при розсилці", error: err.message });
  }
};
