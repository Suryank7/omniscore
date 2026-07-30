"use client";

import { useRouter } from "next/navigation";
import {
  FileUp,
  Briefcase,
  TrendingUp,
  Target,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";

export default function DashboardHub() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to <span className="text-emerald-400">OmniScore</span>
        </h1>
        <p className="text-slate-400">
          Upload your CV, connect your portfolio, and get AI-powered career intelligence.
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
        {/* Analyze CV */}
        <button
          onClick={() => router.push("/dashboard/analyze")}
          className="glass-card p-6 text-left group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
            <FileUp className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            Analyze CV
            <ArrowRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-sm text-slate-400">
            Upload your resume for instant AI analysis, scoring, and optimization suggestions.
          </p>
        </button>

        {/* Connect GitHub */}
        <button
          onClick={() => router.push("/dashboard/portfolio")}
          className="glass-card p-6 text-left group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
            <GithubIcon className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            Connect Portfolio
            <ArrowRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-sm text-slate-400">
            Link your GitHub to analyze repositories, commit patterns, and code quality.
          </p>
        </button>

        {/* View History */}
        <button
          onClick={() => router.push("/dashboard/history")}
          className="glass-card p-6 text-left group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
            <Briefcase className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            Past Analyses
            <ArrowRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-sm text-slate-400">
            Review your analysis history, track score improvements, and compare results.
          </p>
        </button>
      </div>

      {/* Feature Highlights */}
      <div className="glass-card-static p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          What OmniScore AI Evaluates
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Target,
              label: "ATS Compatibility",
              desc: "Formatting, headers, contact info",
              weight: "20%",
              color: "#06B6D4",
            },
            {
              icon: TrendingUp,
              label: "Skill Match",
              desc: "Skills vs. job requirements",
              weight: "40%",
              color: "#8B5CF6",
            },
            {
              icon: GithubIcon,
              label: "Proof of Work",
              desc: "GitHub repos, projects, certs",
              weight: "25%",
              color: "#F59E0B",
            },
            {
              icon: Zap,
              label: "Impact & Language",
              desc: "Action verbs, metrics, quality",
              weight: "15%",
              color: "#EC4899",
            },
          ].map((item) => (
            <div key={item.label} className="bg-navy-700/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                  background: `${item.color}15`,
                  color: item.color,
                }}>
                  {item.weight}
                </span>
              </div>
              <h4 className="text-sm font-semibold mb-0.5">{item.label}</h4>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="glass-card-static p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Start Guide</h2>
        <div className="space-y-3">
          {[
            { step: 1, text: "Upload your resume (PDF, DOCX, or paste text)", done: false },
            { step: 2, text: "Select a target job description (optional but recommended)", done: false },
            { step: 3, text: "Connect your GitHub profile for proof-of-work analysis", done: false },
            { step: 4, text: "Review your OmniScore and optimization suggestions", done: false },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                {item.step}
              </div>
              <span className="text-sm text-slate-300">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
