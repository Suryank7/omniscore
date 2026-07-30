import { NextRequest, NextResponse } from "next/server";
import { analyzeTableauProfile } from "@/lib/ai/tableau-analyzer";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "demo_analyst";

  try {
    const data = await analyzeTableauProfile(username);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Tableau API error:", error);
    return NextResponse.json(
      { error: "Failed to connect to Tableau Public API." },
      { status: 500 }
    );
  }
}
