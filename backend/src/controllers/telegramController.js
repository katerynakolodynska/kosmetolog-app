import { TelegramUser } from "../db/models/telegramUser.js";
import { Booking } from "../db/models/booking.js";
import { Service } from "../db/models/service.js";

export const handleTelegramMessage = async (req, res) => {
  const message = req.body.message;
  if (!message || !message.from) return res.sendStatus(200);

  const username = message.from.username;
  const chatId = message.chat.id;
  const text = message.text?.trim();

  if (username) {
    await TelegramUser.updateOne(
      { username },
      { username, chatId },
      { upsert: true }
    );
  }

  if (text === "/start") {
    return sendReply(
      chatId,
      `👋 Вітаю, ${username}!\nВи підписані на сповіщення.\nКоманди: /my, /unsubscribe`
    );
  }

  if (text === "/unsubscribe") {
    await TelegramUser.deleteOne({ chatId });
    return sendReply(chatId, "🚫 Ви більше не отримуватимете сповіщення.");
  }

  if (text === "/my") {
    const bookings = await Booking.find({ phone: new RegExp(username, "i") })
      .sort({ date: -1, time: -1 })
      .limit(5)
      .populate("service");

    if (!bookings.length) {
      return sendReply(chatId, "⛔️ Записів не знайдено.");
    }

    const messages = bookings.map((b) => {
      const title = b.service?.title?.pl || "Послуга";
      return `📅 ${b.date} ${b.time}\n💅 ${title}\n📞 ${b.phone}`;
    });

    return sendReply(
      chatId,
      `📋 Ваші останні записи:\n\n${messages.join("\n\n")}`
    );
  }

  return sendReply(
    chatId,
    "🤖 Напишіть /my щоб переглянути записи або /unsubscribe для відписки."
  );
};

const sendReply = async (chatId, text) => {
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    }
  );
};
