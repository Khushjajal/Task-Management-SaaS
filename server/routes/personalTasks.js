import express from "express";
import PersonalTask from "../models/PersonalTask.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const tasks = await PersonalTask.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching personal tasks." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    if (!title || title.trim().length < 1) return res.status(400).json({ message: "Title required." });
    const task = await PersonalTask.create({
      user: req.userId,
      title: title.trim(),
      description: description?.trim() || "",
      priority: priority || "medium",
      dueDate: dueDate || null,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error creating personal task." });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const task = await PersonalTask.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error updating personal task." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await PersonalTask.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.json({ id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting personal task." });
  }
});

export default router;
