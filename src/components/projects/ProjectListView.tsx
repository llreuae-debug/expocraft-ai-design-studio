"use client";

import React, { useState } from "react";
import { useProjects } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { Project, ProjectStatus } from "@/types";
import {
  FolderKanban,
  Grid,
  List,
  PlusCircle,
  Search,
  Filter,
  Layers,
  Sparkles,
  Maximize2,
  Calendar,
  Building2,
} from "lucide-react";

export const ProjectListView: React.FC = () => {
  const { filteredProjects, statusFilter, setStatusFilter, openWizard, selectedProject, setSelectedProject } = useProjects();
  const { isClient } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const statusOptions: { value: string; label: string }[] = [
    { value: "ALL", label: "All Projects" },
    { value: "BRIEF_RECEIVED", label: "Brief Received" },
    { value: "AI_DESIGN_IN_PROGRESS", label: "AI 3D Generating" },
    { value: "DESIGN_READY", label: "3D Design Ready" },
    { value: "QUOTATION_GENERATED", label: "Quote Ready" },
    { value: "APPROVED", label: "Client Approved" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Exhibition Projects Gallery</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold border border-cyan-500/30">
              {filteredProjects.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your exhibition stall projects, 3D concepts, 8K presentation renders, and commercial proposals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "grid" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "table" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {!isClient && (
            <button
              onClick={openWizard}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Project Brief</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              statusFilter === opt.value
                ? "bg-cyan-500/15 border border-cyan-400 text-cyan-300 font-semibold"
                : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-4">
          <FolderKanban className="w-12 h-12 mx-auto text-slate-600" />
          <div>
            <h3 className="text-sm font-bold text-white">No projects found</h3>
            <p className="text-xs text-slate-500 mt-1">Try changing your search terms or status filter, or start a new project brief.</p>
          </div>
          {!isClient && (
            <button
              onClick={openWizard}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              <PlusCircle className="w-4 h-4" /> Launch Project Creation Wizard
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onSelect={(p) => setSelectedProject(p)}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60 shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="p-4">Code & Name</th>
                <th className="p-4">Client & Industry</th>
                <th className="p-4">Exhibition & City</th>
                <th className="p-4">Dimensions</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProjects.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="p-4">
                    <span className="font-mono text-[10px] text-cyan-400 block font-bold">{p.projectCode}</span>
                    <span className="font-bold text-white text-xs">{p.name}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-slate-200 block">{p.client.companyName}</span>
                    <span className="text-[11px] text-slate-500">{p.brief.industry}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-white block font-medium">{p.exhibition.exhibitionName}</span>
                    <span className="text-[11px] text-rose-400">{p.exhibition.city}, {p.exhibition.country}</span>
                  </td>
                  <td className="p-4 font-mono text-cyan-300">
                    {p.dimensions.width}×{p.dimensions.depth} {p.dimensions.unit === "METERS" ? "m" : "ft"} ({p.dimensions.totalAreaSqm} m²)
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[10px] font-semibold text-cyan-300 border border-slate-700">
                      {p.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-right text-amber-300">
                    ${p.budget.targetBudgetMax.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

    </div>
  );
};
