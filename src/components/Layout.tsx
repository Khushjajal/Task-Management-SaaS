import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { SearchBar } from "@/components/SearchBar";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { teamsApi } from "@/lib/api";

export function Layout() {
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await teamsApi.create(teamName);
      setCreateOpen(false);
      setTeamName("");
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create team.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await teamsApi.join(inviteCode);
      setJoinOpen(false);
      setInviteCode("");
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to join team.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8F6F3] dark:bg-[#0E0F11] text-zinc-900 dark:text-zinc-100">
      <Sidebar onCreateTeam={() => setCreateOpen(true)} onJoinTeam={() => setJoinOpen(true)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-black/5 dark:border-white/10 bg-[#F8F6F3]/80 dark:bg-[#0E0F11]/80 backdrop-blur-md">
          <SearchBar />
          <div className="lg:hidden" />
        </header>
        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <MobileNav />

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create a Team">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            placeholder="Team name (e.g. Family Plan)"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Create Team
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={joinOpen} onClose={() => setJoinOpen(false)} title="Join a Team">
        <form onSubmit={handleJoin} className="space-y-4">
          <Input
            placeholder="Invite code (e.g. COLLAB-ABCD-1234)"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setJoinOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Join Team
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
