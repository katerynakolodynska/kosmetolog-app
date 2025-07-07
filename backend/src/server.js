import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import bookingsRouter from "./routers/bookings.js";
import reviewsRouter from "./routers/reviews.js";
import servicesRouter from "./routers/services.js";
import adminRouter from "./routers/admin.js";
import contactRouter from "./routers/contact.js";
import specialistsRouter from "./routers/specialists.js";
import heroRouter from "./routers/hero.js";
import beforeAfterRouter from "./routers/beforeAfter.js";
import telegramWebhook from "./routers/telergramWebhook.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

export const setupServer = () => {
  const app = express();
  const allowedOrigins = [
    "http://localhost:5173",
    "https://kosmetolog-app.vercel.app",
    "https://kosmetolog-ov4khudou-katerynas-projects-6759cee1.vercel.app",
  ];
  app.use(express.json());
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  app.use(cookieParser());

  app.use("/api/reviews", reviewsRouter);

  app.use("/api/bookings", bookingsRouter);

  app.use("/api/services", servicesRouter);

  app.use("/api/specialists", specialistsRouter);

  app.use("/api/contact", contactRouter);

  app.use("/api/admin", adminRouter);

  app.use("/api/hero", heroRouter);

  app.use("/api/before-after", beforeAfterRouter);

  app.use("/telegram", telegramWebhook);

  app.get("/", (req, res) => {
    res.send("API is working");
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
