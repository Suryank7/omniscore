import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    // Process subscription updates & webhooks
    return NextResponse.json({ received: true, status: "processed" });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}
