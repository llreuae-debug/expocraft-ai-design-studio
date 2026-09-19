"use client";

import React from "react";
import { Project } from "@/types";
import { generateInitial16CategoryBOQ, computeTechnicalTakeoff } from "@/lib/takeoffEngine";
import { X, FileSpreadsheet, Download, FileText, Image as ImageIcon, CheckCircle2, Printer } from "lucide-react";

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  if (!isOpen) return null;

  const handleExportCSV = () => {
    const items = generateInitial16CategoryBOQ(project);
    const headers = ["Category", "Code", "Description", "Qty", "Unit", "Material", "Unit Rate", "Labour", "Total Cost", "Client Rate", "Total Client Price"];
    const rows = items.map((i) => [
      i.category,
      i.itemCode,
      `"${i.description.replace(/"/g, '""')}"`,
      i.quantity,
      i.unit,
      `"${i.material.replace(/"/g, '""')}"`,
      i.unitRate,
      i.labourCost,
      i.totalCost,
      i.clientRate,
      i.totalClientPrice,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${project.projectCode}_16Category_BOQ.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSpecJSON = () => {
    const takeoff = computeTechnicalTakeoff(project);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ project, takeoff }, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `${project.projectCode}_Technical_Takeoff_Spec.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Export Commercial Documents</h3>
              <p className="text-xs text-slate-400">{project.projectCode} • {project.name}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* 1. Print Multi-Page Master PDF Proposal */}
          <button
            onClick={() => {
              onClose();
              window.print();
            }}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">Master Quotation Proposal (10-Page PDF)</h4>
                <p className="text-[11px] text-slate-400">Complete tender report with 3D concepts, specs, BOQ & terms</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-semibold">PDF Quote</span>
          </button>

          {/* 2. PDF BOQ standalone */}
          <button
            onClick={() => {
              onClose();
              window.print();
            }}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">Itemized 16-Category BOQ (PDF Format)</h4>
                <p className="text-[11px] text-slate-400">Commercial bill of quantities print layout</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-semibold">PDF BOQ</span>
          </button>

          {/* 3. Excel / CSV BOQ */}
          <button
            onClick={handleExportCSV}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">Itemized 16-Category BOQ (Excel / CSV)</h4>
                <p className="text-[11px] text-slate-400">Export line-item material, labour rates, and markup calculations</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">Excel/CSV</span>
          </button>

          {/* 4. PNG/JPG 3D Renders Package */}
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = project.designConcepts[0]?.thumbnailUrl || "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop&q=80";
              link.download = `${project.projectCode}_3D_Render_Pack.jpg`;
              link.target = "_blank";
              link.click();
            }}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">4K PNG/JPG 3D Renders Export</h4>
                <p className="text-[11px] text-slate-400">High-resolution architectural visuals and elevation perspectives</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-purple-400 font-semibold">PNG/JPG</span>
          </button>

          {/* 5. Technical Spec Takeoff JSON */}
          <button
            onClick={handleExportSpecJSON}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">Technical Takeoff Specification Export</h4>
                <p className="text-[11px] text-slate-400">Structural quantities, electrical load kW, and dimensional data</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-blue-400 font-semibold">JSON/Spec</span>
          </button>
        </div>

      </div>
    </div>
  );
};
