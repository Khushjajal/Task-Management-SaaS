import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date?: string | Date | null) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function relativeDate(date?: string | Date | null) {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function priorityColor(priority: string) {
  switch (priority) {
    case "low":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "medium":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "high":
      return "bg-orange-500/10 text-orange-600 border-orange-500/20";
    case "urgent":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-500/20";
  }
}

export function statusColor(status: string) {
  switch (status) {
    case "todo":
      return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    case "in-progress":
      return "bg-[#FF4D02]/10 text-[#FF4D02] border-[#FF4D02]/20";
    case "done":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-500";
  }
}
