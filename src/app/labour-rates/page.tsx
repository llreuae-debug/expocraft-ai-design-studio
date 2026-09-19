"use client";

import React, { useState } from "react";
import { LabourCalculator } from "@/components/execution/LabourCalculator";
import { InstallationCalculator } from "@/components/execution/InstallationCalculator";
import { DismantlingCalculator } from "@/components/execution/DismantlingCalculator";
import { Hammer, Clock, RefreshCw, ShieldCheck, Zap, Layers } from "lucide-react";

export default function LabourRatesPage() {
  const [activeTab, setActiveTab] = useState<"labour" | "installation" | "dismantling">("labour");

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Hammer className="w-5 h-5 text-cyan-400" />
              Execution Layer: Labour, Installation & Dismantling
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold border border-cyan-500/30">
              Turnkey Commercial Ops
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Calculate 9-role trade manpower, 9-phase installation critical path, and rapid teardown asset recovery.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <button
            onClick={() => setActiveTab("labour")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "labour" ? "bg-cyan-500 text-slate-950 font-bold shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            <span>Labour Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab("installation")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "installation" ? "bg-cyan-500 text-slate-950 font-bold shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Installation Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab("dismantling")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "dismantling" ? "bg-cyan-500 text-slate-950 font-bold shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Dismantling & Salvage</span>
          </button>
        </div>
      </div>

      {/* Active Tab View */}
      {activeTab === "labour" && <LabourCalculator />}
      {activeTab === "installation" && <InstallationCalculator />}
      {activeTab === "dismantling" && <DismantlingCalculator />}

    </div>
  );
}
