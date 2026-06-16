import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { searchApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Team, Task } from "@/types";

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setQuery("");
      setTeams([]);
      setTasks([]);
      return;
    }
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setTeams([]);
        setTasks([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await searchApi.global(query);
        setTeams(data.teams || []);
        setTasks(data.tasks || []);
      } catch {
        setTeams([]);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "w-full flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors",
          "bg-white dark:bg-[#15171C] border-zinc-200 dark:border-white/10",
          "hover:border-[#FF4D02]/50"
        )}
      >
        <Search className="w-4 h-4 text-zinc-400" />
        <span className="text-zinc-400">Search tasks, people, teams...</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24 px-4"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <div className="relative w-full max-w-lg rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1D2028] shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-black/5 dark:border-white/10">
                <Search className="w-5 h-5 text-zinc-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tasks, people, teams..."
                  className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                />
                <button onClick={() => setOpen(false)} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-auto p-2">
                {loading && <p className="p-4 text-sm text-zinc-500">Searching...</p>}
                {!loading && query && teams.length === 0 && tasks.length === 0 && (
                  <p className="p-4 text-sm text-zinc-500">No results found.</p>
                )}
                {teams.length > 0 && (
                  <div className="p-2">
                    <p className="text-xs font-semibold text-zinc-500 uppercase mb-2 px-2">Teams</p>
                    {teams.map((team) => (
                      <button
                        key={team._id}
                        onClick={() => {
                          navigate(`/teams/${team._id}`);
                          setOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-sm"
                      >
                        {team.name}
                      </button>
                    ))}
                  </div>
                )}
                {tasks.length > 0 && (
                  <div className="p-2">
                    <p className="text-xs font-semibold text-zinc-500 uppercase mb-2 px-2">Tasks</p>
                    {tasks.map((task) => (
                      <button
                        key={task._id}
                        onClick={() => {
                          const teamId = typeof task.team === "string" ? task.team : task.team?._id;
                          navigate(`/teams/${teamId}?task=${task._id}`);
                          setOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-sm"
                      >
                        <span className="font-medium">{task.title}</span>
                        {task.assignedTo && (
                          <span className="ml-2 text-zinc-500">→ {task.assignedTo.username}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
