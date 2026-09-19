"use client";

import React, { useState } from "react";
import {
  PerspectiveConcept,
  ExtractedBrandProfile,
  DesignRefinements,
  FlooringTextureType,
} from "@/types/studio";
import { Project } from "@/types";
import {
  Sliders,
  Sparkles,
  Palette,
  Layers,
  Sun,
  Tv,
  Users,
  ShieldCheck,
  Wand2,
  ArrowRight,
  RotateCcw,
  Check,
} from "lucide-react";

interface DesignRefinementPanelProps {
  project: Project;
  selectedConcept: PerspectiveConcept;
  brandProfile?: ExtractedBrandProfile;
  refinements: DesignRefinements;
  onUpdateRefinements: (refinements: DesignRefinements) => void;
  onProceedToApproval: () => void;
  onBackToConcepts: () => void;
}

const FLOORING_OPTIONS: { id: FlooringTextureType; label: string; desc: string; color: string }[] = [
  { id: "EPOXY_GLOSS_WHITE", label: "Epoxy Gloss White", desc: "High-reflective mirror finish", color: "#f8fafc" },
  { id: "DARK_SLATE", label: "Dark Architectural Slate", desc: "Matte modern enterprise", color: "#1e293b" },
  { id: "WARM_OAK_WOOD", label: "Warm Oak Timber", desc: "Organic biophilic warmth", color: "#78350f" },
  { id: "ILLUMINATED_LED_EDGE", label: "Illuminated Edge Glass", desc: "Under-floor neon halo", color: "#0284c7" },
  { id: "CARPET_CHARCOAL", label: "Charcoal Needle-Punch Carpet", desc: "Sound-dampening luxury", color: "#334155" },
];

const LIGHTING_OPTIONS = [
  { id: "WARM_3000K", label: "Warm Ambient (3000K)", desc: "Inviting hospitality glow" },
  { id: "NEON_CYAN_TECH", label: "High-Tech Neon Halo", desc: "Futuristic cybernetic accents" },
  { id: "STUDIO_WHITE_5000K", label: "Studio Clean (5000K)", desc: "True color product illumination" },
  { id: "CINEMATIC_DRAMATIC", label: "Cinematic Theatrical", desc: "High-contrast gimbal spotlights" },
];

const RECEPTION_OPTIONS = [
  { id: "FLOATING_LED_POD", label: "Floating LED Pod", desc: "Halo backlight with 3D logo" },
  { id: "WOOD_CURVED_BAR", label: "Curved Timber Joinery", desc: "Natural organic hospitality" },
  { id: "MONOLITHIC_MARBLE", label: "Monolithic Marble Plinth", desc: "High-luxury statement desk" },
  { id: "MINIMAL_COUNTER", label: "Minimalist Geometric", desc: "Compact open reception" },
];

const STYLE_MODIFIERS = [
  { id: "MORE_PREMIUM", label: "💎 Make More Premium", promptAdd: "Enhance with brushed metal trims and luxury finishes." },
  { id: "MORE_MODERN", label: "⚡ Make More Modern", promptAdd: "Apply crisp geometric lines and minimalist volumes." },
  { id: "MORE_MINIMAL", label: "🌿 Make More Minimal", promptAdd: "Reduce visual noise and open up circulation corridors." },
  { id: "REDUCE_CLUTTER", label: "🧹 Reduce Visual Clutter", promptAdd: "Streamline furniture and consolidate graphics." },
  { id: "WARM_HOSPITALITY", label: "☕ Warm & Welcoming", promptAdd: "Add warm acoustic wood tones and comfortable lounge seating." },
];

