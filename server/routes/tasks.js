import express from "express";
import Task from "../models/Task.js";
import Team from "../models/Team.js";
import Activity from "../models/Activity.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

router.use(authenticate);

async function logActivity(teamId, userId, action, task, extra = {}) {
  const user = await (await import("../models/User.js")).default.findById(userId, "username");
  const messages = {
    created: `created task: ${task.title}`,
    assigned: `assigned task: ${task.title}`,
    completed: `completed task: ${task.title}`,
    edited: `edited task: ${task.title}`,
    deleted: `deleted task: ${task.title}`,
  };
  await Activity.create({
    team: teamId,
    user: userId,
    action,
    targetType: "task",
    targetId: task._id || null,
    message: messages[action] || extra.message || action,
    metadata: { taskTitle: task.title, ...extra },
  });
}

router.post("/", async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findOne({ _id: teamId, members: req.userId });
    if (!team) return res.status(404).json({ message: "Team not found." });
    const { title, description, priority, assignedTo, dueDate } = req.body;
    if (!title || title.trim().length < 1) {
      return res.status(400).json({ message: "Task title is required." });
    }
    const task = await Task.create({
      team: teamId,
      title: title.trim(),
      description: description?.trim() || "",
      priority: priority || "medium",
      assignedTo: assignedTo || null,
      createdBy: req.userId,
      dueDate: dueDate || null,
    });
    await task.populate("assignedTo", "username avatar");
    await task.populate("createdBy", "username avatar");
    await logActivity(teamId, req.userId, "created", task);
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating task." });
  }
});

router.patch("/:taskId", async (req, res) => {
  try {
    const { teamId, taskId } = req.params;
    const team = await Team.findOne({ _id: teamId, members: req.userId });
    if (!team) return res.status(404).json({ message: "Team not found." });
    const task = await Task.findOne({ _id: taskId, team: teamId });
    if (!task) return res.status(404).json({ message: "Task not found." });

    const oldTitle = task.title;
    const fields = ["title", "description", "priority", "assignedTo", "dueDate", "status"];
    const wasStatusChanged = req.body.status && req.body.status !== task.status;
    fields.forEach((f) => {
      if (req.body[f] !== undefined) task[f] = req.body[f];
    });
    if (wasStatusChanged && task.status === "done") {
      task.completedBy = req.userId;
    } else if (wasStatusChanged && task.status !== "done") {
      task.completedBy = null;
    }
    await task.save();
    await task.populate("assignedTo", "username avatar");
    await task.populate("createdBy", "username avatar");
    await task.populate("completedBy", "username avatar");

    if (wasStatusChanged && task.status === "done") {
      await logActivity(teamId, req.userId, "completed", task);
    } else if (req.body.assignedTo !== undefined) {
      await logActivity(teamId, req.userId, "assigned", task);
    } else {
      await logActivity(teamId, req.userId, "edited", task, { oldTitle });
    }
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating task." });
  }
});

router.delete("/:taskId", async (req, res) => {
  try {
    const { teamId, taskId } = req.params;
    const team = await Team.findOne({ _id: teamId, members: req.userId });
    if (!team) return res.status(404).json({ message: "Team not found." });
    const task = await Task.findOneAndDelete({ _id: taskId, team: teamId });
    if (!task) return res.status(404).json({ message: "Task not found." });
    await logActivity(teamId, req.userId, "deleted", task);
    res.json({ id: taskId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting task." });
  }
});

export default router;
