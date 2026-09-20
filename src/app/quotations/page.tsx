"use client";

import React, { useState } from "react";
import { useProjects } from "@/context/ProjectContext";
import { MasterQuotationBuilder } from "@/components/quotations/MasterQuotationBuilder";
import { FileSpreadsheet, PlusCircle, CheckCircle2, Building2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function QuotationsPage() {
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "");

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  if (!currentProject) return null;

  return (
    <div className="space-y-6">
      {/* Top Project Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Active Stall Proposal</span>
            <span className="text-xs font-bold text-white">{currentProject.client.companyName} — {currentProject.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:border-cyan-500 focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectCode} — {p.client.companyName} ({p.name})
              </option>
            ))}
          </select>

          <Link
            href="/ai-designer"
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Studio</span>
          </Link>
        </div>
      </div>

      <MasterQuotationBuilder project={currentProject} />
    </div>
  );
}
