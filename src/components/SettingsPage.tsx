import { Sun, Moon, LogOut, User, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/Button";

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-zinc-500">Manage your account and preferences.</p>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#1D2028] p-6 shadow-sm">
        <h2 className="font-semibold mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          <Avatar src={user?.avatar} name={user?.username || ""} size="xl" />
          <div>
            <p className="font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-zinc-400" /> {user?.username}
            </p>
            <p className="text-sm text-zinc-500 flex items-center gap-2">
              <Mail className="w-4 h-4 text-zinc-400" /> {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#1D2028] p-6 shadow-sm">
        <h2 className="font-semibold mb-4">Appearance</h2>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-[#0E0F11] hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-3 text-sm font-medium">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          </span>
          <span className="text-xs text-zinc-500 capitalize">{theme}</span>
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#1D2028] p-6 shadow-sm">
        <h2 className="font-semibold mb-4">Session</h2>
        <Button variant="danger" onClick={logout} className="gap-2">
          <LogOut className="w-4 h-4" /> Sign out
        </Button>
      </div>
    </div>
  );
}
