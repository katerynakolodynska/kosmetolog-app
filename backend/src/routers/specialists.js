import express from "express";
import { upload } from "../middlewares/multer.js";
import ctrlWrapper from "../middlewares/ctrlWrapper.js";
import {
  specialistSchema,
  statusSchema,
} from "../validation/specialistSchema.js";
import * as specialistsCtrl from "../controllers/specialistsController.js";
import { validateBody } from "../utils/validateBody.js";

const router = express.Router();
router.get("/", ctrlWrapper(specialistsCtrl.getAllSpecialists));

router.post(
  "/",
  validateBody(specialistSchema),
  upload.single("photo"),
  ctrlWrapper(specialistsCtrl.createSpecialist)
);

router.delete("/:id", ctrlWrapper(specialistsCtrl.deleteSpecialist));
router.put(
  "/:id",
  validateBody(specialistSchema),
  upload.single("photo"),
  ctrlWrapper(specialistsCtrl.updateSpecialist)
);

router.patch(
  "/:id/toggle",
  validateBody(statusSchema),
  ctrlWrapper(specialistsCtrl.toggleSpecialistStatus)
);

export default router;
