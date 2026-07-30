import { NextRequest, NextResponse } from "next/server";
import { getWorkspace, addCandidateToWorkspace } from "@/lib/workspaces";

export async function GET() {
  const ws = getWorkspace();
  return NextResponse.json(ws);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newCandidate = addCandidateToWorkspace(body);
    return NextResponse.json(newCandidate);
  } catch (error) {
    console.error("Workspace API error:", error);
    return NextResponse.json(
      { error: "Failed to add candidate to workspace pool" },
      { status: 500 }
    );
  }
}
