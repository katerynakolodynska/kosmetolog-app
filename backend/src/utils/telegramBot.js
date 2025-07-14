import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

import { TelegramUser } from "../db/models/telegramUser.js";
import { Booking } from "../db/models/booking.js";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";

export const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

// ⭐️ Зареєструвати команди в меню Telegram
bot.setMyCommands([
  { command: "/book", description: "Zarezerwuj wizytę" },
  { command: "/my", description: "Moje wizyty" },
  { command: "/bonus", description: "Dostępny rabat lub bonus" },
  { command: "/support", description: "Pomoc / kontakt" },
  { command: "/unsubscribe", description: "Wypisz się z powiadomień" },
]);

// /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const existing = await TelegramUser.findOne({ chatId });

  if (existing?.phone) {
    return bot.sendMessage(chatId, "✅ Już jesteś zapisany na powiadomienia.");
  }

  const opts = {
    reply_markup: {
      keyboard: [
        [{ text: "📱 Udostępnij numer telefonu", request_contact: true }],
      ],
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  };

  bot.sendMessage(
    chatId,
    "👋 Aby otrzymywać powiadomienia o wizytach, naciśnij przycisk poniżej:",
    opts
  );
});

// Obsługa kontaktu
bot.on("contact", async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || "";
  const phone = msg.contact.phone_number.replace(/\D/g, "");

  await TelegramUser.updateOne(
    { chatId },
    { chatId, phone, username },
    { upsert: true }
  );

  bot.sendMessage(
    chatId,
    `✅ Subskrypcja aktywna!

⭐️ Główne komendy:
📅 /book — Zarezerwuj wizytę
🗂 /my — Moje wizyty
⭐️ /bonus — Dostępna promocja
💬 /support — Pomoc / kontakt
❌ /unsubscribe — Wypisz się`
  );
});

// /my — wizyty
bot.onText(/\/my/, async (msg) => {
  const chatId = msg.chat.id;
  const user = await TelegramUser.findOne({ chatId });

  if (!user?.phone) {
    return bot.sendMessage(
      chatId,
      "❗️ Numer nieznany. Udostępnij kontakt przez /start."
    );
  }

  const today = new Date().toISOString().split("T")[0];

  const bookings = await Booking.find({
    phone: user.phone,
    date: { $gte: today },
  })
    .sort({ date: 1, time: 1 })
    .populate("service");

  if (!bookings.length) {
    return bot.sendMessage(chatId, "⛔️ Brak nadchodzących wizyt.");
  }

  const msgText = bookings
    .map((b) => {
      const date = format(parseISO(b.date), "dd.MM.yyyy", { locale: pl });
      const time = b.time;
      const title = b.service?.title?.pl || "Usługa";
      return `📅 ${date} o ${time}\n💅 ${title}`;
    })
    .join("\n\n");

  return bot.sendMessage(chatId, `📋 Twoje wizyty:\n\n${msgText}`);
});

// /bonus — rabaty
bot.onText(/\/bonus/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "🎁 Obecnie dostępny rabat: -10% na masaż klasyczny do końca tygodnia!"
  );
});

// /support — kontakt z adminem
bot.onText(/\/support/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "📩 Napisz do nas na Instagramie lub WhatsApp, a odpowiemy jak najszybciej:\nInstagram: https://instagram.com/your_salon\nWhatsApp: https://wa.me/48123123123"
  );
});

// /book — przypomnienie o stronie
bot.onText(/\/book/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "📅 Zarezerwuj wizytę online: https://kosmetolog-app.vercel.app"
  );
});

// /unsubscribe
bot.onText(/\/unsubscribe/, async (msg) => {
  const chatId = msg.chat.id;
  await TelegramUser.deleteOne({ chatId });
  return bot.sendMessage(chatId, "❌ Subskrypcja anulowana.");
});