export const DesignRefinementPanel: React.FC<DesignRefinementPanelProps> = ({
  project,
  selectedConcept,
  brandProfile,
  refinements,
  onUpdateRefinements,
  onProceedToApproval,
  onBackToConcepts,
}) => {
  const [naturalPrompt, setNaturalPrompt] = useState(
    refinements.naturalLanguageInstruction || ""
  );

  const handleFlooringChange = (type: FlooringTextureType) => {
    onUpdateRefinements({ ...refinements, flooringType: type });
  };

  const handleLightingChange = (scheme: any) => {
    onUpdateRefinements({ ...refinements, lightingScheme: scheme });
  };

  const handleReceptionChange = (style: any) => {
    onUpdateRefinements({ ...refinements, receptionStyle: style });
  };

  const handleToggleMeetingRoom = () => {
    onUpdateRefinements({
      ...refinements,
      meetingRoomEnclosed: !refinements.meetingRoomEnclosed,
    });
  };

  const handleLedScaleChange = (scale: any) => {
    onUpdateRefinements({ ...refinements, ledScreenScale: scale });
  };

  const handleBrandingProminenceChange = (prominence: any) => {
    onUpdateRefinements({ ...refinements, brandingProminence: prominence });
  };

  const handleToggleModifier = (modifierId: any, promptText: string) => {
    const current = refinements.styleModifiers || [];
    const exists = current.includes(modifierId);
    const updated = exists
      ? current.filter((m) => m !== modifierId)
      : [...current, modifierId];

    let newPrompt = naturalPrompt;
    if (!exists) {
      newPrompt = newPrompt ? `${newPrompt} ${promptText}` : promptText;
      setNaturalPrompt(newPrompt);
    }

    onUpdateRefinements({
      ...refinements,
      styleModifiers: updated,
      naturalLanguageInstruction: newPrompt,
    });
  };

  const handleApplyNaturalPrompt = () => {
    onUpdateRefinements({
      ...refinements,
      naturalLanguageInstruction: naturalPrompt,
    });
  };

  const handleQuickPromptClick = (example: string) => {
    setNaturalPrompt(example);
    onUpdateRefinements({
      ...refinements,
      naturalLanguageInstruction: example,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
              Stage 2 • Design Refinement
            </span>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Fine-tune "{selectedConcept.perspectiveLabel}"
            </h2>
            <p className="text-xs text-slate-400">
              Customize materials, lighting, screens, and furniture before locking for 8K Presentation Render.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToConcepts}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold"
          >
            ← Back to Concepts
          </button>
          <button
            onClick={onProceedToApproval}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <span>Lock & Proceed to Approval</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Visual Context */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
              Base Design Reference
            </span>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <img
                src={selectedConcept.highResUrl || selectedConcept.imageUrl}
                alt="Selected"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-300 border border-cyan-500/30">
                {selectedConcept.perspectiveLabel}
              </div>
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 text-[10px] text-slate-300 border border-slate-800 font-mono">
                {project.dimensions.width}×{project.dimensions.depth}m • {project.dimensions.stallType.replace(/_/g, " ")}
              </div>
            </div>

            {/* Active Refinements Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
              <span className="text-[10px] text-cyan-400 uppercase font-mono font-bold">Applied Parameters:</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="text-slate-400">
                  Flooring: <span className="text-white font-medium">{refinements.flooringType || "Epoxy Gloss White"}</span>
                </div>
                <div className="text-slate-400">
                  Lighting: <span className="text-white font-medium">{refinements.lightingScheme || "Warm Ambient 3000K"}</span>
                </div>
                <div className="text-slate-400">
                  Reception: <span className="text-white font-medium">{refinements.receptionStyle || "Floating LED Pod"}</span>
                </div>
                <div className="text-slate-400">
                  Screen: <span className="text-white font-medium">{refinements.ledScreenScale || "P2.6 LED Wall"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Controls */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Natural Language Prompt Refinement */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-mono">
                <Wand2 className="w-4 h-4" /> Natural-Language Custom Refinements
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Preserves Exact Dimensions</span>
            </div>

            <textarea
              rows={2}
              value={naturalPrompt}
              onChange={(e) => setNaturalPrompt(e.target.value)}
              placeholder="e.g., Make the reception counter larger and add an illuminated company logo..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Try quick suggestions:</span>
              <button
                onClick={handleApplyNaturalPrompt}
                className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
              >
                Apply Instruction
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                "Make the reception counter larger with illuminated logo",
                "Add a private meeting room on the left with smart glass",
                "Use a luxury black and gold brushed finish",
                "Make the booth more open and welcoming with extra lounge seating",
              ].map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickPromptClick(ex)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-300 border border-slate-800 hover:border-slate-700 text-left transition-all"
                >
                  "{ex}"
                </button>
              ))}
            </div>
          </div>

          {/* Quick Style Modifiers */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block font-mono">
              Quick Architectural Style Modifiers
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STYLE_MODIFIERS.map((mod) => {
                const isActive = refinements.styleModifiers?.includes(mod.id as any);
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => handleToggleModifier(mod.id, mod.promptAdd)}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs font-semibold ${
                      isActive
                        ? "bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span>{mod.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Flooring Finishes Selection */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 font-mono">
              <Layers className="w-4 h-4 text-cyan-400" /> Exhibition Flooring Finish
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FLOORING_OPTIONS.map((f) => {
                const isSelected = (refinements.flooringType || "EPOXY_GLOSS_WHITE") === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => handleFlooringChange(f.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-cyan-500/10 border-cyan-400 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full border border-slate-700" style={{ backgroundColor: f.color }} />
                      <div>
                        <span className="text-xs font-bold block text-white">{f.label}</span>
                        <span className="text-[10px] text-slate-500">{f.desc}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lighting & Reception Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Lighting Scheme */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 font-mono">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Lighting Scheme
              </label>
              <select
                value={refinements.lightingScheme || "WARM_3000K"}
                onChange={(e) => handleLightingChange(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                {LIGHTING_OPTIONS.map((l) => (
                  <option key={l.id} value={l.id}>{l.label} - {l.desc}</option>
                ))}
              </select>
            </div>

            {/* Reception Counter */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 font-mono">
                <Users className="w-3.5 h-3.5 text-cyan-400" /> Reception Counter Style
              </label>
              <select
                value={refinements.receptionStyle || "FLOATING_LED_POD"}
                onChange={(e) => handleReceptionChange(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                {RECEPTION_OPTIONS.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* LED Screen Scale */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 font-mono">
                <Tv className="w-3.5 h-3.5 text-cyan-400" /> LED Video Screen Scale
              </label>
              <select
                value={refinements.ledScreenScale || "PANORAMIC_CURVED"}
                onChange={(e) => handleLedScaleChange(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="PANORAMIC_CURVED">Panoramic Curved P2.6 Wall</option>
                <option value="STANDARD">Standard Recessed Header Screen</option>
                <option value="DOUBLE_WALL">Dual Sided Corner Video Walls</option>
                <option value="NONE">No Digital LED Wall (Static SEG Fabric)</option>
              </select>
            </div>

            {/* Branding Prominence */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Brand Header Prominence
              </label>
              <select
                value={refinements.brandingProminence || "MAXIMUM_HERO"}
                onChange={(e) => handleBrandingProminenceChange(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="MAXIMUM_HERO">Maximum Hero (Double Height + Halo)</option>
                <option value="BALANCED">Balanced Architectural (Header + Pod)</option>
                <option value="SUBTLE">Subtle & Understated</option>
              </select>
            </div>

          </div>

          {/* Bottom Action */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onProceedToApproval}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-cyan-500/25 transition-all transform active:scale-98"
            >
              <span>Approve Refinements & Proceed to Final Gate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
