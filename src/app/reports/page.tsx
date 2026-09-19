"use client";

import React from "react";
import { useProjects } from "@/context/ProjectContext";
import { BarChart3, TrendingUp, DollarSign, PieChart, ArrowUpRight } from "lucide-react";

export default function ReportsPage() {
  const { projects } = useProjects();
  const totalValue = projects.reduce((acc, p) => acc + p.budget.targetBudgetMax, 0);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Commercial & Profitability Analytics
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold border border-cyan-500/30">
              Real-Time Financial Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Track margin realization, material cost variance, win rates, and client account revenues.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-semibold">Total Revenue Pipeline</span>
          <div className="text-2xl font-black text-amber-300 font-mono">${totalValue.toLocaleString()}</div>
          <p className="text-xs text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +24% YoY Growth
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-semibold">Average Target Margin</span>
          <div className="text-2xl font-black text-cyan-400 font-mono">28.4%</div>
          <p className="text-xs text-slate-400">Within executive benchmark of 25-30%</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 uppercase font-semibold">Quotation Win Rate</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">72.5%</div>
          <p className="text-xs text-emerald-400">+5.2% after AI 3D visualization rollout</p>
        </div>
      </div>
    </div>
  );
}
