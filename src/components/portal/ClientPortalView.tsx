"use client";

import React, { useState } from "react";
import { Project } from "@/types";
import { ClientLifecycleStage, ClientRevisionRequest } from "@/types/i18n";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  FileSpreadsheet,
  MessageSquare,
  Send,
  Printer,
  ChevronRight,
  Eye,
  AlertCircle,
  ThumbsUp,
  RotateCcw,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";

interface ClientPortalViewProps {
  project: Project;
  onUpdateProject: (updates: Partial<Project>) => void;
}

const LIFECYCLE_STAGES: { key: ClientLifecycleStage; label: string; desc: string }[] = [
  { key: "DRAFT", label: "1. Draft Brief", desc: "Requirements capture" },
  { key: "DESIGN_REVIEW", label: "2. Design Review", desc: "Client 3D inspection" },
  { key: "REVISION_REQUESTED", label: "3. Revision", desc: "Feedback iteration" },
  { key: "APPROVED", label: "4. Approved", desc: "Contract signed" },
  { key: "PRODUCTION", label: "5. Factory Build", desc: "Joinery fabrication" },
  { key: "INSTALLATION", label: "6. Onsite Setup", desc: "Hall erection" },
  { key: "COMPLETED", label: "7. Event Live", desc: "Show execution" },
  { key: "DISMANTLED", label: "8. Dismantled", desc: "Site clearance" },
];

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  project,
  onUpdateProject,
}) => {
  const [currentStage, setCurrentStage] = useState<ClientLifecycleStage>("DESIGN_REVIEW");
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionComments, setRevisionComments] = useState("");
  const [revisionComponent, setRevisionComponent] = useState<ClientRevisionRequest["targetComponent"]>("3D_DESIGN");
  const [revisionHistory, setRevisionHistory] = useState<ClientRevisionRequest[]>([
    {
      id: "rev-1",
      timestamp: "2026-09-15T10:30:00Z",
      requestedBy: project.client.contactPerson,
      role: "CLIENT",
      comments: "Please widen the entrance walkway and ensure the P2.6 LED video wall is elevated by at least 80cm.",
      status: "RESOLVED",
      targetComponent: "3D_DESIGN",
    }
  ]);

  const handleApproveDesign = () => {
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    setCurrentStage("APPROVED");
    onUpdateProject({ status: "APPROVED" });
  };

  const handleApproveQuotation = () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    setCurrentStage("APPROVED");
    onUpdateProject({ status: "APPROVED" });
  };

  const handleSubmitRevision = () => {
    if (!revisionComments) return;
    const newRev: ClientRevisionRequest = {
      id: `rev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      requestedBy: project.client.contactPerson,
      role: "CLIENT",
      comments: revisionComments,
      status: "PENDING",
      targetComponent: revisionComponent,
    };
    setRevisionHistory([newRev, ...revisionHistory]);
    setCurrentStage("REVISION_REQUESTED");
    onUpdateProject({ status: "REJECTED" });
    setIsRevisionModalOpen(false);
    setRevisionComments("");
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      
      {/* Top Client Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-semibold">
              Client Review Portal
            </span>
            <span className="text-xs text-slate-400">Authenticated as {project.client.contactPerson} ({project.client.companyName})</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{project.name}</h1>
          <p className="text-xs text-slate-300">
            {project.exhibition.exhibitionName} • {project.exhibition.venue} ({project.exhibition.city})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRevisionModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Request Revision</span>
          </button>

          <button
            onClick={handleApproveQuotation}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/25 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Approve & Sign Proposal</span>
          </button>
        </div>
      </div>

      {/* 8-Stage Lifecycle Tracker */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Project Execution Lifecycle Tracker
          </h3>
          <span className="text-xs font-mono font-bold text-cyan-300">
            Current Stage: {currentStage.replace(/_/g, " ")}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {LIFECYCLE_STAGES.map((stage, idx) => {
            const isCompleted = idx < LIFECYCLE_STAGES.findIndex((s) => s.key === currentStage);
            const isCurrent = stage.key === currentStage;
            return (
              <button
                key={stage.key}
                onClick={() => setCurrentStage(stage.key)}
                className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-lg shadow-cyan-500/20"
                    : isCompleted
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-slate-950/60 border-slate-800 text-slate-400"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold">0{idx + 1}</span>
                    {isCompleted && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <h4 className="text-xs font-bold">{stage.label}</h4>
                </div>
                <span className={`text-[9px] mt-2 line-clamp-1 ${isCurrent ? "text-slate-900" : "text-slate-500"}`}>
                  {stage.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Review Sections: 3D Concepts + BOQ Commercial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 4 3D Concepts Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> 3D Design Visuals for Client Approval
              </h3>
              <button
                onClick={handleApproveDesign}
                className="px-3 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center gap-1"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Approve Design</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "Perspective 1: Front Walkway Entry", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80" },
                { title: "Perspective 2: 3/4 Corner Circulation", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80" },
                { title: "Perspective 3: VIP Meeting Lounge", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80" },
                { title: "Perspective 4: Alternative Creative Form", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80" },
              ].map((c, i) => (
                <div key={i} className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden group">
                  <img src={c.img} alt={c.title} className="w-full h-36 object-cover group-hover:scale-103 transition-transform" />
                  <div className="p-2.5 text-[11px] font-bold text-white text-center">{c.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Revision History Log */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-cyan-400" /> Complete Revision Audit History
            </h3>

            <div className="space-y-2">
              {revisionHistory.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{rev.requestedBy}</span>
                    <span className="font-mono text-[10px] text-slate-500">{new Date(rev.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-300 italic">"{rev.comments}"</p>
                  <span className="inline-block px-2 py-0.2 rounded bg-cyan-500/10 text-cyan-300 text-[9px] font-mono">
                    Status: {rev.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Commercial Quotation & Sign-Off (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4" /> Commercial Quotation Review
            </h3>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Materials & Fabrication:</span>
                <span className="font-mono text-white font-semibold">$38,450.00</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Onsite Labour (9 Trades):</span>
                <span className="font-mono text-white font-semibold">$14,850.00</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Turnkey Installation (9 Phases):</span>
                <span className="font-mono text-white font-semibold">$8,900.00</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Dismantling & Eco-Recycling:</span>
                <span className="font-mono text-white font-semibold">$4,200.00</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Freight Logistics:</span>
                <span className="font-mono text-white font-semibold">$2,400.00</span>
              </div>
              <div className="flex justify-between text-emerald-400 pt-1 border-t border-slate-800">
                <span>Contract Discount:</span>
                <span className="font-mono font-bold">-$2,500.00</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Applicable VAT (5%):</span>
                <span className="font-mono text-white">$4,003.00</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="font-bold text-white uppercase text-xs">Grand Total:</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">$84,063.00 USD</span>
              </div>
            </div>

            {/* Digital Sign-off Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-3">
              <span className="text-xs font-bold uppercase text-emerald-400 block">Digital Contract Acceptance</span>
              <p className="text-xs text-slate-400">
                By approving below, {project.client.companyName} authorizes production and fabrication according to the validated specifications.
              </p>

              {currentStage === "APPROVED" ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 border border-emerald-500/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Approved & Digitally Executed</span>
                </div>
              ) : (
                <button
                  onClick={handleApproveQuotation}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize & Sign Contract</span>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Revision Request Modal */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              Submit Revision Request & Feedback
            </h3>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Target Component</label>
              <select
                value={revisionComponent}
                onChange={(e) => setRevisionComponent(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="3D_DESIGN">3D Architectural Design / Finishes</option>
                <option value="BOQ_PRICING">BOQ Line-Item Pricing / Materials</option>
                <option value="DIMENSIONS">Dimensions / Functional Layout</option>
                <option value="TIMELINE">Installation & Delivery Timeline</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Detailed Client Feedback</label>
              <textarea
                rows={4}
                placeholder="Describe the modifications you would like the design & estimation team to implement..."
                value={revisionComments}
                onChange={(e) => setRevisionComments(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRevisionModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRevision}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Design Team</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
