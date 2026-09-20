"use client";

import React from "react";
import { Project, ProjectStatus } from "@/types";
import { formatCurrency, formatDimension } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Maximize2,
  Layers,
  Sparkles,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
} from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  BRIEF_RECEIVED: {
    label: "Brief Received",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
    icon: Clock,
  },
  AI_DESIGN_IN_PROGRESS: {
    label: "AI Generating 3D",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/30",
    icon: Sparkles,
  },
  DESIGN_READY: {
    label: "Design Ready",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/30",
    icon: CheckCircle2,
  },
  BOQ_ESTIMATING: {
    label: "BOQ Estimating",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
    icon: FileSpreadsheet,
  },
  QUOTATION_GENERATED: {
    label: "Quote Generated",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    icon: DollarSign,
  },
  SENT_TO_CLIENT: {
    label: "Sent to Client",
    color: "text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/30",
    icon: ArrowRight,
  },
  APPROVED: {
    label: "Client Approved",
    color: "text-emerald-300",
    bg: "bg-emerald-500/20 border-emerald-500/50",
    icon: ShieldCheck,
  },
  REJECTED: {
    label: "Revision Requested",
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/30",
    icon: Clock,
  },
  IN_PRODUCTION: {
    label: "In Fabrication",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/30",
    icon: Layers,
  },
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const statusInfo = STATUS_CONFIG[project.status] || STATUS_CONFIG.BRIEF_RECEIVED;
  const StatusIcon = statusInfo.icon;
  const primaryConcept = project.designConcepts[0];

  return (
    <div
      onClick={() => onSelect(project)}
      className="group relative rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-cyan-500/50 p-5 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Card Header: Code & Status */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
        <span className="font-mono text-[11px] font-bold text-cyan-400 px-2 py-0.5 rounded-lg bg-cyan-950/60 border border-cyan-800/60">
          {project.projectCode}
        </span>

        <div
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusInfo.bg} ${statusInfo.color}`}
        >
          <StatusIcon className="w-3 h-3" />
          <span>{statusInfo.label}</span>
        </div>
      </div>

      {/* Project Title & Client */}
      <div className="relative z-10 mb-4">
        <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
          {project.name}
        </h3>
        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
          <span className="font-semibold text-slate-300">{project.client.companyName}</span>
          <span>•</span>
          <span className="text-[11px] text-slate-500">{project.brief.industry}</span>
        </p>
      </div>

      {/* Optional Concept Render Thumbnail Preview */}
      {primaryConcept ? (
        <div className="relative z-10 mb-4 h-28 w-full rounded-xl overflow-hidden border border-slate-800">
          <img
            src={primaryConcept.thumbnailUrl}
            alt={primaryConcept.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[10px] text-cyan-300 font-mono">
            {primaryConcept.title}
          </div>
        </div>
      ) : (
        <div className="relative z-10 mb-4 h-20 w-full rounded-xl bg-slate-950/60 border border-dashed border-slate-800 flex items-center justify-center text-slate-500 text-xs">
          <Sparkles className="w-4 h-4 mr-2 text-cyan-400 animate-pulse" />
          Ready for AI 3D Concept Generation
        </div>
      )}

      {/* Meta Specs Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono">
            {project.dimensions.width}×{project.dimensions.depth} {project.dimensions.unit === "METERS" ? "m" : "ft"} ({project.dimensions.totalAreaSqm} m²)
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-rose-400" />
          <span className="truncate">{project.exhibition.city}, {project.exhibition.country}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span className="truncate">{project.exhibition.exhibitionName}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-300 font-mono">
          <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-300 font-semibold">
            {formatCurrency(project.budget.targetBudgetMax, project.budget.currency)}
          </span>
        </div>
      </div>

      {/* Card Footer: Progress & Open Sides */}
      <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400 font-mono">
          {project.dimensions.openSides.replace(/_/g, " ")}
        </span>

        <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>Open Studio & Renders</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
