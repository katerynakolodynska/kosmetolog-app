import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import reviewsRouter from "./routers/reviews.js";
dotenv.config();
import { getEnvVar } from "./utils/getEnvVar.js";
const PORT = process.env.PORT || 5000;

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: ["http://localhost:5173", "https://kosmetolog-app.vercel.app"], // твій фронт локально + деплой
      credentials: true,
    })
  );

  app.use(cookieParser());

  app.use("/api/reviews", reviewsRouter);

  app.get("/", (req, res) => {
    res.send("API is working");
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
