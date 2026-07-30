"use client";

import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface SkillItem {
  skill: string;
  category: string;
  importance: "critical" | "important" | "nice-to-have";
  matchType?: "exact" | "semantic" | "partial";
}

interface SkillMatrixProps {
  matchedSkills: SkillItem[];
  missingSkills: SkillItem[];
}

export default function SkillMatrix({
  matchedSkills,
  missingSkills,
}: SkillMatrixProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Matched Skills */}
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-emerald-400">
            Matched Skills ({matchedSkills.length})
          </h3>
        </div>
        {matchedSkills.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No skills matched yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((item, idx) => (
              <div
                key={idx}
                className="skill-badge skill-badge-matched gap-1.5 py-1 text-xs"
              >
                <span>{item.skill}</span>
                {item.matchType === "semantic" && (
                  <span className="text-[10px] text-emerald-300 opacity-80">(contextual)</span>
                )}
                {item.matchType === "partial" && (
                  <span className="text-[10px] text-amber-300 opacity-80">(partial)</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Missing Skills */}
      <div className="bg-crimson-500/5 border border-crimson-500/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <XCircle className="w-5 h-5 text-crimson-400" />
          <h3 className="text-sm font-bold text-crimson-400">
            Missing Skills / Gaps ({missingSkills.length})
          </h3>
        </div>
        {missingSkills.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No skill gaps detected!</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((item, idx) => (
              <div
                key={idx}
                className={`skill-badge gap-1.5 py-1 text-xs ${
                  item.importance === "critical"
                    ? "skill-badge-missing"
                    : "skill-badge-partial"
                }`}
              >
                {item.importance === "critical" && (
                  <AlertCircle className="w-3 h-3 text-crimson-400 shrink-0" />
                )}
                <span>{item.skill}</span>
                <span className="text-[10px] opacity-75">({item.importance})</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
