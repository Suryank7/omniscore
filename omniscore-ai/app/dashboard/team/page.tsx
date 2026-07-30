"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  UserPlus,
  Shield,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  ArrowUpDown,
  Search,
} from "lucide-react";

interface CandidatePoolItem {
  id: string;
  candidateName: string;
  email: string;
  targetRole: string;
  overallScore: number;
  grade: string;
  atsScore: number;
  skillMatchScore: number;
  proofOfWorkScore: number;
  impactScore: number;
  matchedSkillsCount: number;
  missingCriticalSkillsCount: number;
  analyzedAt: string;
}

interface Workspace {
  id: string;
  name: string;
  tier: string;
  members: { id: string; name: string; email: string; role: string }[];
  candidatePool: CandidatePoolItem[];
}

export default function TeamWorkspacePage() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    async function fetchWorkspace() {
      try {
        const res = await fetch("/api/workspaces");
        if (res.ok) setWorkspace(await res.json());
      } catch (err) {
        console.error("Workspace fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWorkspace();
  }, []);

  if (isLoading) {
    return <div className="h-64 skeleton rounded-2xl max-w-5xl mx-auto" />;
  }

  if (!workspace) return null;

  const filteredPool = workspace.candidatePool.filter(
    (c) =>
      c.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      c.targetRole.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" /> Multi-Tenant Enterprise Recruiter Workspace
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{workspace.name}</h1>
          <p className="text-xs text-slate-400 mt-1">
            {workspace.members.length} team members • {workspace.candidatePool.length} evaluated candidates in candidate pool
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="email"
            placeholder="Teammate email..."
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="input-field text-xs py-2 w-48"
          />
          <button className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shrink-0">
            <UserPlus className="w-3.5 h-3.5" /> Invite Teammate
          </button>
        </div>
      </div>

      {/* Team Members Bar */}
      <div className="glass-card-static p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-purple-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Recruiting Team Members</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {workspace.members.map((m) => (
            <div key={m.id} className="flex items-center gap-2 bg-navy-700/60 px-3 py-1 rounded-full text-xs text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold">{m.name}</span>
              <span className="text-[10px] text-slate-400 uppercase">({m.role})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Pool Comparison Matrix */}
      <div className="glass-card-static p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            Candidate Candidate Pool Matrix & Ranking
          </h2>

          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search candidate pool..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 text-xs py-2"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-700/50 text-slate-400 font-semibold border-b border-white/5">
              <tr>
                <th className="p-3">Candidate</th>
                <th className="p-3">Target Role</th>
                <th className="p-3 text-center">OmniScore</th>
                <th className="p-3 text-center">ATS Match</th>
                <th className="p-3 text-center">Skill Match</th>
                <th className="p-3 text-center">Proof of Work</th>
                <th className="p-3 text-center">Impact</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPool.map((cand) => (
                <tr key={cand.id} className="hover:bg-navy-700/20 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-white">{cand.candidateName}</div>
                    <div className="text-[10px] text-slate-400">{cand.email}</div>
                  </td>
                  <td className="p-3 text-slate-300 font-medium">{cand.targetRole}</td>
                  <td className="p-3 text-center">
                    <span className="inline-block text-sm font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {cand.overallScore} (Grade {cand.grade})
                    </span>
                  </td>
                  <td className="p-3 text-center text-cyan-400 font-bold">{cand.atsScore}%</td>
                  <td className="p-3 text-center text-purple-400 font-bold">{cand.skillMatchScore}%</td>
                  <td className="p-3 text-center text-amber-400 font-bold">{cand.proofOfWorkScore}%</td>
                  <td className="p-3 text-center text-pink-400 font-bold">{cand.impactScore}%</td>
                  <td className="p-3 text-right">
                    <a
                      href={`/api/export-pdf/${cand.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-emerald-400 hover:underline font-semibold"
                    >
                      Export PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
