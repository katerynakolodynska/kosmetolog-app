import express from "express";
import multer from "multer";

import {
  createHero,
  getHero,
  updateHero,
  deleteHeroImage,
} from "../controllers/heroController.js";

import ctrlWrapper from "../middlewares/ctrlWrapper.js";
import { validateBody } from "../utils/validateBody.js";
import { heroSchema } from "../validation/heroSchema.js";

const upload = multer({ dest: "temp/" });
const router = express.Router();

router.get("/", ctrlWrapper(getHero));

router.post(
  "/",
  upload.array("images", 4),
  ctrlWrapper(createHero) // валідація відбувається в самому контролері, бо тіла multipart/form-data
);

router.put("/", upload.array("images", 4), ctrlWrapper(updateHero));

router.delete("/image/:id", ctrlWrapper(deleteHeroImage));

export default router;
