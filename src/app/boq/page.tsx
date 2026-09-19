"use client";

import React, { useState } from "react";
import { useProjects } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { computeTechnicalTakeoff, generateInitial16CategoryBOQ } from "@/lib/takeoffEngine";
import { TechnicalSpecCard } from "@/components/boq/TechnicalSpecCard";
import { BOQTableEditor } from "@/components/boq/BOQTableEditor";
import { AiCostAssistant } from "@/components/boq/AiCostAssistant";
import { DetailedBOQLineItem } from "@/types/boq";
import { Calculator, FileSpreadsheet, Sparkles, TrendingUp, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BoqPage() {
  const { projects, updateProject } = useProjects();
  const { isClient } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");

  const project = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const takeoff = computeTechnicalTakeoff(project);
  const initialItems = generateInitial16CategoryBOQ(project);

  const [boqItems, setBoqItems] = useState<DetailedBOQLineItem[]>(initialItems);

  const handleUpdateBOQ = (newItems: DetailedBOQLineItem[]) => {
    setBoqItems(newItems);
  };

  const handleApplyAiMutation = (updatedItems: DetailedBOQLineItem[], summary: string) => {
    setBoqItems(updatedItems);
  };

  if (!project) return null;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Calculator className="w-5 h-5 text-cyan-400" />
              Technical Takeoff & 16-Category BOQ Engine
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold border border-cyan-500/30">
              Measurable Commercial Data
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-calculate physical specs from the 3D model, manage line-item costing across 16 categories, and apply AI value engineering.
          </p>
        </div>

        {/* Project Selector & Market Rates Link */}
        <div className="flex items-center gap-3">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:border-cyan-500 focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectCode} — {p.name}
              </option>
            ))}
          </select>

          <Link
            href="/market-rates"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Market Rates</span>
          </Link>
        </div>
      </div>

      {/* 1. Automated Geometric Takeoff Metrics */}
      <TechnicalSpecCard project={project} takeoff={takeoff} />

      {/* 2. AI Cost Assistant */}
      <AiCostAssistant items={boqItems} onApplyMutation={handleApplyAiMutation} />

      {/* 3. 16-Category Line Item BOQ Table */}
      <BOQTableEditor
        items={boqItems}
        currency={project.budget.currency}
        onUpdateItems={handleUpdateBOQ}
      />

    </div>
  );
}
