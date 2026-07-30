// OmniScore AI — Job Descriptions API
// GET /api/job-descriptions — List all job descriptions
// POST /api/job-descriptions — Create a new job description

import { NextRequest, NextResponse } from "next/server";
import { listJobDescriptions, saveJobDescription } from "@/lib/store";
import { extractJobSkills } from "@/lib/ai/skill-matcher";

export async function GET() {
  const jobs = listJobDescriptions();
  return NextResponse.json(jobs);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, company, rawText } = body;

    if (!title || !rawText) {
      return NextResponse.json(
        { error: "Title and rawText are required" },
        { status: 400 }
      );
    }

    const extractedSkills = extractJobSkills(rawText);

    const jd = saveJobDescription({
      title,
      company: company || "",
      rawText,
      extractedSkills,
    });

    return NextResponse.json(jd);
  } catch (error) {
    console.error("Error creating job description:", error);
    return NextResponse.json(
      { error: "Failed to create job description" },
      { status: 500 }
    );
  }
}
