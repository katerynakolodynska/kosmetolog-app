import jwt from "jsonwebtoken";
import { Admin } from "../db/models/admin.js";
import { getEnvVar } from "../utils/getEnvVar.js";

const JWT_SECRET = getEnvVar("JWT_SECRET", "supersecret");

export const login = async (req, res) => {
  try {
    const { login, password } = req.body;
    const admin = await Admin.findOne({ login });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
