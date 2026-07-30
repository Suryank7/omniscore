"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PRICING_TIERS } from "@/lib/stripe";
import { Check, Brain, ArrowRight, Shield, Zap, Sparkles, Loader2 } from "lucide-react";

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSubscribe = async (tierId: string) => {
    if (tierId === "free") {
      router.push("/dashboard");
      return;
    }

    setLoadingTier(tierId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Subscription error:", err);
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="gradient-bg min-h-screen relative overflow-hidden py-16 px-8">
      {/* Orbs */}
      <div className="orb orb-emerald" style={{ width: 350, height: 350, top: "5%", right: "10%" }} />
      <div className="orb orb-cyan" style={{ width: 300, height: 300, bottom: "10%", left: "5%" }} />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4" /> Transparent Enterprise SaaS Pricing
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            Unlock Full <span className="text-emerald-400">Career Intelligence</span>
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Choose the plan that fits your career goals or hiring team needs. Upgrade or cancel anytime.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center p-1 rounded-full bg-navy-800 border border-white/10 text-xs font-medium mt-4">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-full transition-all ${
                billingCycle === "monthly" ? "bg-emerald-500 text-white font-bold" : "text-slate-400"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly" ? "bg-emerald-500 text-white font-bold" : "text-slate-400"
              }`}
            >
              Yearly Billing
              <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded-full">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {PRICING_TIERS.map((tier) => {
            const price = billingCycle === "monthly" ? tier.priceMonthly : Math.round(tier.priceYearly / 12);

            return (
              <div
                key={tier.id}
                className={`glass-card-static p-8 flex flex-col justify-between relative transition-all ${
                  tier.popular ? "border-emerald-500/50 shadow-emerald-500/10 shadow-2xl" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                  <p className="text-xs text-slate-400 min-h-[32px] mb-6">{tier.description}</p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-white">${price}</span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>

                  <div className="space-y-3 mb-8">
                    {tier.features.map((f, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSubscribe(tier.id)}
                  disabled={loadingTier === tier.id}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    tier.popular ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  {loadingTier === tier.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {tier.ctaText} <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
