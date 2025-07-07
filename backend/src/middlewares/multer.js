import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const tempDir = path.join(_dirname, "../tmp");

try {
  await fs.mkdir(tempDir, { recursive: true });
} catch (err) {
  console.error("Could not create tmp directory:", err.message);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage });
