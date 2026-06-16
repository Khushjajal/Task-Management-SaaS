import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  History,
  Settings,
  Sun,
  Moon,
  LogOut,
  Plus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/Button";

interface SidebarProps {
  onCreateTeam: () => void;
  onJoinTeam: () => void;
}

const nav = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/personal", label: "Personal Tasks", icon: CheckSquare },
  { path: "/teams", label: "Teams", icon: Users },
  { path: "/activity", label: "Activity", icon: History },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ onCreateTeam, onJoinTeam }: SidebarProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-black/5 dark:border-white/10 bg-white dark:bg-[#15171C]">
      <div className="p-5 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[#FF4D02] flex items-center justify-center shadow-lg shadow-[#FF4D02]/25">
          <Users className="text-white w-5 h-5" />
        </div>
        <span className="text-lg font-bold tracking-tight">CollabFlow</span>
      </div>

      <div className="px-4 pb-3 grid grid-cols-2 gap-2">
        <Button size="sm" onClick={onCreateTeam} className="gap-1">
          <Plus className="w-4 h-4" /> Team
        </Button>
        <Button size="sm" variant="secondary" onClick={onJoinTeam}>
          Join
        </Button>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#FF4D02] bg-[#FF4D02]/10"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5"
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-black/5 dark:border-white/10 space-y-3">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-3">
            {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </span>
        </button>
        <div className="flex items-center gap-3 px-2">
          <Avatar src={user?.avatar} name={user?.username || ""} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.username}</p>
            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-zinc-500"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
