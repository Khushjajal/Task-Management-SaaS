import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: ["created", "assigned", "completed", "edited", "deleted", "joined", "left"],
      required: true,
    },
    targetType: { type: String, enum: ["task", "team"], default: "task" },
    targetId: { type: mongoose.Schema.Types.ObjectId, default: null },
    message: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
