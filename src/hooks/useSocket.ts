import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

const SOCKET_URL = (import.meta as any).env?.VITE_API_URL?.replace("/api", "") || "http://localhost:3001";

export function useSocket(token: string | null, onUpdate?: (data: any) => void) {
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!token) return;
    const socket = io(SOCKET_URL, { auth: { token }, transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => console.log("socket connected"));
    socket.on("teamUpdate", (data) => onUpdate?.(data));
    socket.on("onlineUsers", (ids: string[]) => setOnlineUsers(ids));
    socket.on("memberOnline", (data) => onUpdate?.({ type: "memberOnline", payload: data }));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, onUpdate]);

  const joinTeam = (teamId: string) => socketRef.current?.emit("joinTeam", teamId);
  const leaveTeam = (teamId: string) => socketRef.current?.emit("leaveTeam", teamId);
  const emitTeamUpdate = (teamId: string, type: string, payload: any) =>
    socketRef.current?.emit("teamUpdate", { teamId, type, payload });

  return { socket: socketRef.current, onlineUsers, joinTeam, leaveTeam, emitTeamUpdate };
}
