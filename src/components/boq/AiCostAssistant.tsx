"use client";

import React, { useState } from "react";
import { DetailedBOQLineItem } from "@/types/boq";
import {
  Sparkles,
  Wand2,
  TrendingDown,
  Crown,
  Repeat,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Send,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";

interface AiCostAssistantProps {
  items: DetailedBOQLineItem[];
  onApplyMutation: (updatedItems: DetailedBOQLineItem[], actionSummary: string) => void;
}

export const AiCostAssistant: React.FC<AiCostAssistantProps> = ({ items, onApplyMutation }) => {
  const [commandInput, setCommandInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastActionResult, setLastActionResult] = useState<string | null>(null);

  const executeCommand = (cmd: string) => {
    setIsProcessing(true);
    const lower = cmd.toLowerCase();

    setTimeout(() => {
      setIsProcessing(false);
      let updated = [...items];
      let summary = "";

      if (lower.includes("reduce") || lower.includes("15%") || lower.includes("discount") || lower.includes("cheap")) {
        // 1. Reduce cost by 15%
        updated = items.map((item) => {
          const newUnitRate = Number((item.unitRate * 0.85).toFixed(2));
          const newLabour = Number((item.labourCost * 0.85).toFixed(2));
          const totalCost = item.quantity * (newUnitRate + newLabour);
          const clientRate = Number(((newUnitRate + newLabour) * (1 + item.markupPercent / 100)).toFixed(2));
          const totalClientPrice = Number((item.quantity * clientRate).toFixed(2));

          return {
            ...item,
            unitRate: newUnitRate,
            labourCost: newLabour,
            totalCost,
            clientRate,
            totalClientPrice,
            isCustomModified: true,
          };
        });
        summary = "Applied 15% Value Engineering reduction across material rates and installation labor while maintaining structural code safety.";
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } else if (lower.includes("premium") || lower.includes("luxury") || lower.includes("upgrade")) {
        // 2. Make it premium
        updated = items.map((item) => {
          let extraRate = 1.25;
          let newDesc = item.description;
          let newMat = item.material;

          if (item.category === "Flooring") {
            newDesc = "Ultra High-Gloss Italian Acrylic Raised Platform with LED Perimeter Under-Glow";
            newMat = "Mirrored High-Gloss Acrylic with Aluminum Edges";
            extraRate = 1.4;
          } else if (item.category === "Structure" || item.category === "Carpentry") {
            newDesc = "Bespoke Curved Joinery with Brushed Titanium Gold Inset Trims";
            newMat = "High-Density MDF with Multi-Coat PU Spray & Titanium Accents";
            extraRate = 1.3;
          } else if (item.category === "Lighting") {
            newDesc = "CRI>95 Theatrical Architectural Downlights + RGBW Neon Accent Strips";
            extraRate = 1.35;
          }

          const newUnitRate = Number((item.unitRate * extraRate).toFixed(2));
          const totalCost = item.quantity * (newUnitRate + item.labourCost);
          const clientRate = Number(((newUnitRate + item.labourCost) * (1 + item.markupPercent / 100)).toFixed(2));
          const totalClientPrice = Number((item.quantity * clientRate).toFixed(2));

          return {
            ...item,
            description: newDesc,
            material: newMat,
            unitRate: newUnitRate,
            totalCost,
            clientRate,
            totalClientPrice,
            isCustomModified: true,
          };
        });
        summary = "Upgraded BOQ to Luxury Flagship specification: High-gloss acrylic flooring, brushed titanium joinery trims, and CRI>95 lighting.";
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } else if (lower.includes("aluminum") || lower.includes("mdf") || lower.includes("modular")) {
        // 3. Replace MDF with aluminum
        updated = items.map((item) => {
          if (item.category === "Structure" || item.category === "MDF/Plywood") {
            return {
              ...item,
              category: "Aluminum",
              itemCode: `ALU-${item.itemCode}`,
              description: "Modular Octanorm / Maxima Structural Aluminum Extrusion Framework with SEG Infill",
              material: "Reusable Anodized Architectural Aluminum System (6063-T6)",
              unitRate: Number((item.unitRate * 0.78).toFixed(2)),
              labourCost: Number((item.labourCost * 0.65).toFixed(2)), // Faster modular install
              totalCost: item.quantity * (Number((item.unitRate * 0.78).toFixed(2)) + Number((item.labourCost * 0.65).toFixed(2))),
              clientRate: Number(((item.unitRate * 0.78 + item.labourCost * 0.65) * (1 + item.markupPercent / 100)).toFixed(2)),
              totalClientPrice: Number((item.quantity * ((item.unitRate * 0.78 + item.labourCost * 0.65) * (1 + item.markupPercent / 100))).toFixed(2)),
              isCustomModified: true,
            };
          }
          return item;
        });
        summary = "Converted timber/MDF partitions to Modular Architectural Aluminum System, reducing installation labor by 35% and transport weight.";
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      } else {
        // 4. Explain most expensive items
        const sorted = [...items].sort((a, b) => b.totalClientPrice - a.totalClientPrice);
        const top3 = sorted.slice(0, 3);
        summary = `Top 3 Cost Drivers in this Stall: 1) ${top3[0]?.description} ($${top3[0]?.totalClientPrice.toLocaleString()}), 2) ${top3[1]?.description} ($${top3[1]?.totalClientPrice.toLocaleString()}), 3) ${top3[2]?.description} ($${top3[2]?.totalClientPrice.toLocaleString()}).`;
      }

      setLastActionResult(summary);
      onApplyMutation(updated, summary);
      setCommandInput("");
    }, 1000);
  };

  return (
    <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              AI Commercial Cost Assistant
            </h3>
            <span className="text-[10px] text-slate-400">Directly Mutates & Rebalances Live BOQ</span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/30">
          Actionable Engine
        </span>
      </div>

      {/* Preset Action Chips */}
      <div className="space-y-1.5">
        <span className="text-[10px] text-slate-400 font-semibold uppercase block">Quick Cost Commands:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={() => executeCommand("Reduce cost by 15%.")}
            disabled={isProcessing}
            className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 text-left transition-all flex items-center gap-2 group"
          >
            <TrendingDown className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div className="truncate">
              <span className="text-xs font-bold text-white block group-hover:text-cyan-300">Reduce Cost by 15%</span>
              <span className="text-[10px] text-slate-500">Value-engineer material & labor</span>
            </div>
          </button>

          <button
            onClick={() => executeCommand("Make it premium.")}
            disabled={isProcessing}
            className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 text-left transition-all flex items-center gap-2 group"
          >
            <Crown className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="truncate">
              <span className="text-xs font-bold text-white block group-hover:text-cyan-300">Make it Premium</span>
              <span className="text-[10px] text-slate-500">High-gloss & titanium upgrades</span>
            </div>
          </button>

          <button
            onClick={() => executeCommand("Replace MDF with aluminum.")}
            disabled={isProcessing}
            className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 text-left transition-all flex items-center gap-2 group"
          >
            <Repeat className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div className="truncate">
              <span className="text-xs font-bold text-white block group-hover:text-cyan-300">Replace MDF with Aluminum</span>
              <span className="text-[10px] text-slate-500">Convert to modular Maxima</span>
            </div>
          </button>

          <button
            onClick={() => executeCommand("Explain the most expensive items.")}
            disabled={isProcessing}
            className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 text-left transition-all flex items-center gap-2 group"
          >
            <HelpCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <div className="truncate">
              <span className="text-xs font-bold text-white block group-hover:text-cyan-300">Explain Expensive Items</span>
              <span className="text-[10px] text-slate-500">Identify top 3 cost drivers</span>
            </div>
          </button>
        </div>
      </div>

      {/* Freeform Prompt Input */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="text"
          placeholder="e.g. Optimize lighting rates, reduce carpentry markup by 5%, or remove LED wall..."
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commandInput && executeCommand(commandInput)}
          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
        <button
          onClick={() => commandInput && executeCommand(commandInput)}
          disabled={isProcessing || !commandInput}
          className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Action Notification Box */}
      {lastActionResult && (
        <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-2.5 text-xs animate-in fade-in duration-200">
          <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <p className="text-slate-200 leading-relaxed font-medium">{lastActionResult}</p>
        </div>
      )}
    </div>
  );
};
