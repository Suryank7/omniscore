// OmniScore AI — History API
// GET /api/history — List past analyses

import { NextResponse } from "next/server";
import { listAnalyses } from "@/lib/store";

export async function GET() {
  const analyses = listAnalyses();
  
  // Return summary data (exclude raw text for performance)
  const summaries = analyses.map((a) => ({
    id: a.id,
    createdAt: a.createdAt,
    fileName: a.fileName,
    fileSize: a.fileSize,
    score: (a.scoreBreakdown as { overall: number })?.overall || 0,
    grade: (a.scoreBreakdown as { grade: string })?.grade || "N/A",
    label: (a.scoreBreakdown as { label: string })?.label || "N/A",
    jobDescriptionId: a.jobDescriptionId,
    githubUsername: a.githubUsername,
    skillsCount: (a.parsedResume as { skills: string[] })?.skills?.length || 0,
    suggestionsCount: (a.optimizations as unknown[])?.length || 0,
  }));

  return NextResponse.json(summaries);
}
