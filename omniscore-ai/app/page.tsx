"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  FileSearch,
  Target,
  Zap,
  Shield,
  ChevronRight,
  Sparkles,
  BarChart3,
  Code2,
  Lightbulb,
  ArrowRight,
  Star,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";

export default function LandingPage() {
  const router = useRouter();
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const targetScore = 87;
    const duration = 2000;
    const steps = 60;
    const increment = targetScore / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setAnimatedScore(targetScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="gradient-bg min-h-screen relative overflow-hidden">
      {/* Background Orbs */}
      <div className="orb orb-emerald" style={{ width: 400, height: 400, top: "10%", right: "-5%" }} />
      <div className="orb orb-purple" style={{ width: 300, height: 300, bottom: "20%", left: "-3%" }} />
      <div className="orb orb-cyan" style={{ width: 250, height: 250, top: "60%", right: "30%" }} />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Omni<span className="text-emerald-400">Score</span> AI
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-slate-300 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-slate-300 hover:text-white transition-colors">How It Works</a>
          <a href="#scoring" className="text-sm text-slate-300 hover:text-white transition-colors">Scoring</a>
          <button onClick={() => router.push("/dashboard")} className="btn-primary text-sm py-2 px-5">
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Career Intelligence
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Stop Guessing.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Start Scoring.
              </span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-lg">
              OmniScore AI evaluates your CV, GitHub repos, and data portfolios using
              explainable AI. Get a transparent 0-100 score, discover skill gaps, and
              receive line-by-line optimization suggestions.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <button
                onClick={() => router.push("/dashboard/analyze")}
                className="btn-primary flex items-center gap-2 text-base py-3.5 px-8"
              >
                Analyze Your CV <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="btn-secondary flex items-center gap-2 text-base py-3 px-7"
              >
                Explore Dashboard
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                PII-Safe Processing
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                &lt;15s Analysis
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-400" />
                Explainable Scoring
              </div>
            </div>
          </div>

          {/* Right — Score Preview Card */}
          <div className="animate-slide-in hidden lg:block">
            <div className="glass-card-static p-8 relative">
              {/* Score Ring */}
              <div className="flex items-center gap-8 mb-8">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 score-ring" viewBox="0 0 100 100">
                    <circle
                      cx="50" cy="50" r="45"
                      stroke="rgba(74,111,165,0.15)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="50" cy="50" r="45"
                      stroke="url(#scoreGradient)"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * animatedScore) / 100}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-emerald-400">{animatedScore}</span>
                    <span className="text-xs text-slate-400">/ 100</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Excellent</h3>
                  <p className="text-sm text-slate-400 mb-3">Grade: A</p>
                  <div className="flex gap-2">
                    <span className="skill-badge skill-badge-matched text-xs">React</span>
                    <span className="skill-badge skill-badge-matched text-xs">Python</span>
                    <span className="skill-badge skill-badge-missing text-xs">K8s</span>
                  </div>
                </div>
              </div>

              {/* Mini Pillar Scores */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "ATS Score", score: 92, color: "emerald" },
                  { label: "Skill Match", score: 78, color: "cyan" },
                  { label: "Proof of Work", score: 85, color: "purple" },
                  { label: "Impact", score: 71, color: "amber" },
                ].map((pillar) => (
                  <div key={pillar.label} className="bg-navy-700/40 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">{pillar.label}</span>
                      <span className={`text-sm font-bold text-${pillar.color}-400`} style={{
                        color: pillar.color === "emerald" ? "#34D399" :
                               pillar.color === "cyan" ? "#22D3EE" :
                               pillar.color === "purple" ? "#A78BFA" : "#FBBF24"
                      }}>
                        {pillar.score}
                      </span>
                    </div>
                    <div className="h-1.5 bg-navy-600 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${pillar.score}%`,
                          background: pillar.color === "emerald" ? "#10B981" :
                                     pillar.color === "cyan" ? "#06B6D4" :
                                     pillar.color === "purple" ? "#8B5CF6" : "#F59E0B"
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative glow */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500 rounded-full filter blur-[60px] opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Multi-Modal <span className="text-emerald-400">Career Intelligence</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            OmniScore AI goes beyond keyword matching. We analyze your code, evaluate your data visualizations,
            and cross-reference claimed skills with demonstrated proof-of-work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {[
            {
              icon: FileSearch,
              title: "Universal CV Parser",
              description: "Ingests PDF, DOCX, and plain text. Extracts skills, experience, and education with 95%+ accuracy.",
              color: "#10B981",
            },
            {
              icon: Target,
              title: "Skill Gap Analysis",
              description: "Vector-based semantic matching against job descriptions. Identifies exact, partial, and missing skills.",
              color: "#06B6D4",
            },
            {
              icon: Brain,
              title: "Explainable Scoring",
              description: "Transparent 0-100 score broken into 4 pillars: ATS, Skill Match, Proof of Work, and Impact.",
              color: "#8B5CF6",
            },
            {
              icon: GithubIcon,
              title: "GitHub Portfolio Analysis",
              description: "Analyzes repositories, commit patterns, language diversity, and code quality for proof-of-work scoring.",
              color: "#F59E0B",
            },
            {
              icon: Lightbulb,
              title: "Optimization Suggestions",
              description: "Line-by-line bullet point rewrites, ATS keyword recommendations, and role-specific tailoring tips.",
              color: "#EF4444",
            },
            {
              icon: BarChart3,
              title: "Interactive Dashboard",
              description: "Radar charts, skill matrices, and score breakdowns presented in a stunning enterprise UI.",
              color: "#EC4899",
            },
          ].map((feature) => (
            <div key={feature.title} className="glass-card p-6 group">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${feature.color}15`, border: `1px solid ${feature.color}30` }}
              >
                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            How <span className="text-cyan-400">It Works</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Three simple steps to transform your professional profile.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Upload Your CV",
              description: "Drag and drop your PDF or DOCX resume, or paste the text directly. Optionally connect your GitHub.",
              icon: FileSearch,
              color: "#10B981",
            },
            {
              step: "02",
              title: "AI Analyzes Everything",
              description: "Our NLP engine parses your resume, matches skills against job descriptions, and evaluates your portfolio.",
              icon: Code2,
              color: "#06B6D4",
            },
            {
              step: "03",
              title: "Get Actionable Results",
              description: "Receive your OmniScore, skill gap analysis, and line-by-line optimization suggestions instantly.",
              icon: Sparkles,
              color: "#8B5CF6",
            },
          ].map((item, idx) => (
            <div key={item.step} className="relative group">
              <div className="glass-card p-8 text-center relative z-10">
                <span
                  className="text-6xl font-black opacity-10 absolute top-4 right-6"
                  style={{ color: item.color }}
                >
                  {item.step}
                </span>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}
                >
                  <item.icon className="w-8 h-8" style={{ color: item.color }} />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </div>
              {idx < 2 && (
                <div className="hidden md:flex absolute top-1/2 -right-4 z-20">
                  <ChevronRight className="w-8 h-8 text-slate-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Scoring Formula Section */}
      <section id="scoring" className="relative z-10 max-w-5xl mx-auto px-8 py-20">
        <div className="glass-card-static p-10">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Transparent <span className="text-emerald-400">Scoring Formula</span>
          </h2>
          <p className="text-slate-400 text-center mb-8 text-sm">
            No black boxes. Every point is explainable.
          </p>

          {/* Formula Display */}
          <div className="bg-navy-800/50 rounded-xl p-6 mb-8 text-center font-mono">
            <span className="text-emerald-400 text-lg">OmniScore</span>
            <span className="text-slate-400 text-lg"> = </span>
            <span className="text-cyan-400">(ATS × 0.20)</span>
            <span className="text-slate-500"> + </span>
            <span className="text-purple-400">(SkillMatch × 0.40)</span>
            <span className="text-slate-500"> + </span>
            <span className="text-amber-400">(ProofOfWork × 0.25)</span>
            <span className="text-slate-500"> + </span>
            <span className="text-pink-400">(Impact × 0.15)</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "ATS Compatibility", weight: "20%", desc: "Formatting, sections, contact info, readability", color: "#06B6D4" },
              { label: "Skill Match", weight: "40%", desc: "Cosine similarity of skills vs. job requirements", color: "#8B5CF6" },
              { label: "Proof of Work", weight: "25%", desc: "GitHub repos, commits, projects, certifications", color: "#F59E0B" },
              { label: "Impact", weight: "15%", desc: "Action verbs, quantified achievements, bullet quality", color: "#EC4899" },
            ].map((item) => (
              <div key={item.label} className="bg-navy-700/40 rounded-lg p-4 text-center">
                <div className="text-2xl font-black mb-1" style={{ color: item.color }}>{item.weight}</div>
                <div className="text-sm font-semibold mb-1">{item.label}</div>
                <div className="text-xs text-slate-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to <span className="text-emerald-400">Optimize</span> Your Profile?
        </h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          Upload your resume and get your OmniScore in under 15 seconds.
          No sign-up required.
        </p>
        <button
          onClick={() => router.push("/dashboard/analyze")}
          className="btn-primary text-lg py-4 px-10 inline-flex items-center gap-3"
        >
          <Brain className="w-5 h-5" />
          Start Free Analysis
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-navy-700 py-8 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold">OmniScore AI</span>
          </div>
          <p className="text-xs text-slate-500">
            Built with Next.js, NLP, and Explainable AI. © {new Date().getFullYear()} OmniScore AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
