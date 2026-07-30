import { NextRequest, NextResponse } from "next/server";
import { parseLinkedInProfile } from "@/lib/ai/linkedin-parser";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileInput } = body;

    if (!profileInput) {
      return NextResponse.json(
        { error: "LinkedIn profile URL or JSON data is required." },
        { status: 400 }
      );
    }

    const data = parseLinkedInProfile(profileInput);
    return NextResponse.json(data);
  } catch (error) {
    console.error("LinkedIn parser API error:", error);
    return NextResponse.json(
      { error: "Failed to parse LinkedIn profile." },
      { status: 500 }
    );
  }
}
