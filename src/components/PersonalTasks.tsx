import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { personalTasksApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { Button } from "@/components/ui/Button";
import type { Task, User } from "@/types";

export function PersonalTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await personalTasksApi.list();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleCreate = async (data: Partial<Task>) => {
    await personalTasksApi.create(data);
    fetch();
  };

  const handleUpdate = async (data: Partial<Task>) => {
    if (!editing) return;
    await personalTasksApi.update(editing._id, data);
    setEditing(null);
    fetch();
  };

  const handleToggle = async (task: Task) => {
    const status = task.status === "done" ? "todo" : "done";
    await personalTasksApi.update(task._id, { status });
    fetch();
  };

  const handleDelete = async (id: string) => {
    await personalTasksApi.delete(id);
    fetch();
  };

  const currentUser: User = {
    id: user?.id || "",
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Personal Tasks</h1>
          <p className="text-sm text-zinc-500">Your private space to stay organized.</p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="gap-1">
          <Plus className="w-4 h-4" /> Add Task
        </Button>
      </div>

      {loading ? (
        <p className="text-zinc-500">Loading...</p>
      ) : tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-dashed border-zinc-300 dark:border-white/10 p-10 text-center"
        >
          <p className="text-zinc-500">No personal tasks yet. Add your first one!</p>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggle={handleToggle}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <TaskForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        members={[]}
        currentUser={currentUser}
      />
      <TaskForm
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        onSubmit={handleUpdate}
        members={[]}
        currentUser={currentUser}
        initial={editing}
      />
    </div>
  );
}
