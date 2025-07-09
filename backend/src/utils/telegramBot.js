import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

export const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

import { TelegramUser } from "../db/models/telegramUser.js";
import { Booking } from "../db/models/booking.js";

// /start — запрошує поділитися номером
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  const existing = await TelegramUser.findOne({ chatId });
  if (existing?.phone) {
    return bot.sendMessage(chatId, "✅ Ви вже підписані.");
  }

  const opts = {
    reply_markup: {
      keyboard: [[{ text: "📱 Поділитися номером", request_contact: true }]],
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  };

  bot.sendMessage(
    chatId,
    "👋 Щоб отримувати сповіщення про записи, натисніть кнопку нижче:",
    opts
  );
});

// Коли користувач ділиться контактом
bot.on("contact", async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || "";
  const phone = msg.contact.phone_number.replace(/\D/g, ""); // лише цифри

  await TelegramUser.updateOne(
    { chatId },
    { chatId, phone, username },
    { upsert: true }
  );

  bot.sendMessage(
    chatId,
    `✅ Ви підписані на Telegram-сповіщення.

Команди:
🗂 /my — переглянути записи
❌ /unsubscribe — відписатися`
  );
});

// /my — показати записи
bot.onText(/\/my/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await TelegramUser.findOne({ chatId });

  if (!user?.phone) {
    return bot.sendMessage(
      chatId,
      "❗️Номер телефону не знайдено. Спочатку надішліть контакт через /start."
    );
  }

  const bookings = await Booking.find({ phone: user.phone })
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

// /unsubscribe — видалити
bot.onText(/\/unsubscribe/, async (msg) => {
  const chatId = msg.chat.id;
  await TelegramUser.deleteOne({ chatId });
  return bot.sendMessage(chatId, "❌ Ви успішно відписались.");
});
