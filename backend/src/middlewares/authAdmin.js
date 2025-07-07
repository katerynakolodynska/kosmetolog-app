import jwt from "jsonwebtoken";
import { getEnvVar } from "../utils/getEnvVar.js";

const JWT_SECRET = getEnvVar("JWT_SECRET", "supersecret");

export const authAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
