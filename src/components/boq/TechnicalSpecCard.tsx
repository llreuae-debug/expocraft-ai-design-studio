"use client";

import React from "react";
import { TechnicalTakeoffSpec } from "@/types/boq";
import { Project } from "@/types";
import {
  Layers,
  Maximize2,
  Tv,
  Zap,
  Box,
  Sun,
  Shield,
  Palette,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";

interface TechnicalSpecCardProps {
  project: Project;
  takeoff: TechnicalTakeoffSpec;
}

export const TechnicalSpecCard: React.FC<TechnicalSpecCardProps> = ({ project, takeoff }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-cyan-400" />
            Automated 3D Geometric Takeoff
          </h2>
          <p className="text-xs text-slate-400">
            Real-time physical quantities calculated from the {project.dimensions.width}×{project.dimensions.depth}m ({project.dimensions.openSides.replace(/_/g, " ")}) 3D architectural model.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
          Auto-Synchronized
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Floor Area */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Gross Floor Area</span>
          <div className="text-base font-bold text-white font-mono">{takeoff.floorAreaSqm} m²</div>
          <span className="text-[10px] text-cyan-400 font-mono block">({takeoff.floorAreaSqft} sq ft)</span>
        </div>

        {/* 2. Wall Surface */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Wall Elevation Area</span>
          <div className="text-base font-bold text-white font-mono">{takeoff.wallAreaSqm} m²</div>
          <span className="text-[10px] text-cyan-400 font-mono block">({takeoff.wallAreaSqft} sq ft)</span>
        </div>

        {/* 3. Branding & SEG Fabric */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Branding & SEG Print</span>
          <div className="text-base font-bold text-emerald-400 font-mono">{takeoff.brandingAreaSqm} m²</div>
          <span className="text-[10px] text-slate-400 font-mono block">({takeoff.brandingAreaSqft} sq ft)</span>
        </div>

        {/* 4. Electrical Power */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Electrical Load</span>
          <div className="text-base font-bold text-amber-300 font-mono">{takeoff.electricalTotalKw} kW</div>
          <span className="text-[10px] text-slate-400 font-mono block">{takeoff.electricalPointsCount} DB Socket Points</span>
        </div>

        {/* 5. AV & LED Screen */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">P2.6 LED Video Wall</span>
          <div className="text-base font-bold text-cyan-300 font-mono">{takeoff.avScreenAreaSqm || 12} m²</div>
          <span className="text-[10px] text-slate-400 font-mono block">4K Processor Array</span>
        </div>

        {/* 6. Lighting Fixtures */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Lighting Luminaires</span>
          <div className="text-base font-bold text-white font-mono">{takeoff.lightingFixturesCount} Spotlights</div>
          <span className="text-[10px] text-slate-400 font-mono block">{takeoff.lightingLinearMeters}m Linear Strip</span>
        </div>
      </div>
    </div>
  );
};
