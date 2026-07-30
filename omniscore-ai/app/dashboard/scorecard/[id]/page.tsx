"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ScoreGauge from "@/components/ui/ScoreGauge";
import RadarChart from "@/components/ui/RadarChart";
import {
  Brain,
  FileText,
  Target,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";

interface PillarData {
  score: number;
  weight: number;
  weightedScore: number;
  label: string;
  color: string;
  findings: { type: "positive" | "warning" | "negative"; message: string; category: string }[];
}

interface ScoreBreakdown {
  overall: number;
  grade: string;
  label: string;
  pillars: {
    ats: PillarData;
    skillMatch: PillarData;
    proofOfWork: PillarData;
    impact: PillarData;
  };
  details: { metric: string; value: string | number; status: "good" | "warning" | "poor"; tip: string }[];
}

interface AnalysisData {
  id: string;
  fileName: string;
  createdAt: string;
  parsedResume: {
    contactInfo: { name: string; email: string; phone: string };
    skills: string[];
    summary: string;
  };
  scoreBreakdown: ScoreBreakdown;
  optimizations: { id: string }[];
}

export default function ScorecardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "pillars" | "details">("overview");

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const res = await fetch(`/api/history/${id}`);
        if (res.ok) {
          const data = await res.json();
          setAnalysis(data);
        }
      } catch (err) {
        console.error("Failed to load analysis:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalysis();
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="h-10 skeleton w-1/3" />
        <div className="h-64 skeleton rounded-2xl" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-48 skeleton rounded-xl" />
          <div className="h-48 skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold mb-2">Analysis Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">The requested analysis could not be located.</p>
        <button onClick={() => router.push("/dashboard/analyze")} className="btn-primary">
          Start New Analysis
        </button>
      </div>
    );
  }

  const { overall, grade, label, pillars, details } = analysis.scoreBreakdown;

  const radarData = [
    { subject: "ATS Match", score: pillars.ats.score, fullMark: 100 },
    { subject: "Skill Match", score: pillars.skillMatch.score, fullMark: 100 },
    { subject: "Proof of Work", score: pillars.proofOfWork.score, fullMark: 100 },
    { subject: "Impact", score: pillars.impact.score, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Explainable AI Scorecard
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Profile <span className="text-emerald-400">Scorecard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Analysis for <span className="text-slate-200 font-medium">{analysis.fileName}</span> •{" "}
            {new Date(analysis.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href={`/api/export-pdf/${id}`}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            Download Executive PDF
          </a>
          <button
            onClick={() => router.push(`/dashboard/gaps/${id}`)}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <Target className="w-4 h-4 text-cyan-400" />
            Skill Gap Analysis
          </button>
          <button
            onClick={() => router.push(`/dashboard/optimize/${id}`)}
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <Lightbulb className="w-4 h-4" />
            Optimizations ({analysis.optimizations.length})
          </button>
        </div>
      </div>

      {/* Main Score & Radar Hero Card */}
      <div className="glass-card-static p-8 relative overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Gauge */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5 pb-6 lg:pb-0 lg:pr-8">
            <ScoreGauge score={overall} grade={grade} label={label} size="lg" />
            <div className="text-center mt-4 max-w-xs">
              <p className="text-xs text-slate-400">
                Composite weighted score based on 4 independent career intelligence pillars.
              </p>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="lg:col-span-7">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 text-center lg:text-left">
              Pillar Evaluation Radar
            </h3>
            <RadarChart data={radarData} />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-8">
        {(["overview", "pillars", "details"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "tab-active text-sm capitalize" : "tab-inactive text-sm capitalize"}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Pillar Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { key: "ats", title: "ATS Match", data: pillars.ats, icon: FileText, color: "#06B6D4" },
              { key: "skillMatch", title: "Skill Match", data: pillars.skillMatch, icon: Target, color: "#8B5CF6" },
              { key: "proofOfWork", title: "Proof of Work", data: pillars.proofOfWork, icon: GithubIcon, color: "#F59E0B" },
              { key: "impact", title: "Impact", data: pillars.impact, icon: Zap, color: "#EC4899" },
            ].map(({ title, data, icon: Icon, color }) => (
              <div key={title} className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-5 h-5" style={{ color }} />
                  <span className="text-xs text-slate-500">Weight {data.weight * 100}%</span>
                </div>
                <div className="flex items-baseline justify-between mb-1">
                  <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
                  <span className="text-xl font-bold" style={{ color: data.color }}>
                    {data.score}
                  </span>
                </div>
                <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${data.score}%`, background: data.color }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {data.findings[0]?.message || "Evaluated against industry standards."}
                </p>
              </div>
            ))}
          </div>

          {/* Key Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="glass-card-static p-6">
              <h3 className="text-sm font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Key Strengths
              </h3>
              <ul className="space-y-3">
                {Object.values(pillars)
                  .flatMap((p) => p.findings)
                  .filter((f) => f.type === "positive")
                  .slice(0, 5)
                  .map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{finding.message}</span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="glass-card-static p-6">
              <h3 className="text-sm font-bold text-amber-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Priority Improvements
              </h3>
              <ul className="space-y-3">
                {Object.values(pillars)
                  .flatMap((p) => p.findings)
                  .filter((f) => f.type === "warning" || f.type === "negative")
                  .slice(0, 5)
                  .map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                          finding.type === "negative" ? "bg-crimson-400" : "bg-amber-400"
                        }`}
                      />
                      <span>{finding.message}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Detailed Pillars */}
      {activeTab === "pillars" && (
        <div className="space-y-6">
          {[
            { name: "ATS Compatibility", data: pillars.ats, color: "#06B6D4" },
            { name: "Skill Match Analysis", data: pillars.skillMatch, color: "#8B5CF6" },
            { name: "Proof of Work", data: pillars.proofOfWork, color: "#F59E0B" },
            { name: "Impact & Bullet Quality", data: pillars.impact, color: "#EC4899" },
          ].map(({ name, data, color }) => (
            <div key={name} className="glass-card-static p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">{name}</h3>
                  <p className="text-xs text-slate-400">
                    Weight: {data.weight * 100}% • Weighted Contribution: {data.weightedScore} pts
                  </p>
                </div>
                <div className="text-2xl font-bold" style={{ color }}>
                  {data.score} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300">Algorithmic Findings:</h4>
                {data.findings.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-navy-700/30 text-xs text-slate-200"
                  >
                    {f.type === "positive" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                    {f.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                    {f.type === "negative" && <XCircle className="w-4 h-4 text-crimson-400 shrink-0 mt-0.5" />}
                    <div>
                      <span className="font-semibold text-slate-400 mr-2">[{f.category}]</span>
                      {f.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Structure & Formatting Details */}
      {activeTab === "details" && (
        <div className="glass-card-static p-6">
          <h3 className="text-base font-bold mb-4">Structural Evaluation Matrix</h3>
          <div className="divide-y divide-white/5">
            {details.map((detail, idx) => (
              <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-white">{detail.metric}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{detail.tip}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-bold">{detail.value}</span>
                  <span
                    className={`skill-badge text-xs capitalize ${
                      detail.status === "good"
                        ? "skill-badge-matched"
                        : detail.status === "warning"
                        ? "skill-badge-partial"
                        : "skill-badge-missing"
                    }`}
                  >
                    {detail.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
