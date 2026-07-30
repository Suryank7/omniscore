"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brain,
  LayoutDashboard,
  FileUp,
  History,
  Briefcase,
  ChevronLeft,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";

const navItems = [
  { href: "/dashboard", label: "Hub", icon: LayoutDashboard },
  { href: "/dashboard/analyze", label: "Analyze CV", icon: FileUp },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: GithubIcon },
  { href: "/dashboard/team", label: "Team Workspace", icon: Briefcase },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/pricing", label: "Pricing & Plans", icon: Brain },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[var(--navy-800)]/50 backdrop-blur-xl flex flex-col shrink-0 fixed inset-y-0 left-0 z-30 lg:relative">
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight">
                Omni<span className="text-emerald-400">Score</span> AI
              </span>
              <p className="text-[10px] text-slate-500 -mt-0.5">Career Intelligence</p>
            </div>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/5">
          <Link href="/" className="sidebar-link text-xs">
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="mt-3 glass-card-static p-3">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold">Free Tier</span>
            </div>
            <p className="text-[10px] text-slate-500 mb-2">3 analyses remaining this month</p>
            <div className="h-1 bg-navy-600 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 min-h-screen">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
