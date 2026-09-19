"use client";

import React from "react";
import { useProjects } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectDetailModal } from "@/components/projects/ProjectDetailModal";
import { STANDARD_SIZES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import {
  Sparkles,
  FolderKanban,
  DollarSign,
  Layers,
  ArrowUpRight,
  PlusCircle,
  TrendingUp,
  CheckCircle2,
  Clock,
  Box,
  FileSpreadsheet,
  Users,
  Compass,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { projects, openWizard, updateWizardDraft, setWizardStep, selectedProject, setSelectedProject } = useProjects();
  const { currentUser, isClient } = useAuth();

  const totalPipelineValue = projects.reduce((acc, p) => acc + p.budget.targetBudgetMax, 0);
  const activeBriefsCount = projects.filter((p) => p.status === "BRIEF_RECEIVED" || p.status === "AI_DESIGN_IN_PROGRESS").length;
  const designReadyCount = projects.filter((p) => p.status === "DESIGN_READY" || p.status === "BOQ_ESTIMATING").length;
  const approvedCount = projects.filter((p) => p.status === "APPROVED" || p.status === "IN_PRODUCTION").length;

  const handleLaunchPreset = (presetId: string) => {
    const preset = STANDARD_SIZES.find((s) => s.id === presetId);
    if (!preset) return;
    updateWizardDraft({
      width: preset.widthMeters,
      depth: preset.depthMeters,
      height: preset.heightMeters,
      unit: "METERS",
    });
    setWizardStep(3);
    openWizard();
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Hero Welcome & Quick Action Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient opacity-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[11px] font-mono font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> AI Exhibition Architecture Engine
              </span>
              <span className="text-xs text-slate-400">Logged in as {currentUser.role.replace('_', ' ')}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">ExpoCraft</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Design. Estimate. Build. Streamline your entire exhibition lifecycle from initial client brief and instant AI 3D design to dynamic BOQ, market rate benchmarks, and client-ready quotations.
            </p>
          </div>

          {!isClient && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={openWizard}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all transform active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Stall Brief</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pipeline</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">
            {formatCurrency(totalPipelineValue, "USD")}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">+18.4%</span>
            <span>vs previous month</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Projects</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">{projects.length}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>{activeBriefsCount} in discovery & AI generation</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Design & BOQ Ready</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-cyan-300 font-mono">{designReadyCount}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Ready for client commercial review</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Approved & In Build</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{approvedCount}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Turnkey onsite execution active</span>
          </div>
        </div>

      </div>

      {/* Quick Standard Stall Presets Bar */}
      {!isClient && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white tracking-wide">Quick Preset Stall Launchers</h2>
            </div>
            <span className="text-[11px] text-slate-400">Click to instantly populate wizard dimensions</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {STANDARD_SIZES.filter(s => s.id !== "custom").map((size) => (
              <button
                key={size.id}
                onClick={() => handleLaunchPreset(size.id)}
                className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {size.labelMeters}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">({size.labelFeet})</div>
                </div>
                <div className="mt-2 text-[10px] text-cyan-400 font-mono font-medium flex items-center justify-between">
                  <span>{size.tag}</span>
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Connected Architecture 7-Step Workflow Pipeline Diagram */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              ExpoCraft End-to-End Workflow Architecture
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Every project acts as the single source of truth across all 7 stages:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { step: "1", title: "Brief Wizard", desc: "Client & stall spec capture with metric/imperial toggle", icon: PlusCircle, href: "/projects" },
            { step: "2", title: "AI 3D Design", desc: "Photorealistic concept renders & multi-angle views", icon: Sparkles, href: "/ai-designer" },
            { step: "3", title: "Technical Spec", desc: "Structural dimensions, open sides & spatial zones", icon: Compass, href: "/studio" },
            { step: "4", title: "Auto BOQ", desc: "Itemized material & labour calculations", icon: FileSpreadsheet, href: "/boq" },
            { step: "5", title: "Market Rates", desc: "Live regional benchmarks across Dubai, US & Europe", icon: TrendingUp, href: "/market-rates" },
            { step: "6", title: "Quotation PDF", desc: "Commercial margin tuning & client export", icon: DollarSign, href: "/quotations" },
            { step: "7", title: "Client Signoff", desc: "Direct client portal review & digital acceptance", icon: CheckCircle2, href: "/projects" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.step}
                href={item.href}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold flex items-center justify-center border border-cyan-500/30">
                      {item.step}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-xs font-bold text-white group-hover:text-cyan-300">{item.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-cyan-400" />
              Recent Exhibition Projects
            </h2>
            <p className="text-xs text-slate-400">Live projects across major international venues</p>
          </div>

          <Link
            href="/projects"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
          >
            <span>View All Projects</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onSelect={(p) => setSelectedProject(p)}
            />
          ))}
        </div>
      </div>

      {/* Selected Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

    </div>
  );
}
