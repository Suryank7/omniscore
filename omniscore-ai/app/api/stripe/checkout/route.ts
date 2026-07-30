import { NextRequest, NextResponse } from "next/server";
import { getTier } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tierId } = body;

    const tier = getTier(tierId || "pro");

    // Mock Checkout Session response for seamless offline operation
    const mockCheckoutUrl = `${request.nextUrl.origin}/pricing?success=true&tier=${tier.id}`;

    return NextResponse.json({
      url: mockCheckoutUrl,
      tier: tier.name,
      message: `Checkout session initialized for ${tier.name}`,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to initialize Stripe checkout session." },
      { status: 500 }
    );
  }
}
