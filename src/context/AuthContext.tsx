import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/types";
import { authApi } from "@/lib/api";
import { TEMP_AUTH_DISABLED, TEMP_USER } from "@/config/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(TEMP_AUTH_DISABLED ? TEMP_USER : null);
  const [token, setToken] = useState<string | null>(TEMP_AUTH_DISABLED ? "temporary-token" : null);
  const [loading, setLoading] = useState(!TEMP_AUTH_DISABLED);

  useEffect(() => {
    if (TEMP_AUTH_DISABLED) return;

    const t = localStorage.getItem("collabflow_token");
    const u = localStorage.getItem("collabflow_user");
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("collabflow_token", newToken);
    localStorage.setItem("collabflow_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    if (TEMP_AUTH_DISABLED) {
      setToken("temporary-token");
      setUser(TEMP_USER);
      return;
    }

    localStorage.removeItem("collabflow_token");
    localStorage.removeItem("collabflow_user");
    setToken(null);
    setUser(null);
  };

  const refresh = async () => {
    if (TEMP_AUTH_DISABLED) return;

    try {
      const { data } = await authApi.me();
      const updated = {
        id: data._id,
        username: data.username,
        email: data.email,
        avatar: data.avatar,
        createdAt: data.createdAt,
      };
      setUser(updated);
      localStorage.setItem("collabflow_user", JSON.stringify(updated));
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
