"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SkillMatrix from "@/components/ui/SkillMatrix";
import {
  Target,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Search,
} from "lucide-react";

interface SkillMatchResult {
  overallSimilarity: number;
  matchPercentage: number;
  matchedSkills: { skill: string; category: string; importance: "critical" | "important" | "nice-to-have"; matchType: "exact" | "semantic" | "partial" }[];
  missingSkills: { skill: string; category: string; importance: "critical" | "important" | "nice-to-have"; suggestion: string }[];
  categoryBreakdown: { category: string; matched: number; total: number; percentage: number; skills: { name: string; matched: boolean }[] }[];
}

interface AnalysisData {
  id: string;
  fileName: string;
  skillMatch: SkillMatchResult | null;
}

export default function SkillGapsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("All");

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
    return <div className="h-64 skeleton rounded-2xl max-w-5xl mx-auto" />;
  }

  if (!analysis || !analysis.skillMatch) {
    return (
      <div className="text-center py-16 max-w-xl mx-auto space-y-4">
        <Target className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold">No Target Job Match Found</h2>
        <p className="text-sm text-slate-400">
          This analysis was run without a target job description. Run a new analysis and select or paste a job description to generate skill gap analytics.
        </p>
        <button onClick={() => router.push("/dashboard/analyze")} className="btn-primary">
          Run Analysis with Job Description
        </button>
      </div>
    );
  }

  const { skillMatch } = analysis;
  const categories = ["All", ...skillMatch.categoryBreakdown.map((c) => c.category)];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.push(`/dashboard/scorecard/${id}`)}
            className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Scorecard
          </button>
          <h1 className="text-3xl font-bold tracking-tight">
            Skill Gap <span className="text-cyan-400">Analyzer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Vector-driven contextual match score:{" "}
            <span className="text-cyan-400 font-bold">
              {Math.round(skillMatch.matchPercentage)}% Match
            </span>{" "}
            ({(skillMatch.overallSimilarity * 100).toFixed(0)}% cosine similarity)
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="text-xs text-slate-400 mb-1">Overall Skill Alignment</div>
          <div className="text-3xl font-extrabold text-cyan-400">
            {Math.round(skillMatch.matchPercentage)}%
          </div>
          <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-cyan-400 rounded-full"
              style={{ width: `${skillMatch.matchPercentage}%` }}
            />
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="text-xs text-slate-400 mb-1">Matched Skills</div>
          <div className="text-3xl font-extrabold text-emerald-400">
            {skillMatch.matchedSkills.length}
          </div>
          <p className="text-xs text-slate-500 mt-2">Satisfies target role requirements</p>
        </div>

        <div className="glass-card p-5">
          <div className="text-xs text-slate-400 mb-1">Missing Critical Gaps</div>
          <div className="text-3xl font-extrabold text-crimson-400">
            {skillMatch.missingSkills.filter((s) => s.importance === "critical").length}
          </div>
          <p className="text-xs text-slate-500 mt-2">Requires immediate attention</p>
        </div>
      </div>

      {/* Side-by-side Skill Matrix */}
      <SkillMatrix
        matchedSkills={skillMatch.matchedSkills}
        missingSkills={skillMatch.missingSkills}
      />

      {/* Category Breakdown Progress */}
      <div className="glass-card-static p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Skill Category Breakdown</h2>
          <div className="flex gap-2">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                  filterCategory === cat
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold"
                    : "border-glass-border text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {skillMatch.categoryBreakdown
            .filter((cat) => filterCategory === "All" || cat.category === filterCategory)
            .map((cat) => (
              <div key={cat.category} className="space-y-2 bg-navy-700/30 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{cat.category}</span>
                  <span className="text-slate-400 font-mono">
                    {cat.matched} / {cat.total} ({Math.round(cat.percentage)}%)
                  </span>
                </div>

                <div className="h-2 bg-navy-600 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percentage}%`,
                      background: cat.percentage >= 80 ? "#10B981" : cat.percentage >= 40 ? "#F59E0B" : "#EF4444",
                    }}
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cat.skills.map((s) => (
                    <span
                      key={s.name}
                      className={`text-[11px] px-2 py-0.5 rounded-full ${
                        s.matched
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : "bg-crimson-500/15 text-crimson-300 border border-crimson-500/30"
                      }`}
                    >
                      {s.matched ? "✓" : "✗"} {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Actionable Learning Suggestions */}
      <div className="glass-card-static p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          Recommended Action Plan for Skill Gaps
        </h2>

        <div className="space-y-3">
          {skillMatch.missingSkills.map((missing, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-navy-700/40 border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-200">{missing.skill}</span>
                <span className={`priority-badge text-[10px] px-2 py-0.5 rounded-full capitalize priority-${missing.importance}`}>
                  {missing.importance} gap
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{missing.suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
