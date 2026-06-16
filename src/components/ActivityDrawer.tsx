import { X, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { activityApi } from "@/lib/api";
import { Avatar } from "@/components/Avatar";
import { relativeDate } from "@/lib/utils";
import { Select } from "@/components/ui/Input";
import type { ActivityItem, User } from "@/types";

interface ActivityDrawerProps {
  teamId: string;
  members: User[];
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityDrawer({ teamId, members, isOpen, onClose }: ActivityDrawerProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filters, setFilters] = useState({ person: "all", action: "all", date: "all" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !teamId) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (filters.person !== "all") params.person = filters.person;
        if (filters.action !== "all") params.action = filters.action;
        if (filters.date !== "all") params.date = filters.date;
        const { data } = await activityApi.list(teamId, params);
        setActivities(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [isOpen, teamId, filters]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="relative w-full max-w-md h-full bg-white dark:bg-[#15171C] border-l border-black/5 dark:border-white/10 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-black/5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-[#FF4D02]" />
                <h2 className="text-lg font-bold">Activity History</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 grid grid-cols-3 gap-2 border-b border-black/5 dark:border-white/10">
              <Select value={filters.person} onChange={(e) => setFilters({ ...filters, person: e.target.value })}>
                <option value="all">All</option>
                {members.map((m) => (
                  <option key={m.id || m._id} value={m.id || m._id}>
                    {m.username}
                  </option>
                ))}
              </Select>
              <Select value={filters.action} onChange={(e) => setFilters({ ...filters, action: e.target.value })}>
                <option value="all">Action</option>
                <option value="created">Created</option>
                <option value="assigned">Assigned</option>
                <option value="completed">Completed</option>
                <option value="edited">Edited</option>
                <option value="deleted">Deleted</option>
                <option value="joined">Joined</option>
              </Select>
              <Select value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })}>
                <option value="all">Date</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7days">Last 7 Days</option>
              </Select>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-3">
              {loading && <p className="text-sm text-zinc-500">Loading activity...</p>}
              {!loading && activities.length === 0 && (
                <p className="text-sm text-zinc-500">No activity found.</p>
              )}
              {activities.map((a) => (
                <div
                  key={a._id}
                  className="flex items-start gap-3 rounded-xl border border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-[#1D2028] p-3"
                >
                  <Avatar src={a.user?.avatar} name={a.user?.username || ""} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold">{a.user?.username}</span>{" "}
                      <span className="text-zinc-500">{a.message}</span>
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-1">{relativeDate(a.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
