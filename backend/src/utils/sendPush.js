import axios from "axios";

export const sendPushNotification = async (playerId, title, body) => {
  return axios.post(
    "https://onesignal.com/api/v1/notifications",
    {
      app_id: process.env.ONESIGNAL_APP_ID,
      include_player_ids: [playerId],
      headings: { pl: title, uk: title },
      contents: { pl: body, uk: body },
    },
    {
      headers: {
        Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
};
