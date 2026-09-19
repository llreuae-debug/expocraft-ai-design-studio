"use client";

import React from "react";
import { Layers, Box, Eye, Sparkles } from "lucide-react";

export default function AssetLibraryPage() {
  const assets = [
    { name: "Curved Reception Podium with LED Trim", cat: "Reception Furniture", format: "GLTF / OBJ", poly: "12.4k" },
    { name: "P2.6 Curved Video Wall Frame 6x3m", cat: "AV Hardware", format: "GLTF / FBX", poly: "8.2k" },
    { name: "Velvet VIP Swivel Armchair (Charcoal)", cat: "Lounge Seating", format: "GLTF / USDZ", poly: "18.5k" },
    { name: "Circular Suspended Truss Ring 5m Dia", cat: "Rigging", format: "GLTF / OBJ", poly: "5.1k" },
    { name: "Touchscreen 55-inch Kiosk Stand", cat: "Digital Display", format: "GLTF / OBJ", poly: "6.7k" },
    { name: "Acoustic Slat Wood Wall Panel Modular", cat: "Wall Cladding", format: "GLTF / FBX", poly: "14.2k" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              3D Asset & Fixtures Library
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold border border-cyan-500/30">
              WebGL & AR Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Production-ready 3D models, textures, truss components, and furniture for spatial stall design.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assets.map((a, i) => (
          <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                {a.cat}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{a.poly} Polys</span>
            </div>
            <h3 className="text-sm font-bold text-white">{a.name}</h3>
            <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="font-mono text-[11px] text-emerald-400">{a.format}</span>
              <button className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1">
                <Eye className="w-3 h-3" /> Preview 3D
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
