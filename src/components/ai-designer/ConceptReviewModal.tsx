"use client";

import React, { useState } from "react";
import { PerspectiveConcept, ExtractedBrandProfile } from "@/types/studio";
import { Project } from "@/types";
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  Heart,
  RotateCw,
  Edit3,
  Columns,
  CheckCircle2,
  X,
  Sparkles,
  Shield,
  Layers,
} from "lucide-react";
import { getRenderAssetForStyle } from "@/lib/renderAssets";

interface ConceptReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  concepts: PerspectiveConcept[];
  project: Project;
  brandProfile?: ExtractedBrandProfile;
  selectedConceptId: string;
  onSelectConcept: (concept: PerspectiveConcept) => void;
  onRegenerateConcept?: (conceptId: string) => void;
}

export const ConceptReviewModal: React.FC<ConceptReviewModalProps> = ({
  isOpen,
  onClose,
  concepts,
  project,
  brandProfile,
  selectedConceptId,
  onSelectConcept,
  onRegenerateConcept,
}) => {
  const [activeConceptId, setActiveConceptId] = useState<string>(
    selectedConceptId || concepts[0]?.id || ""
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [isComparing, setIsComparing] = useState(false);
  const [compareConceptId, setCompareConceptId] = useState<string>(concepts[1]?.id || "");

  if (!isOpen) return null;

  const currentConcept =
    concepts.find((c) => c.id === activeConceptId) || concepts[0];
  const compareConcept =
    concepts.find((c) => c.id === compareConceptId) || concepts[1];

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConfirmSelection = (concept: PerspectiveConcept) => {
    onSelectConcept(concept);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col justify-between ${
        isFullscreen ? "p-0" : "p-4 md:p-6"
      }`}
    >
      {/* Top Navigation Bar */}
      <div className="h-16 px-6 bg-slate-900/90 border-b border-slate-800 rounded-t-3xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Architectural Concept Review & Comparison
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-[10px]">
                {concepts.length} Synchronized Views
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {project.client.companyName} • {project.dimensions.width}×{project.dimensions.depth}m {project.dimensions.stallType.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsComparing(!isComparing)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isComparing
                ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{isComparing ? "Exit Compare" : "Compare Views"}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Review Viewport */}
      <div className="flex-1 bg-slate-950 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Concept Thumbnails Strip */}
        <div className="w-full md:w-80 border-r border-slate-800/80 bg-slate-900/60 p-4 space-y-3 overflow-y-auto">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block px-1">
            Perspective Concepts (4 Views)
          </span>

          {concepts.map((concept) => {
            const isSelected = concept.id === activeConceptId;
            const isFav = favorites[concept.id];

            return (
              <div
                key={concept.id}
                onClick={() => setActiveConceptId(concept.id)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative group ${
                  isSelected
                    ? "bg-cyan-500/10 border-cyan-400 shadow-md shadow-cyan-500/15"
                    : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="relative h-32 rounded-xl overflow-hidden bg-slate-900 mb-2">
                  <img
                    src={concept.imageUrl}
                    alt={concept.title}
                    onError={(e) => {
                      e.currentTarget.src = getRenderAssetForStyle(project.brief.designStyle, concept.type === "FRONT" ? "hero" : concept.type === "CORNER" ? "corner" : concept.type === "INTERIOR" ? "interior" : "detail");
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-mono font-bold text-cyan-300 border border-slate-800">
                    {concept.perspectiveLabel}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(concept.id);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-md bg-slate-950/80 text-rose-400 hover:scale-110 transition-transform"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
                  </button>
                </div>

                <h4 className="text-xs font-bold text-white truncate">{concept.title}</h4>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{concept.prompt}</p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[10px]">
                  <span className="text-emerald-400 font-mono">✓ {project.dimensions.width}×{project.dimensions.depth}m Spec</span>
                  {isSelected && (
                    <span className="text-cyan-400 font-bold flex items-center gap-1 font-mono">
                      Viewing <CheckCircle2 className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Center / Right Stage Area */}
        <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
          {isComparing ? (
            /* Split Comparison Mode */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              <div className="rounded-2xl border border-cyan-500/40 bg-slate-900/80 p-4 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-cyan-300 font-mono">Primary View: {currentConcept.perspectiveLabel}</span>
                </div>
                <div className="relative flex-1 rounded-xl overflow-hidden bg-slate-950 min-h-[300px]">
                  <img
                    src={currentConcept.highResUrl || currentConcept.imageUrl}
                    alt="Primary"
                    onError={(e) => {
                      e.currentTarget.src = getRenderAssetForStyle(project.brief.designStyle, currentConcept.type === "FRONT" ? "hero" : currentConcept.type === "CORNER" ? "corner" : currentConcept.type === "INTERIOR" ? "interior" : "detail");
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => handleConfirmSelection(currentConcept)}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                  >
                    Select Left Concept
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <select
                    value={compareConceptId}
                    onChange={(e) => setCompareConceptId(e.target.value)}
                    className="p-1 rounded-lg bg-slate-950 text-xs text-slate-300 border border-slate-700"
                  >
                    {concepts.map((c) => (
                      <option key={c.id} value={c.id}>Compare with: {c.perspectiveLabel}</option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-1 rounded-xl overflow-hidden bg-slate-950 min-h-[300px]">
                  <img
                    src={compareConcept.highResUrl || compareConcept.imageUrl}
                    alt="Compare"
                    onError={(e) => {
                      e.currentTarget.src = getRenderAssetForStyle(project.brief.designStyle, compareConcept.type === "FRONT" ? "hero" : compareConcept.type === "CORNER" ? "corner" : compareConcept.type === "INTERIOR" ? "interior" : "detail");
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => handleConfirmSelection(compareConcept)}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                  >
                    Select Right Concept
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Single Large Stage */
            <div className="space-y-4">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl min-h-[420px] max-h-[560px] flex items-center justify-center group">
                <img
                  src={currentConcept.highResUrl || currentConcept.imageUrl}
                  alt={currentConcept.title}
                  onError={(e) => {
                    e.currentTarget.src = getRenderAssetForStyle(project.brief.designStyle, currentConcept.type === "FRONT" ? "hero" : currentConcept.type === "CORNER" ? "corner" : currentConcept.type === "INTERIOR" ? "interior" : "detail");
                  }}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    isZoomed ? "scale-150 cursor-zoom-out" : "scale-100 cursor-zoom-in"
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />

                {/* Overlay Tags */}
                <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-bold text-cyan-300 border border-cyan-500/30 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentConcept.perspectiveLabel}</span>
                </div>

                {/* Applied Brand Logo Watermark */}
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 flex items-center gap-2.5 shadow-lg">
                  <img
                    src={brandProfile?.logoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80"}
                    alt="Logo"
                    className="w-5 h-5 object-contain"
                  />
                  <div className="text-[10px]">
                    <span className="font-bold text-white block">{brandProfile?.brandName || project.client.companyName}</span>
                    <span className="text-emerald-400 font-mono text-[9px]">Vector Geometry Locked</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-slate-200 border border-slate-700"
                    title={isZoomed ? "Zoom Out" : "Zoom In"}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleFavorite(currentConcept.id)}
                    className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-rose-400 border border-slate-700"
                  >
                    <Heart className={`w-4 h-4 ${favorites[currentConcept.id] ? "fill-rose-500" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Specs & Architectural Details */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white">{currentConcept.title}</h3>
                    <p className="text-xs text-slate-400 italic mt-0.5">"{currentConcept.prompt}"</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-cyan-300 font-mono text-xs font-semibold border border-slate-800">
                    {currentConcept.specSummary.dimensions}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-semibold">Features Included:</span>
                    <div className="flex flex-wrap gap-1">
                      {currentConcept.specSummary.featuresIncluded.map((f, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 text-[11px] border border-slate-800">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-semibold">Dominant Materials:</span>
                    <div className="flex flex-wrap gap-1">
                      {currentConcept.specSummary.dominantMaterials.map((m, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 text-[11px] border border-slate-800">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase font-semibold">Lighting & Shadows:</span>
                    <p className="text-cyan-300 font-mono text-[11px]">{currentConcept.specSummary.lightingScheme}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="h-20 px-6 bg-slate-900/90 border-t border-slate-800 rounded-b-3xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Selected for Refinement:</span>
          <span className="text-xs font-bold text-white font-mono">{currentConcept.perspectiveLabel}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all"
          >
            Keep Browsing
          </button>

          <button
            onClick={() => handleConfirmSelection(currentConcept)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-cyan-500/25 transition-all transform active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Select This Design → Refine</span>
          </button>
        </div>
      </div>
    </div>
  );
};
