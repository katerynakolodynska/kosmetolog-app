import express from "express";
import {
  getContactInfo,
  createContactInfo,
  updateContactInfo,
  deleteContactInfo,
} from "../controllers/contactController.js";
import { validateBody } from "../utils/validateBody.js";
import { contactSchema } from "../validation/contactSchema.js";
import ctrlWrapper from "../middlewares/ctrlWrapper.js";

const router = express.Router();

router.get("/", getContactInfo);
router.post("/", validateBody(contactSchema), ctrlWrapper(createContactInfo));
router.put("/", updateContactInfo);
router.delete("/", deleteContactInfo);

export default router;
