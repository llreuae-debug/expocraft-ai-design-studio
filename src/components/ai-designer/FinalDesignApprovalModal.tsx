"use client";

import React from "react";
import {
  PerspectiveConcept,
  ExtractedBrandProfile,
  DesignRefinements,
} from "@/types/studio";
import { Project } from "@/types";
import {
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Box,
  Layers,
  Sun,
  Tv,
  Users,
  Building2,
  Lock,
} from "lucide-react";

interface FinalDesignApprovalModalProps {
  project: Project;
  selectedConcept: PerspectiveConcept;
  brandProfile?: ExtractedBrandProfile;
  refinements: DesignRefinements;
  onApproveAndGenerate: () => void;
  onBackToEdit: () => void;
}

export const FinalDesignApprovalModal: React.FC<FinalDesignApprovalModalProps> = ({
  project,
  selectedConcept,
  brandProfile,
  refinements,
  onApproveAndGenerate,
  onBackToEdit,
}) => {
  const company = brandProfile?.brandName || project.client.companyName;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Title & Gate Status */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/30">
          <Lock className="w-3.5 h-3.5" />
          <span>Stage 3 • Final Design Approval Gate</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          FINAL DESIGN APPROVAL
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Review and formally sign off on the architectural layout, branding parameters, and materials before launching the 8K presentation rendering engine.
        </p>
      </div>

      {/* Main Review Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-8">
        
        {/* Top Split: 3D Preview & Brand Overview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 relative h-72 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl group">
            <img
              src={selectedConcept.highResUrl || selectedConcept.imageUrl}
              alt="Approved Concept"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-xs font-mono font-bold text-cyan-300 border border-cyan-500/30">
              {selectedConcept.perspectiveLabel} (Approved Baseline)
            </div>
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 flex items-center gap-2">
              <img
                src={brandProfile?.logoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80"}
                alt="Logo"
                className="w-4 h-4 object-contain"
              />
              <span className="text-xs font-bold text-white">{company}</span>
              <span className="text-[10px] text-emerald-400 font-mono">✓ Verified</span>
            </div>
          </div>

          {/* Project & Venue Details */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">Target Client & Event</span>
              <h3 className="text-base font-bold text-white">{project.name}</h3>
              <p className="text-slate-400 font-medium">Exhibition: {project.exhibition.exhibitionName}</p>
              <p className="text-slate-400">Venue: {project.exhibition.venue} ({project.exhibition.city})</p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono">
                <span className="text-slate-500">Dates:</span>
                <span className="text-cyan-300">{project.exhibition.startDate} — {project.exhibition.endDate}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5 text-xs">
              <span className="text-[10px] text-cyan-400 font-mono uppercase font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Dimensions & Fabrication
              </span>
              <div className="flex justify-between text-white font-mono font-bold">
                <span>Footprint:</span>
                <span>{project.dimensions.width}m × {project.dimensions.depth}m ({project.dimensions.totalAreaSqm} m²)</span>
              </div>
              <div className="flex justify-between text-slate-400 font-mono">
                <span>Height Limit:</span>
                <span>{project.dimensions.height}m Height</span>
              </div>
              <div className="flex justify-between text-slate-400 font-mono">
                <span>Orientation:</span>
                <span>{project.dimensions.openSides.replace(/_/g, " ")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Spec Matrices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Flooring & Materials
            </span>
            <p className="text-sm font-bold text-white">{refinements.flooringType || "Epoxy Gloss White"}</p>
            <p className="text-[11px] text-slate-400">High-gloss polyurethane MDF joinery, brushed titanium edges.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Lighting Scheme
            </span>
            <p className="text-sm font-bold text-white">{refinements.lightingScheme || "Warm Ambient 3000K"}</p>
            <p className="text-[11px] text-slate-400">Recessed ceiling spotlights, LED halo cove wash, backlit SEG fabric.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1">
              <Tv className="w-3.5 h-3.5 text-cyan-400" /> Digital Video Screens
            </span>
            <p className="text-sm font-bold text-white">{refinements.ledScreenScale || "P2.6 LED Curved Wall"}</p>
            <p className="text-[11px] text-slate-400">Fine-pitch high-brightness panel calibrated for ambient trade-show lighting.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" /> Reception & Zones
            </span>
            <p className="text-sm font-bold text-white">{refinements.receptionStyle || "Floating LED Pod"}</p>
            <p className="text-[11px] text-slate-400">VIP conference lounge, product display podiums, and lockable pantry.</p>
          </div>

        </div>

        {/* Official Statement Banner */}
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center space-y-1">
          <p className="text-xs font-bold text-cyan-300">
            This design will be used to create the final presentation render and quotation.
          </p>
          <p className="text-[11px] text-slate-400">
            Approval locks the spatial model and compiles the high-resolution architectural prompt for the 8K engine.
          </p>
        </div>

        {/* Gate Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={onBackToEdit}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Back to Edit</span>
          </button>

          <button
            onClick={onApproveAndGenerate}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs md:text-sm flex items-center justify-center gap-2.5 shadow-2xl shadow-cyan-500/30 transition-all transform active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>Approve & Generate Final Render</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
