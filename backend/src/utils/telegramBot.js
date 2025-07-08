import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

export const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

import { TelegramUser } from "../db/models/telegramUser.js";
import { Booking } from "../db/models/booking.js";

// /start
bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
  const chatId = String(msg.chat.id);
  const username = await TelegramUser.findOne({ chatId });

  const rawPhone = match[1] || "";
  const phone = user?.phone?.replace(/\D/g, "");

  const existing = await TelegramUser.findOne({ chatId });
  const isFirstTime = !existing?.phone && phone;

  await TelegramUser.updateOne(
    { chatId },
    { chatId, username, ...(phone && { phone }) },
    { upsert: true }
  );

  if (isFirstTime) {
    return bot.sendMessage(
      chatId,
      `👋 Вітаю, ${
        username || "користувач"
      }!\nВи підписані на сповіщення.\nКоманди:\n/my — переглянути записи\n/unsubscribe — відписатися`
    );
  }
});

// /my
bot.onText(/\/my/, async (msg) => {
  const chatId = String(msg.chat.id);
  const user = await TelegramUser.findOne({ chatId });

  if (!user?.phone) {
    return bot.sendMessage(
      chatId,
      "❗️Ваш номер не знайдено. Перейдіть по лінку з сайту."
    );
  }

  const cleanPhone = user.phone.replace(/\D/g, ""); // Очистити телефон

  const bookings = await Booking.find({ phone: cleanPhone })
    .sort({ date: -1, time: -1 })
    .limit(10)
    .populate("service");

  if (!bookings.length) {
    return bot.sendMessage(chatId, "⛔️ У вас немає активних записів.");
  }

  const msgText = bookings
    .map((b) => {
      const title = b.service?.title?.pl || "Послуга";
      return `📅 ${b.date} ${b.time}\n💅 ${title}`;
    })
    .join("\n\n");

  return bot.sendMessage(chatId, `📋 Ваші записи:\n\n${msgText}`);
});

// /unsubscribe
bot.onText(/\/unsubscribe/, async (msg) => {
  const chatId = String(msg.chat.id);
  await TelegramUser.deleteOne({ chatId });
  return bot.sendMessage(chatId, "❌ Ви успішно відписались.");
});
