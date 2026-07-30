"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lightbulb,
  ArrowLeft,
  Check,
  Copy,
  Sparkles,
  AlertCircle,
  TrendingUp,
  FileText,
  Tag,
} from "lucide-react";

interface Suggestion {
  id: string;
  category: "ats" | "keywords" | "impact" | "formatting" | "content";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  original?: string;
  suggested?: string;
  section: string;
}

interface AnalysisData {
  id: string;
  fileName: string;
  optimizations: Suggestion[];
}

export default function OptimizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

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

  const handleCopy = (text: string, suggId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(suggId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleApplied = (suggId: string) => {
    setAppliedIds((prev) => {
      const next = new Set(prev);
      if (next.has(suggId)) next.delete(suggId);
      else next.add(suggId);
      return next;
    });
  };

  if (isLoading) {
    return <div className="h-64 skeleton rounded-2xl max-w-5xl mx-auto" />;
  }

  if (!analysis) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold">Analysis Not Found</h2>
        <button onClick={() => router.push("/dashboard/analyze")} className="btn-primary mt-4">
          Start Analysis
        </button>
      </div>
    );
  }

  const { optimizations } = analysis;

  const filtered = optimizations.filter((s) => {
    if (activeCategory === "all") return true;
    return s.category === activeCategory;
  });

  const categories = [
    { id: "all", label: "All Suggestions", count: optimizations.length },
    { id: "impact", label: "Impact & Language", count: optimizations.filter((s) => s.category === "impact").length },
    { id: "ats", label: "ATS Optimization", count: optimizations.filter((s) => s.category === "ats").length },
    { id: "keywords", label: "Missing Keywords", count: optimizations.filter((s) => s.category === "keywords").length },
    { id: "content", label: "Content Structure", count: optimizations.filter((s) => s.category === "content").length },
  ];

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
            Real-Time <span className="text-emerald-400">Optimization Suggestions</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Line-by-line bullet rewrites and actionable improvements for{" "}
            <span className="text-slate-200 font-medium">{analysis.fileName}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs text-emerald-400">
          <Sparkles className="w-4 h-4" />
          <span>{appliedIds.size} / {optimizations.length} suggestions marked applied</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
              activeCategory === cat.id
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-semibold"
                : "border-glass-border text-slate-400 hover:text-white"
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Suggestion Cards Feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 glass-card-static">
            <p className="text-sm text-slate-400">No suggestions found in this category.</p>
          </div>
        ) : (
          filtered.map((sugg) => {
            const isApplied = appliedIds.has(sugg.id);

            return (
              <div
                key={sugg.id}
                className={`glass-card p-6 transition-all ${
                  isApplied ? "opacity-60 border-emerald-500/40" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        sugg.priority === "high"
                          ? "priority-high"
                          : sugg.priority === "medium"
                          ? "priority-medium"
                          : "priority-low"
                      }`}
                    >
                      {sugg.priority} Priority
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Tag className="w-3 h-3 text-slate-500" />
                      {sugg.section}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleApplied(sugg.id)}
                    className={`text-xs px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                      isApplied
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        : "border-glass-border hover:border-slate-500 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {isApplied ? "Applied" : "Mark as Done"}
                  </button>
                </div>

                <h3 className="text-base font-bold text-white mb-2">{sugg.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{sugg.description}</p>

                {/* Diff View (Original vs Suggested) */}
                {(sugg.original || sugg.suggested) && (
                  <div className="space-y-3 bg-navy-800/60 rounded-xl p-4 border border-white/5 font-mono text-xs">
                    {sugg.original && (
                      <div>
                        <span className="text-[10px] text-crimson-400 uppercase font-bold tracking-wider block mb-1">
                          Current Text:
                        </span>
                        <div className="p-2.5 rounded bg-crimson-500/10 text-crimson-200 border-l-2 border-crimson-500">
                          {sugg.original}
                        </div>
                      </div>
                    )}

                    {sugg.suggested && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                            Suggested Optimization:
                          </span>
                          <button
                            onClick={() => handleCopy(sugg.suggested!, sugg.id)}
                            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                          >
                            {copiedId === sugg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            {copiedId === sugg.id ? "Copied!" : "Copy Suggestion"}
                          </button>
                        </div>
                        <div className="p-2.5 rounded bg-emerald-500/10 text-emerald-200 border-l-2 border-emerald-500">
                          {sugg.suggested}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
