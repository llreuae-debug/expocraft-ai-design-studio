"use client";

import React, { useState } from "react";
import { InstallationPhaseItem, InstallationPhaseType } from "@/types/execution";
import { Clock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Calendar, Zap, Truck, Layers } from "lucide-react";

interface InstallationCalculatorProps {
  onTotalCostChange?: (cost: number) => void;
}

const DEFAULT_PHASES: InstallationPhaseItem[] = [
  {
    id: "inst-1",
    phase: "Fabrication",
    title: "1. Offsite Factory Joinery & CNC Production",
    durationHours: 48,
    crewCount: 6,
    estimatedCost: 6500,
    milestone: "Factory Quality Signoff & Crating",
    status: "COMPLETED",
    startDateOffsetHours: 0,
  },
  {
    id: "inst-2",
    phase: "Transport",
    title: "2. Freight Transport to Venue Marshalling Yard",
    durationHours: 6,
    crewCount: 2,
    estimatedCost: 1100,
    milestone: "Venue Marshalling Gate Pass",
    status: "COMPLETED",
    startDateOffsetHours: 48,
  },
  {
    id: "inst-3",
    phase: "Unloading",
    title: "3. Hall Unloading & Staging onto Stall Perimeter",
    durationHours: 4,
    crewCount: 4,
    estimatedCost: 600,
    milestone: "All Crates Cleared from Hall Aisles",
    status: "IN_PROGRESS",
    startDateOffsetHours: 54,
  },
  {
    id: "inst-4",
    phase: "Installation",
    title: "4. Raised Floor Platform & Primary Structural Walls",
    durationHours: 12,
    crewCount: 8,
    estimatedCost: 2800,
    milestone: "Skeleton & Subfloor Structural Handover",
    status: "PENDING",
    startDateOffsetHours: 58,
  },
  {
    id: "inst-5",
    phase: "Electrical setup",
    title: "5. Electrical DB Connection, Cable Trenches & Sockets",
    durationHours: 6,
    crewCount: 3,
    estimatedCost: 1400,
    milestone: "DEWA Main Feed Live & Certified",
    status: "PENDING",
    startDateOffsetHours: 70,
  },
  {
    id: "inst-6",
    phase: "Branding installation",
    title: "6. SEG Backlit Fabric Tension & 3D Acrylic Signage",
    durationHours: 6,
    crewCount: 4,
    estimatedCost: 950,
    milestone: "100% Wrinkle-Free Graphics Inspected",
    status: "PENDING",
    startDateOffsetHours: 76,
  },
  {
    id: "inst-7",
    phase: "AV installation",
    title: "7. P2.6 LED Video Wall Rigging & Screen Calibration",
    durationHours: 8,
    crewCount: 3,
    estimatedCost: 1850,
    milestone: "4K Video Loop Active & Pixel-Perfect",
    status: "PENDING",
    startDateOffsetHours: 82,
  },
  {
    id: "inst-8",
    phase: "Testing",
    title: "8. AV Load Test, Lighting Lux Tuning & Furniture Dressing",
    durationHours: 4,
    crewCount: 4,
    estimatedCost: 700,
    milestone: "Night Rehearsal & Lux Level Compliant",
    status: "PENDING",
    startDateOffsetHours: 90,
  },
  {
    id: "inst-9",
    phase: "Final inspection",
    title: "9. Venue Civil Defense Inspection & Client Handover",
    durationHours: 2,
    crewCount: 2,
    estimatedCost: 500,
    milestone: "Official Certificate of Build & Client Keys",
    status: "PENDING",
    startDateOffsetHours: 94,
  },
];

export const InstallationCalculator: React.FC<InstallationCalculatorProps> = ({ onTotalCostChange }) => {
  const [phases, setPhases] = useState<InstallationPhaseItem[]>(DEFAULT_PHASES);

  const totalInstallationHours = phases.reduce((acc, p) => acc + p.durationHours, 0);
  const totalInstallationCost = phases.reduce((acc, p) => acc + p.estimatedCost, 0);

  const handleUpdateCost = (index: number, cost: number) => {
    const updated = [...phases];
    updated[index].estimatedCost = cost;
    setPhases(updated);
    if (onTotalCostChange) {
      onTotalCostChange(updated.reduce((acc, p) => acc + p.estimatedCost, 0));
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              9-Phase Installation Engine & Automated Timeline
            </h3>
            <p className="text-xs text-slate-400">
              Complete turnkey build critical path from factory joinery to venue inspection handover.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
            {totalInstallationHours} Total Build Hours (4 Days Window)
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-sm">
            Total: ${totalInstallationCost.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Visual Gantt-Style Milestone Timeline */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
          Sequential Critical Path Schedule:
        </span>

        <div className="space-y-2.5">
          {phases.map((phase, idx) => (
            <div key={phase.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${phase.status === 'COMPLETED' ? 'bg-emerald-400' : phase.status === 'IN_PROGRESS' ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
                  {phase.title}
                </span>
                <span className="font-mono text-cyan-300 font-semibold">
                  {phase.durationHours}h • ${phase.estimatedCost.toLocaleString()}
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all ${
                    phase.status === 'COMPLETED'
                      ? 'bg-emerald-400 w-full'
                      : phase.status === 'IN_PROGRESS'
                      ? 'bg-amber-400 w-1/2'
                      : 'bg-cyan-500/30 w-1/4'
                  }`}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-500 italic">
                <span>Milestone: {phase.milestone}</span>
                <span>Crew: {phase.crewCount} specialists</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
