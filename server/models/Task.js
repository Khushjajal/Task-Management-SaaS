import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000, default: "" },
    status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    completedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
