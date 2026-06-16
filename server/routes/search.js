import express from "express";
import Team from "../models/Team.js";
import Task from "../models/Task.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.userId;
    if (!q || q.trim().length < 1) return res.json({ teams: [], tasks: [] });
    const term = q.trim();
    const regex = new RegExp(term, "i");

    const teams = await Team.find({ members: userId, name: regex })
      .select("name inviteCode _id")
      .limit(10);

    const tasks = await Task.find({
      team: { $in: await Team.find({ members: userId }).distinct("_id") },
      $or: [{ title: regex }, { description: regex }],
    })
      .populate("team", "name _id")
      .populate("assignedTo", "username avatar")
      .limit(20);

    res.json({ teams, tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during search." });
  }
});

export default router;
