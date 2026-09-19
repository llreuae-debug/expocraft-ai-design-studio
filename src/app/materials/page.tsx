"use client";

import React from "react";
import { Boxes, Layers, Tag, DollarSign } from "lucide-react";

export default function MaterialsPage() {
  const materials = [
    { name: "MDF 18mm Fire-Retardant Sheet", cat: "Timber & Joinery", unit: "sqm", cost: 38, supplier: "Dubai Timber Trade" },
    { name: "High Gloss Polyurethane Paint (RAL Standard)", cat: "Finishes", unit: "litre", cost: 45, supplier: "Jotun Paints" },
    { name: "Backlit SEG Fabric 210gsm", cat: "Graphics & Print", unit: "sqm", cost: 28, supplier: "TexPrint Global" },
    { name: "Raised Floor Aluminum Ramp Profile", cat: "Flooring", unit: "lm", cost: 22, supplier: "Alumatech" },
    { name: "White Cast Acrylic Sheet 10mm (Opal)", cat: "Acrylics", unit: "sqm", cost: 65, supplier: "Perspex UAE" },
    { name: "P2.6 High Definition LED Tile (500x500mm)", cat: "AV & Electronics", unit: "unit", cost: 280, supplier: "Unilumin" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Boxes className="w-5 h-5 text-cyan-400" />
              Exhibition Materials Catalog
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold border border-cyan-500/30">
              {materials.length} Stock Materials
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified material stock, unit prices, supplier leads, and fire-safety certificates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {materials.map((m, i) => (
          <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {m.cat}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">${m.cost} / {m.unit}</span>
            </div>
            <h3 className="text-sm font-bold text-white">{m.name}</h3>
            <p className="text-[11px] text-slate-400">Supplier: {m.supplier}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
