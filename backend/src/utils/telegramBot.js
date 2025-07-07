import axios from "axios";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export const sendTelegramMessage = async (text) => {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("Telegram токен або chat_id не вказані у .env");
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text,
    });
  } catch (err) {
    console.error(
      "❌ Помилка надсилання повідомлення в Telegram:",
      err.message
    );
  }
};
