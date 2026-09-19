"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/context/ProjectContext";
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Box,
  Calculator,
  FileSpreadsheet,
  Users,
  TrendingUp,
  Boxes,
  Hammer,
  Layers,
  BarChart3,
  Settings,
  PlusCircle,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  clientVisible?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, clientVisible: true },
  { name: "Projects", href: "/projects", icon: FolderKanban, clientVisible: true },
  { name: "AI Designer", href: "/ai-designer", icon: Sparkles, badge: "AI Gen" },
  { name: "3D Studio", href: "/studio", icon: Box, badge: "WebGL", clientVisible: true },
  { name: "BOQ", href: "/boq", icon: Calculator },
  { name: "Quotations", href: "/quotations", icon: FileSpreadsheet, clientVisible: true },
  { name: "Client Portal", href: "/client-portal", icon: ShieldCheck, clientVisible: true, badge: "Live" },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Market Rates", href: "/market-rates", icon: TrendingUp },
  { name: "Materials", href: "/materials", icon: Boxes },
  { name: "Labour Rates", href: "/labour-rates", icon: Hammer },
  { name: "Asset Library", href: "/asset-library", icon: Layers },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, isClient } = useAuth();
  const { openWizard } = useProjects();

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col bg-slate-950 border-r border-slate-800/80 text-slate-300 select-none">
      
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 bg-slate-950/90">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Box className="w-5 h-5 font-black" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-base font-black tracking-tight text-white font-display">ExpoCraft</span>
              <span className="text-[10px] font-bold px-1 rounded bg-cyan-500/20 text-cyan-400 font-mono">v1.0</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Design. Estimate. Build.</p>
          </div>
        </Link>
      </div>

      {/* Quick Action Button */}
      {!isClient && (
        <div className="p-3.5 pb-2">
          <button
            onClick={openWizard}
            className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all transform active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Stall Brief</span>
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 custom-scrollbar">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Platform
        </div>

        {NAV_ITEMS.map((item) => {
          if (isClient && !item.clientVisible) return null;

          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md font-semibold ${
                    isActive
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Workflow Step Pipeline Guide */}
      <div className="p-3 mx-3 mb-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-[11px] space-y-1.5">
        <div className="flex items-center justify-between text-slate-400 font-semibold text-[10px] uppercase">
          <span>Connected Pipeline</span>
          <span className="text-cyan-400 font-mono">7 Stages</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          Brief → AI 3D → Specs → BOQ → Rates → Quote PDF → Client Signoff
        </p>
      </div>

      {/* User Mini Profile */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5 truncate">
          <img
            src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={currentUser.name}
            className="w-8 h-8 rounded-lg object-cover border border-slate-700"
          />
          <div className="truncate">
            <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-mono text-cyan-400 truncate">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
};
