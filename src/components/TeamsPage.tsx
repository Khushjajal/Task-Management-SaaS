import { useEffect, useState } from "react";
import { Plus, Users, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { teamsApi } from "@/lib/api";
import { Avatar } from "@/components/Avatar";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Team } from "@/types";

export function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const fetch = async () => {
    const { data } = await teamsApi.list();
    setTeams(data);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await teamsApi.create(name);
      setCreateOpen(false);
      setName("");
      fetch();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create team.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await teamsApi.join(code);
      setJoinOpen(false);
      setCode("");
      fetch();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to join team.");
    } finally {
      setLoading(false);
    }
  };

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teams</h1>
          <p className="text-sm text-zinc-500">Create or join spaces to collaborate.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setJoinOpen(true)}>
            Join
          </Button>
          <Button onClick={() => setCreateOpen(true)} className="gap-1">
            <Plus className="w-4 h-4" /> Team
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {teams.map((team, i) => (
          <motion.div
            key={team._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/teams/${team._id}`}
              className="block rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#1D2028] p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-lg">{team.name}</h3>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    copy(team.inviteCode);
                  }}
                  className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-lg bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 transition-colors"
                >
                  {copied === team.inviteCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {team.inviteCode}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {team.members?.slice(0, 4).map((m) => (
                    <Avatar key={m.id || m._id} src={m.avatar} name={m.username} size="sm" />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <Users className="w-3 h-3" /> {team.members?.length}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-white/10 p-10 text-center">
          <p className="text-zinc-500">No teams yet. Start by creating one.</p>
        </div>
      )}

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create Team">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input placeholder="Team name" value={name} onChange={(e) => setName(e.target.value)} required />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Create
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={joinOpen} onClose={() => setJoinOpen(false)} title="Join Team">
        <form onSubmit={handleJoin} className="space-y-4">
          <Input
            placeholder="Invite code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setJoinOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Join
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
