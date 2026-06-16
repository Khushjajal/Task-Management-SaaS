import { NavLink } from "react-router-dom";
import { LayoutDashboard, CheckSquare, Users, History, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/Avatar";

const nav = [
  { path: "/", label: "Home", icon: LayoutDashboard },
  { path: "/personal", label: "Tasks", icon: CheckSquare },
  { path: "/teams", label: "Teams", icon: Users },
  { path: "/activity", label: "Activity", icon: History },
  { path: "/settings", label: "More", icon: Settings },
];

export function MobileNav() {
  const { user } = useAuth();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-black/5 dark:border-white/10 bg-white/90 dark:bg-[#15171C]/90 backdrop-blur-md">
      <div className="flex items-center justify-around px-2 py-2">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-colors ${
                  isActive
                    ? "text-[#FF4D02]"
                    : "text-zinc-500 dark:text-zinc-400"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
        <Avatar src={user?.avatar} name={user?.username || ""} size="sm" />
      </div>
    </nav>
  );
}
