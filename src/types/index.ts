export interface User {
  id: string;
  _id?: string;
  username: string;
  email: string;
  avatar: string;
  createdAt?: string;
}

export interface Team {
  id?: string;
  _id: string;
  name: string;
  inviteCode: string;
  owner: string | User;
  members: User[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id?: string;
  _id: string;
  team?: string | Team;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo: User | null;
  createdBy: User;
  completedBy?: User | null;
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivityItem {
  _id: string;
  team: string;
  user: User;
  action: "created" | "assigned" | "completed" | "edited" | "deleted" | "joined" | "left";
  targetType: "task" | "team";
  targetId?: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface SearchResult {
  teams: Team[];
  tasks: Task[];
}
