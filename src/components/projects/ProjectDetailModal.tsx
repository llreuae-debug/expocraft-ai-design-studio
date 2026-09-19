"use client";

import React, { useState } from "react";
import { Project, ProjectStatus } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/context/ProjectContext";
import { formatCurrency, formatDimension } from "@/lib/utils";
import { LiveFootprintCanvas } from "../wizard/LiveFootprintCanvas";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileSpreadsheet,
  Layers,
  MapPin,
  Maximize2,
  Palette,
  Printer,
  Share2,
  ShieldCheck,
  Sparkles,
  User,
  X,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const { isClient, currentUser } = useAuth();
  const { updateProject } = useProjects();
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "designs" | "boq" | "quotation" | "logs">("overview");

  const handleStatusChange = (newStatus: ProjectStatus) => {
    updateProject(project.id, { status: newStatus });
  };

  const tabs = [
    { id: "overview", label: "Project Overview", icon: Building2 },
    { id: "specs", label: "Technical Specs & 2D Footprint", icon: Maximize2 },
    { id: "designs", label: `AI 3D Concepts (${project.designConcepts.length})`, icon: Sparkles },
    { id: "boq", label: `BOQ (${project.boqItems.length} items)`, icon: FileSpreadsheet },
    { id: "quotation", label: `Quotations (${project.quotations.length})`, icon: DollarSign },
    { id: "logs", label: "Audit Timeline", icon: Clock },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-cyan-400 px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800">
              {project.projectCode}
            </span>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                {project.name}
              </h2>
              <p className="text-xs text-slate-400">
                {project.client.companyName} • {project.exhibition.exhibitionName} ({project.exhibition.city})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Change Selector */}
            {!isClient && (
              <select
                value={project.status}
                onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="BRIEF_RECEIVED">Brief Received</option>
                <option value="AI_DESIGN_IN_PROGRESS">AI 3D Generating</option>
                <option value="DESIGN_READY">Design Ready</option>
                <option value="BOQ_ESTIMATING">BOQ Estimating</option>
                <option value="QUOTATION_GENERATED">Quotation Generated</option>
                <option value="SENT_TO_CLIENT">Sent to Client</option>
                <option value="APPROVED">Client Approved</option>
                <option value="IN_PRODUCTION">In Fabrication</option>
              </select>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/50 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "border-cyan-400 text-cyan-400 bg-cyan-500/5"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Quick Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium">Stall Dimensions</span>
                  <div className="text-base font-bold text-white font-mono mt-1">
                    {project.dimensions.width}×{project.dimensions.depth} {project.dimensions.unit === "METERS" ? "m" : "ft"}
                  </div>
                  <span className="text-xs text-cyan-400 font-mono">
                    {project.dimensions.totalAreaSqm} m² ({project.dimensions.totalAreaSqft} sqft)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium">Target Budget</span>
                  <div className="text-base font-bold text-amber-300 font-mono mt-1">
                    {formatCurrency(project.budget.targetBudgetMax, project.budget.currency)}
                  </div>
                  <span className="text-xs text-slate-500">
                    Margin target: {project.budget.targetMarginPercent}%
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium">Event & City</span>
                  <div className="text-sm font-bold text-white truncate mt-1">
                    {project.exhibition.exhibitionName}
                  </div>
                  <span className="text-xs text-rose-400 truncate block">
                    {project.exhibition.city}, {project.exhibition.country}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium">Orientation</span>
                  <div className="text-sm font-bold text-white truncate mt-1">
                    {project.dimensions.openSides.replace(/_/g, " ")}
                  </div>
                  <span className="text-xs text-emerald-400">
                    {project.dimensions.stallType.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* 7-Step Workflow Progress Map */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  Workflow Execution Pipeline
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                    <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                    <span className="font-bold text-[11px]">1. Brief</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${project.designConcepts.length > 0 ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" : "bg-slate-800/40 border-slate-800 text-slate-500"}`}>
                    <Sparkles className="w-4 h-4 mx-auto mb-1" />
                    <span className="font-bold text-[11px]">2. AI 3D</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                    <Maximize2 className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                    <span className="font-bold text-[11px]">3. Technical Spec</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${project.boqItems.length > 0 ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" : "bg-slate-800/40 border-slate-800 text-slate-500"}`}>
                    <FileSpreadsheet className="w-4 h-4 mx-auto mb-1" />
                    <span className="font-bold text-[11px]">4. BOQ</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-slate-400">
                    <Layers className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <span className="font-bold text-[11px]">5. Market Rates</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${project.quotations.length > 0 ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" : "bg-slate-800/40 border-slate-800 text-slate-500"}`}>
                    <DollarSign className="w-4 h-4 mx-auto mb-1" />
                    <span className="font-bold text-[11px]">6. Quote PDF</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${project.status === "APPROVED" ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold" : "bg-slate-800/40 border-slate-800 text-slate-500"}`}>
                    <ShieldCheck className="w-4 h-4 mx-auto mb-1" />
                    <span className="font-bold text-[11px]">7. Client Signoff</span>
                  </div>
                </div>
              </div>

              {/* Client & Exhibition Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Client & Contact Details
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Company:</span>
                      <span className="font-semibold text-white">{project.client.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Contact Person:</span>
                      <span className="text-slate-200">{project.client.contactPerson}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span className="text-cyan-300">{project.client.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phone:</span>
                      <span className="text-slate-200">{project.client.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Location:</span>
                      <span className="text-slate-200">{project.client.city}, {project.client.country}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Exhibition Schedule
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Exhibition:</span>
                      <span className="font-semibold text-white">{project.exhibition.exhibitionName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Venue & Hall:</span>
                      <span className="text-slate-200">{project.exhibition.venue} ({project.exhibition.hallNumber || "Main Hall"})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Show Dates:</span>
                      <span className="text-emerald-400 font-mono">{project.exhibition.startDate} to {project.exhibition.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Move-in / Build:</span>
                      <span className="text-slate-200 font-mono">{project.exhibition.moveInDate || "3 days prior"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECHNICAL SPECS & 2D FOOTPRINT */}
          {activeTab === "specs" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6">
                  <LiveFootprintCanvas
                    width={project.dimensions.width}
                    depth={project.dimensions.depth}
                    height={project.dimensions.height}
                    unit={project.dimensions.unit}
                    openSides={project.dimensions.openSides}
                    stallType={project.dimensions.stallType}
                    functionalZones={project.brief.functionalZones}
                  />
                </div>

                <div className="lg:col-span-6 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Technical Specification Parameters
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Frontage Width:</span>
                        <span className="font-mono text-white">{project.dimensions.width} {project.dimensions.unit === "METERS" ? "meters" : "feet"}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Depth:</span>
                        <span className="font-mono text-white">{project.dimensions.depth} {project.dimensions.unit === "METERS" ? "meters" : "feet"}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Height:</span>
                        <span className="font-mono text-white">{project.dimensions.height} {project.dimensions.unit === "METERS" ? "meters" : "feet"}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Gross Floor Area:</span>
                        <span className="font-mono text-cyan-300 font-bold">{project.dimensions.totalAreaSqm} m² ({project.dimensions.totalAreaSqft} sqft)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Open Sides:</span>
                        <span className="text-white font-medium">{project.dimensions.openSides.replace(/_/g, " ")}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Fabrication Material System:</span>
                        <span className="text-emerald-400 font-medium">{project.dimensions.stallType.replace(/_/g, " ")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <h5 className="text-xs font-semibold text-slate-300 mb-2">Special Requirements Brief</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {project.brief.specialRequirements || "No special requirements specified."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI 3D CONCEPTS */}
          {activeTab === "designs" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Generated 3D Concepts & Visuals</h4>
                <Link
                  href="/ai-designer"
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Launch AI Studio
                </Link>
              </div>

              {project.designConcepts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.designConcepts.map((concept) => (
                    <div
                      key={concept.id}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3"
                    >
                      <div className="relative h-48 w-full rounded-xl overflow-hidden border border-slate-800">
                        <img
                          src={concept.thumbnailUrl}
                          alt={concept.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                          Version {concept.version}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-white">{concept.title}</h5>
                        {concept.aiPromptUsed && (
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 italic">
                            "{concept.aiPromptUsed}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 text-center space-y-3">
                  <Sparkles className="w-8 h-8 mx-auto text-cyan-400 animate-pulse" />
                  <p className="text-xs text-slate-400">No 3D concepts generated yet for this project brief.</p>
                  <Link
                    href="/ai-designer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                  >
                    Generate First AI 3D Concept
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BOQ */}
          {activeTab === "boq" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Itemized Bill of Quantities (BOQ)</h4>
                <Link
                  href="/boq"
                  className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                >
                  Open Full BOQ Builder <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {project.boqItems.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                      <tr>
                        <th className="p-3">Category</th>
                        <th className="p-3">Item Description</th>
                        <th className="p-3">Qty</th>
                        <th className="p-3">Unit</th>
                        <th className="p-3">Unit Cost</th>
                        <th className="p-3">Client Rate</th>
                        <th className="p-3 text-right">Total Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                      {project.boqItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-semibold text-cyan-400 text-[11px]">{item.category}</td>
                          <td className="p-3 font-medium text-white">{item.name}</td>
                          <td className="p-3 font-mono">{item.quantity}</td>
                          <td className="p-3 text-slate-400">{item.unit}</td>
                          <td className="p-3 font-mono text-slate-400">${item.unitCost}</td>
                          <td className="p-3 font-mono text-emerald-400 font-semibold">${item.clientRate}</td>
                          <td className="p-3 font-mono text-right text-emerald-300 font-bold">
                            ${item.totalClientPrice.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 text-center text-xs text-slate-400">
                  No BOQ items compiled yet. Auto-generate BOQ from stall dimensions in the BOQ module.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: QUOTATIONS */}
          {activeTab === "quotation" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Commercial Quotations</h4>
                <Link
                  href="/quotations"
                  className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                >
                  Go to Quotations Studio <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {project.quotations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.quotations.map((q) => (
                    <div key={q.id} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-cyan-300">{q.quotationNumber}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                          {q.status}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-400">Grand Total:</span>
                        <span className="text-lg font-black text-emerald-300 font-mono">
                          {formatCurrency(q.grandTotal, q.currency)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 italic">{q.clientNotes}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 text-center text-xs text-slate-400">
                  No commercial quotation prepared yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 6: AUDIT TIMELINE */}
          {activeTab === "logs" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h4 className="text-sm font-bold text-white">Project Activity & Approval Trail</h4>
              <div className="space-y-3">
                {project.activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 text-xs"
                  >
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{log.action}</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-400 mt-0.5">{log.details}</p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                        <span>Actor: {log.actor}</span>
                        <span>•</span>
                        <span className="font-mono text-cyan-400">{log.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
