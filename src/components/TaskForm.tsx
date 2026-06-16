import { useState, useEffect } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import type { Task, User } from "@/types";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Task>) => void;
  members: User[];
  currentUser: User;
  initial?: Task | null;
}

const empty = {
  title: "",
  description: "",
  priority: "medium" as "low" | "medium" | "high" | "urgent",
  status: "todo" as "todo" | "in-progress" | "done",
  assignedTo: "",
  dueDate: "",
};

export function TaskForm({ isOpen, onClose, onSubmit, members, currentUser, initial }: TaskFormProps) {
  const [form, setForm] = useState({ ...empty });

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        description: initial.description || "",
        priority: initial.priority,
        status: initial.status,
        assignedTo: (initial.assignedTo?.id || initial.assignedTo?._id || "") as string,
        dueDate: initial.dueDate ? initial.dueDate.slice(0, 10) : "",
      });
    } else {
      setForm({ ...empty });
    }
  }, [initial, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: form.title,
      description: form.description,
      priority: form.priority,
      status: form.status,
      assignedTo: (form.assignedTo || null) as any,
      dueDate: form.dueDate || null,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initial ? "Edit Task" : "New Task"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Task title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <Textarea
          placeholder="Description (optional)"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-3">
          <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as any })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>
          <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </Select>
        </div>
        <Select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
          <option value="">Unassigned</option>
          <option value={currentUser.id}>Me</option>
          {members.map((m) => (
            <option key={m.id || m._id} value={m.id || m._id}>
              {m.username}
            </option>
          ))}
        </Select>
        <Input
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{initial ? "Save Changes" : "Create Task"}</Button>
        </div>
      </form>
    </Modal>
  );
}
