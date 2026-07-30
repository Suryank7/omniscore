"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Calendar,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Search,
} from "lucide-react";

interface AnalysisSummary {
  id: string;
  createdAt: string;
  fileName: string;
  score: number;
  grade: string;
  label: string;
  skillsCount: number;
  suggestionsCount: number;
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<AnalysisSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/history");
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const filtered = history.filter((item) =>
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Analysis <span className="text-cyan-400">History</span>
          </h1>
          <p className="text-slate-400 text-xs">
            Track past profile evaluations and score progression over time.
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard/analyze")}
          className="btn-primary text-xs py-2 px-4 shrink-0"
        >
          + New Analysis
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Filter by filename..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-10 text-xs py-2.5"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-20 skeleton rounded-xl" />
          <div className="h-20 skeleton rounded-xl" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 glass-card-static space-y-3">
          <FileText className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold">No Analysis Records</h3>
          <p className="text-xs text-slate-400">
            {searchQuery ? "No results match your search." : "Run your first CV analysis to see historical records here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/dashboard/scorecard/${item.id}`)}
              className="glass-card p-5 flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy-700/60 border border-white/5 flex items-center justify-center font-bold text-lg text-emerald-400 shrink-0">
                  {item.score}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {item.fileName}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span>• {item.skillsCount} skills detected</span>
                    <span>• {item.suggestionsCount} suggestions</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="skill-badge skill-badge-matched text-xs hidden sm:inline-flex">
                  Grade {item.grade}
                </span>
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
