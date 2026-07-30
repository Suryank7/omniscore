"use client";

import { useState } from "react";
import {
  Link as LinkIcon,
  Star,
  GitCommit,
  FolderGit2,
  Code2,
  ExternalLink,
  CheckCircle2,
  Loader2,
  PieChart,
  BarChart3,
  Award,
  Users,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";

interface GitHubData {
  username: string;
  repos: number;
  stars: number;
  commits: number;
  languages: string[];
  topRepoList: { name: string; stars: number; language: string }[];
}

interface LinkedInData {
  username: string;
  headline: string;
  location: string;
  connections: number;
  about: string;
  experienceCount: number;
  skills: { name: string; endorsements: number }[];
  certifications: string[];
  completenessScore: number;
}

interface TableauData {
  username: string;
  totalWorkbooks: number;
  totalViews: number;
  favoriteCount: number;
  authorRank: string;
  visualizationScore: number;
}

interface PowerBIData {
  reportName: string;
  pageCount: number;
  daxMeasuresCount: number;
  interactivityScore: number;
  powerBIScore: number;
}

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<"github" | "linkedin" | "tableau" | "powerbi">("github");
  const [usernameInput, setUsernameInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // States
  const [githubData, setGithubData] = useState<GitHubData | null>({
    username: "demo-developer",
    repos: 14,
    stars: 32,
    commits: 450,
    languages: ["TypeScript", "Python", "JavaScript", "HTML/CSS"],
    topRepoList: [
      { name: "omniscore-ai", stars: 18, language: "TypeScript" },
      { name: "ml-resume-parser", stars: 9, language: "Python" },
      { name: "react-dashboard-kit", stars: 5, language: "TypeScript" },
    ],
  });

  const [linkedinData, setLinkedinData] = useState<LinkedInData | null>({
    username: "alex-tech-lead",
    headline: "Senior Software Engineer | React, Node.js, Python & AI Systems",
    location: "San Francisco, CA",
    connections: 500,
    about: "Building enterprise scalable web apps and AI agents. Experienced in microservices architecture.",
    experienceCount: 4,
    skills: [
      { name: "React.js", endorsements: 42 },
      { name: "Python", endorsements: 38 },
      { name: "TypeScript", endorsements: 31 },
      { name: "Node.js", endorsements: 29 },
    ],
    certifications: ["AWS Certified Solutions Architect", "Meta Professional Developer"],
    completenessScore: 94,
  });

  const [tableauData, setTableauData] = useState<TableauData | null>({
    username: "alex_viz_analytics",
    totalWorkbooks: 6,
    totalViews: 4850,
    favoriteCount: 24,
    authorRank: "Featured Creator",
    visualizationScore: 88,
  });

  const [powerbiData, setPowerbiData] = useState<PowerBIData | null>({
    reportName: "Enterprise Financial Analytics Dashboard",
    pageCount: 4,
    daxMeasuresCount: 18,
    interactivityScore: 90,
    powerBIScore: 86,
  });

  const handleConnect = async () => {
    if (!usernameInput.trim()) return;
    setIsLoading(true);

    try {
      if (activeTab === "github") {
        const res = await fetch(`/api/github?username=${encodeURIComponent(usernameInput.trim())}`);
        if (res.ok) {
          const profile = await res.json();
          setGithubData({
            username: profile.user.login,
            repos: profile.metrics.totalRepos,
            stars: profile.metrics.totalStars,
            commits: profile.metrics.totalCommits,
            languages: profile.metrics.languages,
            topRepoList: profile.metrics.topRepos,
          });
        }
      } else if (activeTab === "linkedin") {
        const res = await fetch("/api/connectors/linkedin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileInput: usernameInput }),
        });
        if (res.ok) setLinkedinData(await res.json());
      } else if (activeTab === "tableau") {
        const res = await fetch(`/api/connectors/tableau?username=${encodeURIComponent(usernameInput.trim())}`);
        if (res.ok) setTableauData(await res.json());
      } else if (activeTab === "powerbi") {
        const res = await fetch("/api/connectors/powerbi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reportUrl: usernameInput }),
        });
        if (res.ok) setPowerbiData(await res.json());
      }
    } catch (err) {
      console.error("Connector sync error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Multi-Platform <span className="text-purple-400">Proof-of-Work</span>
        </h1>
        <p className="text-slate-400 text-xs">
          Connect your GitHub, LinkedIn, Tableau Public, or Power BI profiles to boost your candidate proof-of-work score.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-white/10 gap-6">
        {[
          { id: "github", label: "GitHub Code", icon: GithubIcon, color: "#8B5CF6" },
          { id: "linkedin", label: "LinkedIn Profile", icon: Users, color: "#06B6D4" },
          { id: "tableau", label: "Tableau Public", icon: PieChart, color: "#F59E0B" },
          { id: "powerbi", label: "Power BI", icon: BarChart3, color: "#EC4899" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as typeof activeTab);
              setUsernameInput("");
            }}
            className={`flex items-center gap-2 text-xs py-3 font-semibold transition-all border-b-2 ${
              activeTab === tab.id
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <tab.icon className="w-4 h-4" style={{ color: tab.color }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input Sync Header */}
      <div className="glass-card-static p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              {activeTab === "github" && "Sync GitHub Profile"}
              {activeTab === "linkedin" && "Sync LinkedIn Profile"}
              {activeTab === "tableau" && "Sync Tableau Public Profile"}
              {activeTab === "powerbi" && "Evaluate Power BI Workspace"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeTab === "github" && "Pulls repositories, commits, and languages"}
              {activeTab === "linkedin" && "Pulls experience, endorsements, and certs"}
              {activeTab === "tableau" && "Pulls workbooks, sheet counts, and views"}
              {activeTab === "powerbi" && "Evaluates DAX measure complexity & design"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={
                activeTab === "github"
                  ? "GitHub handle..."
                  : activeTab === "linkedin"
                  ? "LinkedIn profile URL..."
                  : activeTab === "tableau"
                  ? "Tableau username..."
                  : "Power BI embed link..."
              }
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="input-field text-xs py-2 w-56"
            />
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shrink-0"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LinkIcon className="w-3.5 h-3.5" />}
              Sync Connector
            </button>
          </div>
        </div>

        {/* Tab Content 1: GitHub */}
        {activeTab === "github" && githubData && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                <div>
                  <span className="text-sm font-bold text-white">Connected: @{githubData.username}</span>
                  <p className="text-xs text-slate-400">Proof-of-Work metrics active</p>
                </div>
              </div>
              <a href={`https://github.com/${githubData.username}`} target="_blank" rel="noreferrer" className="text-xs text-purple-300 flex items-center gap-1">
                View <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-navy-700/40 rounded-xl p-4 border border-white/5">
                <div className="text-xs text-slate-400 mb-1">Public Repos</div>
                <div className="text-2xl font-bold text-white">{githubData.repos}</div>
              </div>
              <div className="bg-navy-700/40 rounded-xl p-4 border border-white/5">
                <div className="text-xs text-slate-400 mb-1">Total Stars</div>
                <div className="text-2xl font-bold text-amber-400">{githubData.stars}</div>
              </div>
              <div className="bg-navy-700/40 rounded-xl p-4 border border-white/5">
                <div className="text-xs text-slate-400 mb-1">Total Commits</div>
                <div className="text-2xl font-bold text-emerald-400">{githubData.commits}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: LinkedIn */}
        {activeTab === "linkedin" && linkedinData && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <div>
                  <span className="text-sm font-bold text-white">Profile: {linkedinData.headline}</span>
                  <p className="text-xs text-slate-400">{linkedinData.location} • {linkedinData.connections}+ connections</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-cyan-400">{linkedinData.completenessScore}%</span>
                <p className="text-[10px] text-slate-400">Completeness</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-navy-700/40 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-400 mb-2">Endorsed Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {linkedinData.skills.map((s) => (
                    <span key={s.name} className="skill-badge skill-badge-matched text-xs">
                      {s.name} ({s.endorsements})
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-navy-700/40 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-400 mb-2">Certifications</h4>
                <ul className="space-y-1">
                  {linkedinData.certifications.map((c) => (
                    <li key={c} className="text-xs text-slate-200 flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-amber-400" /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 3: Tableau */}
        {activeTab === "tableau" && tableauData && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <PieChart className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-sm font-bold text-white">Tableau Author: @{tableauData.username}</span>
                  <p className="text-xs text-slate-400">{tableauData.authorRank} • {tableauData.totalViews} Views</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-amber-400">{tableauData.visualizationScore}/100</span>
                <p className="text-[10px] text-slate-400">Viz Complexity Score</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-navy-700/40 rounded-xl p-4">
                <span className="text-xs text-slate-400">Published Workbooks</span>
                <div className="text-2xl font-bold text-white">{tableauData.totalWorkbooks}</div>
              </div>
              <div className="bg-navy-700/40 rounded-xl p-4">
                <span className="text-xs text-slate-400">Community Favorites</span>
                <div className="text-2xl font-bold text-amber-400">{tableauData.favoriteCount}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 4: Power BI */}
        {activeTab === "powerbi" && powerbiData && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-pink-500/10 border border-pink-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-pink-400" />
                <div>
                  <span className="text-sm font-bold text-white">{powerbiData.reportName}</span>
                  <p className="text-xs text-slate-400">{powerbiData.pageCount} Pages • {powerbiData.daxMeasuresCount} DAX Measures</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-pink-400">{powerbiData.powerBIScore}/100</span>
                <p className="text-[10px] text-slate-400">DAX Score</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-navy-700/40 rounded-xl p-4">
                <span className="text-xs text-slate-400">DAX Measure Density</span>
                <div className="text-2xl font-bold text-white">{powerbiData.daxMeasuresCount} Calculated Measures</div>
              </div>
              <div className="bg-navy-700/40 rounded-xl p-4">
                <span className="text-xs text-slate-400">Dashboard Interactivity</span>
                <div className="text-2xl font-bold text-emerald-400">{powerbiData.interactivityScore}%</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
