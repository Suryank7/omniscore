// OmniScore AI — Stripe Monetization Helper & Subscription Tiers

export interface PricingTier {
  id: "free" | "pro" | "enterprise";
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  stripePriceIdMonthly?: string;
  popular?: boolean;
  ctaText: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Freemium Candidate",
    priceMonthly: 0,
    priceYearly: 0,
    description: "Essential career intelligence for job seekers",
    features: [
      "3 CV analyses per month",
      "Explainable 0-100 OmniScore",
      "Basic ATS formatting check",
      "Standard skill gap report",
    ],
    ctaText: "Current Plan",
  },
  {
    id: "pro",
    name: "Pro Candidate",
    priceMonthly: 19,
    priceYearly: 190,
    description: "Complete portfolio optimization & line-by-line rewrites",
    popular: true,
    features: [
      "Unlimited CV analyses",
      "Line-by-line action verb bullet rewrites",
      "Full GitHub, LinkedIn, Tableau & Power BI connectors",
      "Vector-based semantic skill gap analytics",
      "Priority analysis execution (<5s)",
    ],
    stripePriceIdMonthly: process.env.STRIPE_PRO_PRICE_ID || "price_pro_monthly_mock",
    ctaText: "Upgrade to Pro",
  },
  {
    id: "enterprise",
    name: "Enterprise Recruiter",
    priceMonthly: 99,
    priceYearly: 990,
    description: "Multi-seat candidate pool evaluation for hiring teams",
    features: [
      "Includes everything in Pro",
      "Multi-seat team workspace (Up to 10 recruiters)",
      "Candidate candidate pool comparison matrix",
      "1-Click Executive PDF Scorecard exporter",
      "Custom job description vector indexing",
      "Dedicated API access & webhook integrations",
    ],
    stripePriceIdMonthly: process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_ent_monthly_mock",
    ctaText: "Start Enterprise Trial",
  },
];

export function getTier(tierId: string): PricingTier {
  return PRICING_TIERS.find((t) => t.id === tierId) || PRICING_TIERS[0];
}
