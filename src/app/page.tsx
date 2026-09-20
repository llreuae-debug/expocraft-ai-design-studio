"use client";

import React, { useState } from "react";
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
  Wand2,
  ArrowRight,
  ShieldCheck,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { projects, openWizard, updateWizardDraft, setWizardStep, selectedProject, setSelectedProject } = useProjects();
  const { currentUser, isClient } = useAuth();

  const [quickPrompt, setQuickPrompt] = useState("");
  const [selectedSize, setSelectedSize] = useState<string>("6×6m");
  const [selectedStyle, setSelectedStyle] = useState<string>("Futuristic High-Tech LED");

  const totalPipelineValue = projects.reduce((acc, p) => acc + (p.budget?.targetBudgetMax || 0), 0);
  const activeBriefsCount = projects.filter((p) => p.status === "BRIEF_RECEIVED" || p.status === "AI_DESIGN_IN_PROGRESS").length;
  const designReadyCount = projects.filter((p) => p.status === "DESIGN_READY").length;
  const approvedCount = projects.filter((p) => p.status === "APPROVED" || p.status === "IN_PRODUCTION").length;

  const handleLaunchAiStudio = (promptOverride?: string) => {
    router.push("/ai-designer");
  };

  const handleQuickPreset = (label: string, w: number, d: number) => {
    setSelectedSize(label);
    updateWizardDraft({
      width: w,
      depth: d,
      height: 4,
      unit: "METERS",
    });
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Welcome & Instant AI Generator Launcher */}
      <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-[11px] font-mono font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Exhibition Design Studio
                </span>
                <span className="text-xs text-slate-400 font-medium">Auto-8K Photorealistic Pipeline</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Design & Present Exhibition Stalls in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">Minutes</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Describe your booth or select dimensions to generate 4 synchronized 3D perspectives, refined materials, 8K final presentation renders, and instant client quotation packages.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <Link
                href="/ai-designer"
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xl shadow-cyan-500/25 transition-all transform active:scale-95"
              >
                <Wand2 className="w-4 h-4" />
                <span>Open AI Studio</span>
              </Link>
            </div>
          </div>

          {/* Quick AI Design Launcher Box */}
          <div className="p-4 md:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder="Describe your exhibition stall (e.g., '6x6m Luxury gold & gloss white stand with curved LED wall, VIP lounge and reception desk')..."
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all font-medium"
                />
              </div>
              <button
                onClick={() => handleLaunchAiStudio(quickPrompt)}
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all flex-shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate 3D Stall</span>
              </button>
            </div>

            {/* Quick Size Selectors */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-900 text-xs">
              <span className="text-slate-400 font-mono text-[11px] mr-1">Quick Sizes:</span>
              {[
                { label: "3×3m", w: 3, d: 3 },
                { label: "3×6m", w: 6, d: 3 },
                { label: "6×6m", w: 6, d: 6 },
                { label: "6×9m", w: 9, d: 6 },
                { label: "9×9m", w: 9, d: 9 },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleQuickPreset(s.label, s.w, s.d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedSize === s.label
                      ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                      : "bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {s.label} ({s.w * s.d}m²)
                </button>
              ))}

              <span className="text-slate-400 font-mono text-[11px] ml-auto hidden lg:inline">
                ✨ Powered by Google Imagen 3 & Gemini Vision
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Stalls</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">{projects.length}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>{activeBriefsCount} in AI generation & design</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">3D Presentation Ready</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-cyan-300 font-mono">{designReadyCount}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Ready for client quotation</span>
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
            <span>Turnkey fabrication active</span>
          </div>
        </div>

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

      </div>

      {/* Clean 5-Step Visual Workflow */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Easy 5-Step Stall Workflow
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              From initial idea to approved 8K visual presentation and client contract:
            </p>
          </div>
          <Link
            href="/ai-designer"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Start Workflow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { step: "1", title: "AI Chat Brief", desc: "Type your ideas or select standard dimensions", icon: Wand2, href: "/ai-designer" },
            { step: "2", title: "4 Synchronized Concepts", desc: "Front, corner, interior and detail perspectives", icon: Sparkles, href: "/ai-designer" },
            { step: "3", title: "Refine & 3D Inspect", desc: "Customize materials, lighting and layout", icon: Box, href: "/studio" },
            { step: "4", title: "8K Presentation Render", desc: "Ultra-HD photorealistic presentation renders", icon: CheckCircle2, href: "/ai-designer" },
            { step: "5", title: "Instant Quote & Sign-off", desc: "One-click quotation PDF and client portal approval", icon: FileSpreadsheet, href: "/quotations" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.step}
                href={item.href}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center border border-cyan-500/30">
                      {item.step}
                    </span>
                    <Icon className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-xs font-bold text-white group-hover:text-cyan-300">{item.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Exhibition Projects Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-cyan-400" />
              Exhibition Projects Gallery
            </h2>
            <p className="text-xs text-slate-400">Manage client stalls, 3D models, 8K renders and proposals</p>
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
