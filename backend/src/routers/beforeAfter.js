import express from "express";
import multer from "multer";
import ctrlWrapper from "../middlewares/ctrlWrapper.js";
import { validateBody } from "../utils/validateBody.js";
import { beforeAfterSchema } from "../validation/beforeAfterSchema.js";
import * as ctrl from "../controllers/beforeAfterController.js";

const router = express.Router();
const upload = multer({ dest: "temp/" });

router.get("/", ctrlWrapper(ctrl.getAllBeforeAfter));

router.post(
  "/",
  upload.fields([
    { name: "before", maxCount: 1 },
    { name: "after", maxCount: 1 },
  ]),
  validateBody(beforeAfterSchema),
  ctrlWrapper(ctrl.createBeforeAfter)
);

router.put(
  "/:id",
  upload.fields([
    { name: "before", maxCount: 1 },
    { name: "after", maxCount: 1 },
  ]),
  ctrlWrapper(ctrl.updateBeforeAfter) // ✅ БЕЗ validateBody
);

router.delete("/:id", ctrlWrapper(ctrl.deleteBeforeAfter));

export default router;
