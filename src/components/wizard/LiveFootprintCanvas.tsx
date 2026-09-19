"use client";

import React from "react";
import { MeasurementUnit, OpenSides, StallType } from "@/types";
import { calculateArea } from "@/lib/utils";
import { Box, Check, Compass, Grid, Layers, Maximize2, Shield } from "lucide-react";

interface LiveFootprintCanvasProps {
  width: number;
  depth: number;
  height: number;
  unit: MeasurementUnit;
  openSides: OpenSides;
  stallType: StallType;
  primaryColor?: string;
  functionalZones?: string[];
}

export const LiveFootprintCanvas: React.FC<LiveFootprintCanvasProps> = ({
  width,
  depth,
  height,
  unit,
  openSides,
  stallType,
  primaryColor = "#0284c7",
  functionalZones = [],
}) => {
  const { areaSqm, areaSqft } = calculateArea(width, depth, unit);
  const unitSymbol = unit === "METERS" ? "m" : "ft";

  // Wall configuration analysis
  // Sides: top=Back Wall, bottom=Front Aisle, left=Left Wall/Aisle, right=Right Wall/Aisle
  let isBackOpen = false;
  let isFrontOpen = true;
  let isLeftOpen = false;
  let isRightOpen = false;

  if (openSides === "1_SIDE_INLINE") {
    isFrontOpen = true;
    isBackOpen = false;
    isLeftOpen = false;
    isRightOpen = false;
  } else if (openSides === "2_SIDES_CORNER") {
    isFrontOpen = true;
    isRightOpen = true;
    isLeftOpen = false;
    isBackOpen = false;
  } else if (openSides === "3_SIDES_PENINSULA") {
    isFrontOpen = true;
    isLeftOpen = true;
    isRightOpen = true;
    isBackOpen = false;
  } else if (openSides === "4_SIDES_ISLAND") {
    isFrontOpen = true;
    isBackOpen = true;
    isLeftOpen = true;
    isRightOpen = true;
  }

  // Aspect ratio calculation for the 2D visualizer box
  const maxDim = Math.max(width, depth, 1);
  const boxWidthPercent = Math.max(30, Math.min(85, (width / maxDim) * 75));
  const boxHeightPercent = Math.max(30, Math.min(85, (depth / maxDim) * 75));

  return (
    <div className="relative flex flex-col items-center justify-between p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden min-h-[380px]">
      {/* Background Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{ 
          backgroundImage: "linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)", 
          backgroundSize: "24px 24px" 
        }} 
      />

      {/* Top Header Badge */}
      <div className="relative z-10 w-full flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Live Spatial 2D Footprint</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-0.5 rounded-full bg-slate-800/90 border border-slate-700 text-[11px] font-mono text-slate-300">
            {width} × {depth} {unitSymbol} (H: {height}{unitSymbol})
          </div>
          <div className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 font-semibold">
            {areaSqm} m² / {areaSqft} sq ft
          </div>
        </div>
      </div>

      {/* Center 2D Diagram Canvas */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center my-4">
        {/* Main Hall Aisle labels */}
        <div className="absolute top-1 text-[10px] font-mono tracking-widest text-slate-500 uppercase flex items-center gap-1">
          {isBackOpen ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Rear Aisle (Open Walkway)
            </span>
          ) : (
            <span className="text-rose-400/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Neighboring Stand / Back Wall
            </span>
          )}
        </div>

        <div className="absolute bottom-1 text-[10px] font-mono tracking-widest uppercase flex items-center gap-1 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Primary Visitor Aisle (Main Frontage)
        </div>

        <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono tracking-wider">
          {isLeftOpen ? (
            <span className="text-emerald-400">Left Aisle</span>
          ) : (
            <span className="text-rose-400/80">Left Wall</span>
          )}
        </div>

        <div className="absolute right-1 top-1/2 -translate-y-1/2 rotate-90 text-[10px] font-mono tracking-wider">
          {isRightOpen ? (
            <span className="text-emerald-400">Right Aisle</span>
          ) : (
            <span className="text-rose-400/80">Right Wall</span>
          )}
        </div>

        {/* The Stall Footprint Rectangle */}
        <div
          style={{
            width: `${boxWidthPercent}%`,
            height: `${boxHeightPercent}%`,
            borderColor: primaryColor,
          }}
          className="relative transition-all duration-300 ease-out rounded-xl bg-slate-900/80 border-2 shadow-[0_0_25px_rgba(2,132,199,0.25)] flex flex-col items-center justify-between p-3"
        >
          {/* Top Wall Indicator */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-lg transition-colors ${
              isBackOpen ? "border-t-2 border-dashed border-emerald-400 bg-emerald-400/20" : "bg-gradient-to-r from-rose-500 via-rose-600 to-rose-500"
            }`}
          />

          {/* Bottom Wall (Front) Indicator */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-1.5 rounded-b-lg transition-colors ${
              isFrontOpen ? "border-b-2 border-dashed border-emerald-400 bg-emerald-400/20" : "bg-rose-500"
            }`}
          />

          {/* Left Wall Indicator */}
          <div
            className={`absolute top-0 bottom-0 left-0 w-1.5 rounded-l-lg transition-colors ${
              isLeftOpen ? "border-l-2 border-dashed border-emerald-400 bg-emerald-400/20" : "bg-rose-500"
            }`}
          />

          {/* Right Wall Indicator */}
          <div
            className={`absolute top-0 bottom-0 right-0 w-1.5 rounded-r-lg transition-colors ${
              isRightOpen ? "border-r-2 border-dashed border-emerald-400 bg-emerald-400/20" : "bg-rose-500"
            }`}
          />

          {/* Center Stall Information */}
          <div className="w-full flex justify-between items-start text-[10px] text-slate-400">
            <span className="font-mono">{depth} {unitSymbol}</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">H: {height}{unitSymbol}</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center my-auto">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-1 border border-cyan-500/30">
              <Box className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide">
              {width}m × {depth}m
            </span>
            <span className="text-[10px] text-cyan-300 font-mono">
              {areaSqm} m² ({areaSqft} sqft)
            </span>
          </div>

          <div className="w-full flex justify-between items-end text-[10px] text-slate-400 font-mono">
            <span>Entry</span>
            <span>Frontage: {width} {unitSymbol}</span>
          </div>
        </div>
      </div>

      {/* Bottom Legend & Spec Bar */}
      <div className="relative z-10 w-full pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded-sm bg-emerald-400 border border-emerald-300" />
            <span className="text-slate-400 text-[11px]">Open Aisle Side</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded-sm bg-rose-500" />
            <span className="text-slate-400 text-[11px]">Solid Wall / Boundary</span>
          </div>
        </div>

        <div className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>{stallType.replace('_', ' ')}</span>
        </div>
      </div>
    </div>
  );
};
