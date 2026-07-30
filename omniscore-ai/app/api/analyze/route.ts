// OmniScore AI — Main Analysis API Route
// POST /api/analyze — Accepts CV file + optional job description ID
// Orchestrates: parse → extract skills → score → generate suggestions

import { NextRequest, NextResponse } from "next/server";
import { parseResumeText } from "@/lib/ai/resume-parser";
import { analyzeSkillGap, extractJobSkills } from "@/lib/ai/skill-matcher";
import { calculateScore } from "@/lib/ai/scoring-engine";
import { generateOptimizations } from "@/lib/ai/optimization-engine";
import { saveAnalysis, getJobDescription } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const resumeText = formData.get("resumeText") as string | null;
    const jobDescriptionId = formData.get("jobDescriptionId") as string | null;
    const jobDescriptionText = formData.get("jobDescriptionText") as string | null;
    const githubUsername = formData.get("githubUsername") as string | null;

    // Get text from file or direct text input
    let text = "";
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith(".pdf")) {
        // Dynamic import for pdf-parse
        const pdfParseModule = await import("pdf-parse");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfParse = (pdfParseModule as any).default || pdfParseModule;
        const pdfData = await pdfParse(buffer);
        text = pdfData.text;
      } else if (fileName.endsWith(".docx")) {
        // Dynamic import for mammoth
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } else if (fileName.endsWith(".txt")) {
        text = buffer.toString("utf-8");
      } else {
        return NextResponse.json(
          { error: "Unsupported file format. Please upload PDF, DOCX, or TXT." },
          { status: 400 }
        );
      }
    } else if (resumeText) {
      text = resumeText;
    } else {
      return NextResponse.json(
        { error: "No file or text provided." },
        { status: 400 }
      );
    }

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: "Could not extract sufficient text from the document. Please check the file." },
        { status: 400 }
      );
    }

    // Step 1: Parse resume
    const parsedResume = parseResumeText(text);

    // Step 2: Skill gap analysis (if job description provided)
    let skillMatch = null;
    let jobSkills: string[] = [];

    if (jobDescriptionId) {
      const jd = getJobDescription(jobDescriptionId);
      if (jd) {
        jobSkills = jd.extractedSkills;
        skillMatch = analyzeSkillGap(parsedResume.skills, jobSkills);
      }
    } else if (jobDescriptionText) {
      jobSkills = extractJobSkills(jobDescriptionText);
      if (jobSkills.length > 0) {
        skillMatch = analyzeSkillGap(parsedResume.skills, jobSkills);
      }
    }

    // Step 3: GitHub analysis (optional)
    let githubMetrics = null;
    if (githubUsername) {
      try {
        const { analyzeGitHubProfile } = await import("@/lib/ai/github-analyzer");
        const githubToken = process.env.GITHUB_TOKEN;
        const profile = await analyzeGitHubProfile(githubUsername, githubToken);
        githubMetrics = profile.metrics;
      } catch {
        console.warn("GitHub analysis failed, continuing without it");
      }
    }

    // Step 4: Calculate explainable score
    const scoreBreakdown = calculateScore(parsedResume, skillMatch, githubMetrics);

    // Step 5: Generate optimization suggestions
    const optimizations = generateOptimizations(parsedResume, skillMatch);

    // Step 6: Save analysis
    const analysis = saveAnalysis({
      fileName: file?.name || "pasted-text",
      fileSize: file?.size || text.length,
      rawText: text,
      parsedResume,
      skillMatch,
      scoreBreakdown,
      optimizations,
      jobDescriptionId,
      githubUsername,
      githubMetrics,
    });

    return NextResponse.json({
      id: analysis.id,
      parsedResume,
      skillMatch,
      scoreBreakdown,
      optimizations,
      githubMetrics,
      metadata: {
        fileName: file?.name || "pasted-text",
        processedAt: analysis.createdAt,
        textLength: text.length,
        skillsFound: parsedResume.skills.length,
        suggestionsCount: optimizations.length,
      },
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
