import jwt from "jsonwebtoken";
import User from "./models/User.js";
import { TEMP_AUTH_DISABLED, TEMP_USER } from "./config/auth.js";

const JWT_SECRET = process.env.JWT_SECRET || "collabflow-dev-secret-change-me";

export function setupSocket(io) {
  const onlineUsers = new Map();

  io.use(async (socket, next) => {
    try {
      if (TEMP_AUTH_DISABLED) {
        const user = await User.findOneAndUpdate(
          { email: TEMP_USER.email },
          { $setOnInsert: TEMP_USER },
          { upsert: true, new: true }
        );
        socket.userId = user._id.toString();
        socket.user = user;
        return next();
      }

      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication error"));
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId, "-password");
      if (!user) return next(new Error("User not found"));
      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    onlineUsers.set(socket.userId, { socketId: socket.id, user: socket.user });
    io.emit("onlineUsers", Array.from(onlineUsers.values()).map((o) => o.user._id.toString()));

    socket.on("joinTeam", (teamId) => {
      socket.join(teamId);
      io.to(teamId).emit("memberOnline", {
        userId: socket.userId,
        onlineUsers: Array.from(onlineUsers.values()).map((o) => o.user._id.toString()),
      });
    });

    socket.on("leaveTeam", (teamId) => {
      socket.leave(teamId);
    });

    socket.on("teamUpdate", ({ teamId, type, payload }) => {
      socket.to(teamId).emit("teamUpdate", { type, payload });
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.userId);
      io.emit("onlineUsers", Array.from(onlineUsers.values()).map((o) => o.user._id.toString()));
    });
  });
}
