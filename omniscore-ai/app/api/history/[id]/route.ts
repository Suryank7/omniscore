// OmniScore AI — Analysis Detail API
// GET /api/history/[id] — Get full analysis by ID

import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const analysis = getAnalysis(id);

  if (!analysis) {
    return NextResponse.json(
      { error: "Analysis not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(analysis);
}
