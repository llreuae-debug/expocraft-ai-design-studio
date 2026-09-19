"use client";

import React, { useState } from "react";
import { DismantlingSpec } from "@/types/execution";
import { Trash2, RefreshCw, Box, Truck, ShieldCheck, DollarSign, Clock, Users, ArrowRight } from "lucide-react";

interface DismantlingCalculatorProps {
  onTotalCostChange?: (cost: number) => void;
}

const DEFAULT_DISMANTLING: DismantlingSpec = {
  estimatedHours: 14,
  manpowerCount: 8,
  dismantlingLabourCost: 1400,
  electricalRemovalCost: 350,
  graphicRemovalCost: 200,
  furniturePackingCost: 300,
  structureDismantlingCost: 800,
  loadingAndTransportCost: 750,
  disposalCost: 400,
  totalDismantlingCost: 4200,
  reusableAssetValue: 18450,
  reusableItems: [
    "Modular Aluminum Extrusion Framework ($4,200)",
    "P2.6 LED Video Wall Rental Panels ($9,500)",
    "3-Phase Electrical DBs & Cables ($1,850)",
    "Designer VIP Velvet Seating ($2,900)",
  ],
  disposalTonnage: 1.8,
  recyclingRatePercent: 82,
};

export const DismantlingCalculator: React.FC<DismantlingCalculatorProps> = ({ onTotalCostChange }) => {
  const [spec, setSpec] = useState<DismantlingSpec>(DEFAULT_DISMANTLING);

  const handleUpdate = (field: keyof DismantlingSpec, value: any) => {
    const updated = { ...spec, [field]: value };
    const total =
      updated.dismantlingLabourCost +
      updated.electricalRemovalCost +
      updated.graphicRemovalCost +
      updated.furniturePackingCost +
      updated.structureDismantlingCost +
      updated.loadingAndTransportCost +
      updated.disposalCost;

    updated.totalDismantlingCost = total;
    setSpec(updated);
    if (onTotalCostChange) onTotalCostChange(total);
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Dismantling & Reusable Asset Recovery Engine
            </h3>
            <p className="text-xs text-slate-400">
              Calculate post-show breakdown costs, asset salvage value, and eco-disposal fees.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
            {spec.estimatedHours}h Rapid Teardown Window
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-sm">
            Total: ${spec.totalDismantlingCost.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Metrics Row: Teardown Cost vs Reusable Asset Value */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Teardown Cost</span>
          <div className="text-xl font-bold text-rose-400 font-mono">${spec.totalDismantlingCost.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500">{spec.manpowerCount} crew specialists on night shift</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Salvaged Asset Value</span>
          <div className="text-xl font-bold text-emerald-400 font-mono">${spec.reusableAssetValue.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Reusable in future events
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Eco Waste & Recycling</span>
          <div className="text-xl font-bold text-cyan-400 font-mono">{spec.recyclingRatePercent}% Recycled</div>
          <p className="text-[11px] text-slate-500">{spec.disposalTonnage} tons non-hazardous waste</p>
        </div>

      </div>

      {/* Itemized Teardown Cost Inputs */}
      <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
          Itemized Dismantling Operations
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Dismantling Labour ($)</label>
            <input
              type="number"
              value={spec.dismantlingLabourCost}
              onChange={(e) => handleUpdate("dismantlingLabourCost", parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Electrical & LED Safe De-Rig ($)</label>
            <input
              type="number"
              value={spec.electricalRemovalCost}
              onChange={(e) => handleUpdate("electricalRemovalCost", parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Graphic & Fabric Peeling ($)</label>
            <input
              type="number"
              value={spec.graphicRemovalCost}
              onChange={(e) => handleUpdate("graphicRemovalCost", parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Furniture Crating & Wrap ($)</label>
            <input
              type="number"
              value={spec.furniturePackingCost}
              onChange={(e) => handleUpdate("furniturePackingCost", parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Structure Teardown ($)</label>
            <input
              type="number"
              value={spec.structureDismantlingCost}
              onChange={(e) => handleUpdate("structureDismantlingCost", parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Loading & Transport ($)</label>
            <input
              type="number"
              value={spec.loadingAndTransportCost}
              onChange={(e) => handleUpdate("loadingAndTransportCost", parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Licensed Waste Disposal ($)</label>
            <input
              type="number"
              value={spec.disposalCost}
              onChange={(e) => handleUpdate("disposalCost", parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Salvaged Asset Value ($)</label>
            <input
              type="number"
              value={spec.reusableAssetValue}
              onChange={(e) => handleUpdate("reusableAssetValue", parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-mono font-bold"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
