import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare2, Users, Clock, TrendingUp } from "lucide-react";
import { teamsApi, personalTasksApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Team, Task } from "@/types";

export function Dashboard() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [personal, setPersonal] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [{ data: t }, { data: p }] = await Promise.all([
          teamsApi.list(),
          personalTasksApi.list(),
        ]);
        setTeams(t);
        setPersonal(p);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const done = personal.filter((x) => x.status === "done").length;

  const stats = [
    { label: "Teams", value: teams.length, icon: Users },
    { label: "My Tasks", value: personal.length, icon: CheckSquare2 },
    { label: "Completed", value: done, icon: TrendingUp },
    { label: "Pending", value: personal.length - done, icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Hello, {user?.username} 👋</h1>
        <p className="text-zinc-500 mt-1">Here is everything happening with your teams.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#1D2028] p-4 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-[#FF4D02]/10 text-[#FF4D02]">
                <s.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold">{loading ? "-" : s.value}</p>
            <p className="text-xs text-zinc-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#1D2028] p-5 shadow-sm">
          <h3 className="font-semibold mb-4">Your Teams</h3>
          {teams.length === 0 ? (
            <p className="text-sm text-zinc-500">No teams yet. Create or join one from the sidebar.</p>
          ) : (
            <div className="space-y-3">
              {teams.map((team) => (
                <div
                  key={team._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-[#0E0F11]"
                >
                  <div>
                    <p className="font-medium">{team.name}</p>
                    <p className="text-xs text-zinc-500">{team.members?.length} members</p>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-zinc-200 dark:bg-white/10">
                    {team.inviteCode}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#1D2028] p-5 shadow-sm">
          <h3 className="font-semibold mb-4">Personal Quick View</h3>
          {personal.length === 0 ? (
            <p className="text-sm text-zinc-500">No personal tasks yet.</p>
          ) : (
            <div className="space-y-2">
              {personal.slice(0, 5).map((task) => (
                <div
                  key={task._id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-[#0E0F11]"
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      task.status === "done" ? "bg-emerald-500" : "bg-[#FF4D02]"
                    }`}
                  />
                  <span className={task.status === "done" ? "line-through text-zinc-500" : ""}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
