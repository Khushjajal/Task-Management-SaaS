import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { motion } from "framer-motion";
import { teamsApi } from "@/lib/api";
import { Avatar } from "@/components/Avatar";
import { ActivityDrawer } from "@/components/ActivityDrawer";
import type { Team } from "@/types";

export function ActivityPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    teamsApi.list().then(({ data }) => setTeams(data));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Activity</h1>
        <p className="text-sm text-zinc-500">Review history across your teams.</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {teams.map((team, i) => (
          <motion.div
            key={team._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedTeam(team)}
            className="cursor-pointer rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#1D2028] p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{team.name}</h3>
              <History className="w-4 h-4 text-[#FF4D02]" />
            </div>
            <div className="flex -space-x-2">
              {team.members?.slice(0, 4).map((m) => (
                <Avatar key={m.id || m._id} src={m.avatar} name={m.username} size="sm" />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {teams.length === 0 && (
        <p className="text-zinc-500">No teams yet. Join or create a team to see activity.</p>
      )}

      {selectedTeam && (
        <ActivityDrawer
          teamId={selectedTeam._id}
          members={selectedTeam.members || []}
          isOpen={!!selectedTeam}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </div>
  );
}
