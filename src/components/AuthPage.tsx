import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Mail, Lock, User as UserIcon } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { User } from "@/types";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } =
        mode === "login"
          ? await authApi.login({ email: form.email, password: form.password })
          : await authApi.signup(form);
      const user: User = {
        id: data.user.id || data.user._id,
        username: data.user.username,
        email: data.user.email,
        avatar: data.user.avatar,
        createdAt: data.user.createdAt,
      };
      login(data.token, user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8F6F3] dark:bg-[#0E0F11]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1D2028] p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-[#FF4D02] flex items-center justify-center shadow-lg shadow-[#FF4D02]/25">
            <Users className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">CollabFlow</h1>
            <p className="text-sm text-zinc-500">Family + Team Planner</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-6">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="pl-10"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="pl-10"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" isLoading={loading} className="w-full">
            {mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => navigate(mode === "login" ? "/signup" : "/login")}
            className="text-[#FF4D02] font-medium hover:underline"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
