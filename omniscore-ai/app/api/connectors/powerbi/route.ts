import { NextRequest, NextResponse } from "next/server";
import { evaluatePowerBIReport } from "@/lib/ai/powerbi-analyzer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportUrl } = body;

    const data = evaluatePowerBIReport(reportUrl || "");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Power BI API error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate Power BI report." },
      { status: 500 }
    );
  }
}
