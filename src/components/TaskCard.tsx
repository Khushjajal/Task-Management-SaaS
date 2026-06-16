import { Check, Pencil, Trash2, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatDate, priorityColor, statusColor } from "@/lib/utils";
import { Avatar } from "@/components/Avatar";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onToggle?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  compact?: boolean;
}

export function TaskCard({ task, onToggle, onEdit, onDelete, compact }: TaskCardProps) {
  const isDone = task.status === "done";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn(
        "group rounded-2xl border p-4 transition-all",
        "bg-white dark:bg-[#1D2028]",
        "border-zinc-200 dark:border-white/10",
        "shadow-sm hover:shadow-md dark:hover:shadow-white/5"
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle?.(task)}
          className={cn(
            "mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-colors",
            isDone
              ? "bg-[#FF4D02] border-[#FF4D02] text-white"
              : "border-zinc-300 dark:border-zinc-600 hover:border-[#FF4D02]"
          )}
        >
          {isDone && <Check className="w-3.5 h-3.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn("font-medium truncate", isDone && "line-through text-zinc-500")}>{task.title}</h4>
            {!compact && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit?.(task)}
                  className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-zinc-500"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete?.(task._id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
          {task.description && <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{task.description}</p>}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={cn("text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md border", priorityColor(task.priority))}>
              {task.priority}
            </span>
            <span className={cn("text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md border", statusColor(task.status))}>
              {task.status.replace("-", " ")}
            </span>
            {task.dueDate && (
              <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                <Calendar className="w-3 h-3" /> {formatDate(task.dueDate)}
              </span>
            )}
            {task.assignedTo && (
              <div className="ml-auto flex items-center gap-1.5">
                <Avatar src={task.assignedTo.avatar} name={task.assignedTo.username} size="sm" />
                <span className="text-[10px] text-zinc-500 hidden sm:inline">{task.assignedTo.username}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
