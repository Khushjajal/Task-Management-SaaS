import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Plus, History, Copy, Check } from "lucide-react";
import { teamsApi, tasksApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import { Avatar } from "@/components/Avatar";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { ActivityDrawer } from "@/components/ActivityDrawer";
import { Button } from "@/components/ui/Button";
import type { Team, Task, User } from "@/types";

export function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [activityOpen, setActivityOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { onlineUsers, joinTeam, leaveTeam, emitTeamUpdate } = useSocket(token, () => fetch());

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await teamsApi.get(id);
      setTeam(data.team);
      setTasks(data.tasks);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    joinTeam(id);
    return () => {
      leaveTeam(id);
    };
  }, [id, joinTeam, leaveTeam]);

  useEffect(() => {
    if (!id) return;
  }, [id]);

  const currentUser: User = {
    id: user?.id || "",
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  };

  const handleCreate = async (data: Partial<Task>) => {
    if (!id) return;
    const { data: task } = await tasksApi.create(id, data);
    setTasks((prev) => [task, ...prev]);
    emitTeamUpdate(id, "taskCreated", task);
    setFormOpen(false);
  };

  const handleUpdate = async (data: Partial<Task>) => {
    if (!id || !editing) return;
    const { data: task } = await tasksApi.update(id, editing._id, data);
    setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    emitTeamUpdate(id, "taskUpdated", task);
    setEditing(null);
  };

  const handleToggle = async (task: Task) => {
    if (!id) return;
    const status = task.status === "done" ? "todo" : "done";
    const { data: updated } = await tasksApi.update(id, task._id, { status });
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    emitTeamUpdate(id, "taskUpdated", updated);
  };

  const handleDelete = async (taskId: string) => {
    if (!id) return;
    await tasksApi.delete(id, taskId);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    emitTeamUpdate(id, "taskDeleted", { taskId });
  };

  const copyCode = () => {
    if (!team) return;
    navigator.clipboard.writeText(team.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const myTasks = tasks.filter(
    (t) => (t.assignedTo?.id || t.assignedTo?._id) === user?.id
  );
  const assignedByMe = tasks.filter(
    (t) =>
      (t.createdBy?.id || t.createdBy?._id) === user?.id &&
      (t.assignedTo?.id || t.assignedTo?._id) !== user?.id
  );

  if (loading) return <p className="text-zinc-500">Loading team...</p>;
  if (!team) return <p className="text-zinc-500">Team not found.</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#1D2028] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{team.name}</h1>
            <p className="text-sm text-zinc-500 mt-1">{team.members?.length} members</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyCode}
              className="flex items-center gap-2 text-sm font-mono px-3 py-2 rounded-xl bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {team.inviteCode}
            </button>
            <Button variant="secondary" size="sm" onClick={() => setActivityOpen(true)} className="gap-1">
              <History className="w-4 h-4" /> History
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center -space-x-2">
            {team.members?.map((m) => (
              <div key={m.id || m._id} className="relative group">
                <Avatar
                  src={m.avatar}
                  name={m.username}
                  size="lg"
                  online={onlineUsers.includes(m.id || m._id || "")}
                />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap bg-zinc-900 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {m.username}
                </span>
              </div>
            ))}
          </div>
          <Button onClick={() => setFormOpen(true)} className="gap-1">
            <Plus className="w-4 h-4" /> Add Task
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <TaskSection
          title="My Tasks"
          subtitle="Tasks assigned to you"
          tasks={myTasks}
          onToggle={handleToggle}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
        <TaskSection
          title="Assigned By Me"
          subtitle="Tasks you created for others"
          tasks={assignedByMe}
          onToggle={handleToggle}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
        <TaskSection
          title="All Team Tasks"
          subtitle="Everything in this team"
          tasks={tasks}
          onToggle={handleToggle}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
      </div>

      <TaskForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        members={team.members || []}
        currentUser={currentUser}
      />
      <TaskForm
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        onSubmit={handleUpdate}
        members={team.members || []}
        currentUser={currentUser}
        initial={editing}
      />
      <ActivityDrawer
        teamId={team._id}
        members={team.members || []}
        isOpen={activityOpen}
        onClose={() => setActivityOpen(false)}
      />
    </div>
  );
}

function TaskSection({
  title,
  subtitle,
  tasks,
  onToggle,
  onEdit,
  onDelete,
}: {
  title: string;
  subtitle: string;
  tasks: Task[];
  onToggle: (t: Task) => void;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xs text-zinc-500">{subtitle}</p>
      </div>
      {tasks.length === 0 ? (
        <p className="text-sm text-zinc-500">No tasks here.</p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
