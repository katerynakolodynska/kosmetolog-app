import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import reviewsRouter from "./routers/reviews.js";

import { getEnvVar } from "./utils/getEnvVar.js";
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors({ origin: "https://kosmetolog-backend.onrender.com" }));

  app.use(cookieParser());

  app.use("/api/reviews", reviewsRouter);

  app.get("/", (req, res) => {
    res.send("API is working");
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
