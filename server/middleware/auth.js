import jwt from "jsonwebtoken";
import { TEMP_AUTH_DISABLED, TEMP_USER } from "../config/auth.js";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "collabflow-dev-secret-change-me";

export async function authenticate(req, res, next) {
  if (TEMP_AUTH_DISABLED) {
    try {
      const user = await User.findOneAndUpdate(
        { email: TEMP_USER.email },
        { $setOnInsert: TEMP_USER },
        { upsert: true, new: true }
      );
      req.userId = user._id;
      return next();
    } catch (err) {
      return res.status(500).json({ message: "Temporary auth user could not be loaded." });
    }
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
}
