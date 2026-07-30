import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/store";
import { generateScorecardHTMLReport } from "@/lib/pdf-exporter";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const analysis = getAnalysis(id);

  if (!analysis) {
    return NextResponse.json({ error: "Analysis record not found" }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reportHTML = generateScorecardHTMLReport(analysis as any);

  // Return HTML document configured to auto-trigger window.print() or download
  const htmlContent = reportHTML.replace(
    "</body>",
    "<script>window.onload = function() { window.print(); }</script></body>"
  );

  return new NextResponse(htmlContent, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
