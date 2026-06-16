import axios from "axios";
import type { Task } from "@/types";
import { TEMP_AUTH_DISABLED } from "@/config/auth";

const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (TEMP_AUTH_DISABLED) return config;

  const token = localStorage.getItem("collabflow_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!TEMP_AUTH_DISABLED && (err.response?.status === 401 || err.response?.status === 403)) {
      localStorage.removeItem("collabflow_token");
      localStorage.removeItem("collabflow_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  signup: (data: { username: string; email: string; password: string }) =>
    api.post("/auth/signup", data),
  login: (data: { email: string; password: string }) => api.post("/auth/login", data),
  me: () => api.get("/users/me"),
};

export const teamsApi = {
  list: () => api.get("/teams"),
  get: (id: string) => api.get(`/teams/${id}`),
  create: (name: string) => api.post("/teams", { name }),
  join: (code: string) => api.post("/teams/join", { code }),
  members: (id: string) => api.get(`/teams/${id}/members`),
};

export const tasksApi = {
  list: (teamId: string) => api.get(`/teams/${teamId}/tasks`),
  create: (teamId: string, data: Partial<Task>) => api.post(`/teams/${teamId}/tasks`, data),
  update: (teamId: string, taskId: string, data: Partial<Task>) =>
    api.patch(`/teams/${teamId}/tasks/${taskId}`, data),
  delete: (teamId: string, taskId: string) => api.delete(`/teams/${teamId}/tasks/${taskId}`),
};

export const personalTasksApi = {
  list: () => api.get("/personal-tasks"),
  create: (data: Partial<Task>) => api.post("/personal-tasks", data),
  update: (id: string, data: Partial<Task>) => api.patch(`/personal-tasks/${id}`, data),
  delete: (id: string) => api.delete(`/personal-tasks/${id}`),
};

export const activityApi = {
  list: (teamId: string, params?: Record<string, string>) =>
    api.get(`/teams/${teamId}/activity`, { params }),
};

export const searchApi = {
  global: (q: string) => api.get("/search", { params: { q } }),
};
