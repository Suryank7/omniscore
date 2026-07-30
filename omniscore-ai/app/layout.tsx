import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OmniScore AI — Intelligent CV & Portfolio Analyzer",
  description:
    "AI-powered resume analyzer that evaluates professional profiles across CVs, GitHub, and data portfolios. Get transparent scoring, skill gap analysis, and real-time optimization suggestions.",
  keywords: [
    "CV analyzer", "resume scorer", "ATS optimization", "skill gap analysis",
    "AI resume review", "GitHub portfolio analysis", "career optimization",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased" style={{ fontFamily: "var(--font-inter)" }}>
        {children}
      </body>
    </html>
  );
}
