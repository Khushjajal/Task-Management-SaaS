import express from "express";
import Team from "../models/Team.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
import Activity from "../models/Activity.js";
import { authenticate } from "../middleware/auth.js";
import { generateInviteCode } from "../utils/helpers.js";

const router = express.Router();

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const teams = await Team.find({ members: req.userId })
      .populate("members", "username avatar")
      .populate("owner", "username avatar")
      .sort({ createdAt: -1 });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching teams." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "Team name is required." });
    }
    let code = generateInviteCode();
    while (await Team.findOne({ inviteCode: code })) {
      code = generateInviteCode();
    }
    const team = await Team.create({
      name: name.trim(),
      inviteCode: code,
      owner: req.userId,
      members: [req.userId],
    });
    await Activity.create({
      team: team._id,
      user: req.userId,
      action: "joined",
      targetType: "team",
      targetId: team._id,
      message: "created the team",
    });
    await team.populate("members", "username avatar");
    await team.populate("owner", "username avatar");
    res.status(201).json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating team." });
  }
});

router.post("/join", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Invite code is required." });
    const team = await Team.findOne({ inviteCode: code.trim().toUpperCase() });
    if (!team) return res.status(404).json({ message: "Invalid invite code." });
    if (team.members.includes(req.userId)) {
      return res.status(409).json({ message: "You are already a member." });
    }
    team.members.push(req.userId);
    await team.save();
    const user = await User.findById(req.userId, "username avatar");
    await Activity.create({
      team: team._id,
      user: req.userId,
      action: "joined",
      targetType: "team",
      targetId: team._id,
      message: "joined the team",
    });
    await team.populate("members", "username avatar");
    await team.populate("owner", "username avatar");
    res.json({ team, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error joining team." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const team = await Team.findOne({ _id: req.params.id, members: req.userId })
      .populate("members", "username avatar email")
      .populate("owner", "username avatar");
    if (!team) return res.status(404).json({ message: "Team not found." });
    const tasks = await Task.find({ team: team._id })
      .populate("assignedTo", "username avatar")
      .populate("createdBy", "username avatar")
      .populate("completedBy", "username avatar")
      .sort({ createdAt: -1 });
    res.json({ team, tasks });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching team." });
  }
});

router.get("/:id/members", async (req, res) => {
  try {
    const team = await Team.findOne({ _id: req.params.id, members: req.userId }).populate(
      "members",
      "username avatar email"
    );
    if (!team) return res.status(404).json({ message: "Team not found." });
    res.json(team.members);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching members." });
  }
});

export default router;
