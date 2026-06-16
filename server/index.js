import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import teamsRoutes from "./routes/teams.js";
import tasksRoutes from "./routes/tasks.js";
import personalTasksRoutes from "./routes/personalTasks.js";
import activityRoutes from "./routes/activity.js";
import searchRoutes from "./routes/search.js";
import { setupSocket } from "./socket.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || "*", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/teams/:teamId/tasks", tasksRoutes);
app.use("/api/personal-tasks", personalTasksRoutes);
app.use("/api/teams/:teamId/activity", activityRoutes);
app.use("/api/search", searchRoutes);

setupSocket(io);

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/collabflow";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

export { io };
