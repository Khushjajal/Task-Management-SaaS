import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Layout } from "@/components/Layout";
import { AuthPage } from "@/components/AuthPage";
import { Dashboard } from "@/components/Dashboard";
import { PersonalTasks } from "@/components/PersonalTasks";
import { TeamsPage } from "@/components/TeamsPage";
import { TeamDetail } from "@/components/TeamDetail";
import { ActivityPage } from "@/components/ActivityPage";
import { SettingsPage } from "@/components/SettingsPage";
import { TEMP_AUTH_DISABLED } from "@/config/auth";

function ProtectedRoute() {
  const { token, loading } = useAuth();
  if (TEMP_AUTH_DISABLED) return <Outlet />;
  if (loading) return <div className="min-h-screen bg-[#F8F6F3] dark:bg-[#0E0F11]" />;
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicRoute() {
  const { token, loading } = useAuth();
  if (TEMP_AUTH_DISABLED) return <Navigate to="/" replace />;
  if (loading) return <div className="min-h-screen bg-[#F8F6F3] dark:bg-[#0E0F11]" />;
  return token ? <Navigate to="/" replace /> : <Outlet />;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/personal" element={<PersonalTasks />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/:id" element={<TeamDetail />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}
