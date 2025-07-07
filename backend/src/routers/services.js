import express from "express";
import * as servicesCtrl from "../controllers/servicesController.js";
import { validateBody } from "../utils/validateBody.js";
import { serviceSchema } from "../validation/serviceSchema.js";
import ctrlWrapper from "../middlewares/ctrlWrapper.js";

const router = express.Router();

router.get("/", ctrlWrapper(servicesCtrl.getAllService));
router.post(
  "/",
  validateBody(serviceSchema),
  ctrlWrapper(servicesCtrl.createService)
);
router.put(
  "/:id",
  validateBody(serviceSchema),
  ctrlWrapper(servicesCtrl.updateService)
);
router.delete("/:id", ctrlWrapper(servicesCtrl.deleteService));

export default router;
