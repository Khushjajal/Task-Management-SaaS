import express from "express";
import Activity from "../models/Activity.js";
import Team from "../models/Team.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findOne({ _id: teamId, members: req.userId });
    if (!team) return res.status(404).json({ message: "Team not found." });

    const { person, action, date, from, to } = req.query;
    const query = { team: teamId };
    if (person && person !== "all") query.user = person;
    if (action && action !== "all") query.action = action;
    if (date && date !== "all") {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      let start = new Date(now);
      let end = new Date(now);
      end.setHours(23, 59, 59, 999);
      if (date === "today") {
        query.createdAt = { $gte: start, $lte: end };
      } else if (date === "yesterday") {
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
        query.createdAt = { $gte: start, $lte: end };
      } else if (date === "last7days") {
        start.setDate(start.getDate() - 6);
        query.createdAt = { $gte: start, $lte: end };
      } else if (date === "custom" && from && to) {
        query.createdAt = { $gte: new Date(from), $lte: new Date(to) };
      }
    }

    const activities = await Activity.find(query)
      .populate("user", "username avatar")
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching activity." });
  }
});

export default router;
