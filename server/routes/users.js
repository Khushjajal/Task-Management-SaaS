import express from "express";
import User from "../models/User.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate);

router.get("/me", async (req, res) => {
  try {
    const user = await User.findById(req.userId, "-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching user." });
  }
});

export default router;
