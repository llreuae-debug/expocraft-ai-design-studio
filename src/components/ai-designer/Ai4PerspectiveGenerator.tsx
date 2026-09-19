"use client";

import React, { useState } from "react";
import { StylePreset, PerspectiveConcept, ExtractedBrandProfile } from "@/types/studio";
import { Project } from "@/types";
import {
  Sparkles,
  Wand2,
  Image as ImageIcon,
  CheckCircle2,
  Box,
  Sliders,
  Layers,
  Eye,
  Maximize2,
  Shield,
  Palette,
  ArrowRight,
  ExternalLink,
  Download,
} from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { getRenderAssetForStyle } from "@/lib/renderAssets";

interface Ai4PerspectiveGeneratorProps {
  project: Project;
  brandProfile?: ExtractedBrandProfile;
  onOpenBrandModal: () => void;
  onUpdateProjectConcepts: (concepts: PerspectiveConcept[]) => void;
  onSelectConceptForRefinement?: (concept: PerspectiveConcept) => void;
  onOpenConceptReviewModal?: (concept: PerspectiveConcept) => void;
  onDirect8kRender?: () => void;
}

const STYLE_PRESETS: { name: StylePreset; desc: string; tag: string }[] = [
  { name: "Modern", desc: "Clean geometric volumes, crisp LED backlights, floating reception", tag: "Contemporary" },
  { name: "Luxury", desc: "Brushed titanium gold trims, black high-gloss acrylic, marble floor", tag: "High-End" },
  { name: "Minimal", desc: "Stark pure whites, subtle shadow gaps, unobstructed open circulation", tag: "Understated" },
  { name: "Corporate", desc: "Executive navy slate, soundproof glass boardroom, podium counter", tag: "Enterprise" },
  { name: "Futuristic", desc: "Curved cybernetic arches, neon cyan edge halo, P2.5 LED wall", tag: "AI / Tech" },
  { name: "Premium", desc: "Handcrafted timber joinery, ambient recessed spotlights, VIP lounge", tag: "Bespoke" },
  { name: "Industrial", desc: "Matte black box truss rigging, exposed metal mesh, raw steel", tag: "Architectural" },
  { name: "Sustainable", desc: "Live preserved moss wall, organic certified timber, biophilic warmth", tag: "Eco-Friendly" },
  { name: "Technology", desc: "Ultra-fine LED video cube, interactive digital touch kiosks, glass floor", tag: "SaaS / Digital" },
];

export const Ai4PerspectiveGenerator: React.FC<Ai4PerspectiveGeneratorProps> = ({
  project,
  brandProfile,
  onOpenBrandModal,
  onUpdateProjectConcepts,
  onSelectConceptForRefinement,
  onOpenConceptReviewModal,
  onDirect8kRender,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<StylePreset>("Futuristic");
  const [briefPrompt, setBriefPrompt] = useState(
    `Create a ${selectedPreset.toLowerCase()} ${project.dimensions.width}×${project.dimensions.depth}m exhibition booth for ${project.client.companyName} at ${project.exhibition.exhibitionName} with reception desk, P2.6 curved LED wall, VIP meeting room, lockable pantry, and product displays.`
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedConcepts, setGeneratedConcepts] = useState<PerspectiveConcept[]>(
    project.perspectiveConcepts || [
      {
        id: "pc-1",
        type: "FRONT",
        title: "Perspective 1: Front Elevation & Primary Aisle Entry",
        perspectiveLabel: "Front Perspective",
        imageUrl: getRenderAssetForStyle(project.brief.designStyle, "hero"),
        highResUrl: getRenderAssetForStyle(project.brief.designStyle, "hero"),
        prompt: `Direct front entrance view of ${project.dimensions.width}x${project.dimensions.depth}m ${project.dimensions.stallType} stand with backlit header logo, illuminated reception desk, and edge LED glow.`,
        specSummary: {
          dimensions: `${project.dimensions.width}×${project.dimensions.depth}m (H: ${project.dimensions.height}m)`,
          openSides: project.dimensions.openSides.replace(/_/g, " "),
          featuresIncluded: ["Main Entrance Fascia Logo", "Illuminated Reception Pod", "P2.6 LED Video Wall Screen", "Ambient Floor Inset Lighting"],
          dominantMaterials: ["Polyurethane Gloss MDF", "Backlit SEG Fabric", "Brushed Aluminum Trim"],
          lightingScheme: "Warm Ambient 3000K + Cyan Edge Neon Halo",
        },
        isClientApproved: true,
        createdAt: "2026-09-18T12:00:00Z",
      },
      {
        id: "pc-2",
        type: "CORNER",
        title: "Perspective 2: 3/4 Corner Isometric Circulation",
        perspectiveLabel: "Corner Perspective",
        imageUrl: getRenderAssetForStyle(project.brief.designStyle, "corner"),
        highResUrl: getRenderAssetForStyle(project.brief.designStyle, "corner"),
        prompt: `3/4 corner aerial view showing walkway intersection, meeting room volume, interactive product pods, and ceiling halo structure.`,
        specSummary: {
          dimensions: `${project.dimensions.width}×${project.dimensions.depth}m`,
          openSides: project.dimensions.openSides.replace(/_/g, " "),
          featuresIncluded: ["Dual Aisle Visibility", "Private Boardroom Module", "Product Display Podiums", "Suspended Ceiling Ring"],
          dominantMaterials: ["Acoustic Slat Wood", "Smart Privacy Switch Glass", "Polished Epoxy Floor"],
          lightingScheme: "Directional Gimbal Spotlights & Cove Lighting",
        },
        isClientApproved: false,
        createdAt: "2026-09-18T12:01:00Z",
      },
      {
        id: "pc-3",
        type: "INTERIOR",
        title: "Perspective 3: Eye-Level VIP Lounge & Meeting Space",
        perspectiveLabel: "Interior Perspective",
        imageUrl: getRenderAssetForStyle(project.brief.designStyle, "interior"),
        highResUrl: getRenderAssetForStyle(project.brief.designStyle, "interior"),
        prompt: `Interior walk-in view inside the VIP hospitality lounge, meeting conference table, designer velvet armchairs, and concealed pantry door.`,
        specSummary: {
          dimensions: "Interior Hospitality Zone",
          openSides: "Enclosed Acoustic Lounge",
          featuresIncluded: ["VIP Coffee Bar", "Executive 6-Person Conference Table", "Custom Velvet Seating", "Lockable Storage Pantry"],
          dominantMaterials: ["Warm Oak Timber", "Soundproof Acoustic Fabric", "Tempered Smoked Glass"],
          lightingScheme: "Warm Dimmable 2700K Architectural Downlights",
        },
        isClientApproved: false,
        createdAt: "2026-09-18T12:02:00Z",
      },
      {
        id: "pc-4",
        type: "ALTERNATIVE",
        title: "Perspective 4: Alternative Organic Architectural Form",
        perspectiveLabel: "Alternative Concept",
        imageUrl: getRenderAssetForStyle(project.brief.designStyle, "detail"),
        highResUrl: getRenderAssetForStyle(project.brief.designStyle, "detail"),
        prompt: `Alternative bold architectural concept featuring double-height parametric timber arches, integrated plant biophilic walls, and overhead floating LED ribbon.`,
        specSummary: {
          dimensions: `${project.dimensions.width}×${project.dimensions.depth}m (Double-Height Feature)`,
          openSides: project.dimensions.openSides.replace(/_/g, " "),
          featuresIncluded: ["Parametric CNC Timber Ribs", "Biophilic Preserved Moss Wall", "Floating Kinetic LED Ribbon", "Central Showcase Plinth"],
          dominantMaterials: ["Sustainably Sourced Pine / Ash", "Living Reindeer Moss", "LED Flexible Strip"],
          lightingScheme: "Organic Diffused Canopy Glow + Focused Accents",
        },
        isClientApproved: false,
        createdAt: "2026-09-18T12:03:00Z",
      },
    ]
  );

  const handleSelectPreset = (preset: StylePreset) => {
    setSelectedPreset(preset);
    setBriefPrompt(
      `Create a ${preset.toLowerCase()} ${project.dimensions.width}×${project.dimensions.depth}m exhibition booth for ${project.client.companyName} at ${project.exhibition.exhibitionName} with reception desk, P2.6 curved LED wall, VIP meeting room, lockable pantry, and product displays.`
    );
  };

  const handleGenerate4Concepts = () => {
    setIsGenerating(true);
    const w = project.dimensions.width;
    const d = project.dimensions.depth;

    setTimeout(() => {
      setIsGenerating(false);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

      const heroUrl = getRenderAssetForStyle(selectedPreset, "hero");
      const cornerUrl = getRenderAssetForStyle(selectedPreset, "corner");
      const interiorUrl = getRenderAssetForStyle(selectedPreset, "interior");
      const altUrl = getRenderAssetForStyle(selectedPreset, "detail");

      const newSuite: PerspectiveConcept[] = [
        {
          id: `pc-front-${Date.now()}`,
          type: "FRONT",
          title: `Perspective 1: ${selectedPreset} Front Elevation`,
          perspectiveLabel: "Front Perspective",
          imageUrl: heroUrl,
          highResUrl: heroUrl,
          prompt: `Direct front entrance view of ${w}x${d}m ${selectedPreset} stall with company branding and reception.`,
          specSummary: {
            dimensions: `${w}×${d}m`,
            openSides: project.dimensions.openSides.replace(/_/g, " "),
            featuresIncluded: ["Backlit Logo Fascia", "Reception Counter", "LED Video Wall"],
            dominantMaterials: ["Polyurethane MDF", "Backlit Fabric"],
            lightingScheme: "Warm Ambient + Accent Neon Halo",
          },
          isClientApproved: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: `pc-corner-${Date.now()}`,
          type: "CORNER",
          title: `Perspective 2: ${selectedPreset} Corner 3/4 Aisle`,
          perspectiveLabel: "Corner Perspective",
          imageUrl: cornerUrl,
          highResUrl: cornerUrl,
          prompt: `3/4 corner perspective showing circulation and meeting room architecture.`,
          specSummary: {
            dimensions: `${w}×${d}m`,
            openSides: project.dimensions.openSides.replace(/_/g, " "),
            featuresIncluded: ["Multi-Aisle Visibility", "Meeting Enclosure", "Ceiling Hanging Truss"],
            dominantMaterials: ["Acoustic Slats", "Tempered Glass"],
            lightingScheme: "Theatrical Spotlights",
          },
          isClientApproved: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: `pc-interior-${Date.now()}`,
          type: "INTERIOR",
          title: `Perspective 3: ${selectedPreset} Interior VIP Hospitality`,
          perspectiveLabel: "Interior Perspective",
          imageUrl: interiorUrl,
          highResUrl: interiorUrl,
          prompt: `Interior perspective walk-in view of VIP lounge and meeting area.`,
          specSummary: {
            dimensions: "Lounge Suite",
            openSides: "Semi-Private",
            featuresIncluded: ["VIP Sofa", "Meeting Table", "Hospitality Pantry"],
            dominantMaterials: ["Velvet Seating", "Timber Oak"],
            lightingScheme: "Architectural Downlights",
          },
          isClientApproved: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: `pc-alt-${Date.now()}`,
          type: "ALTERNATIVE",
          title: `Perspective 4: ${selectedPreset} Macro Architectural Form`,
          perspectiveLabel: "Alternative Concept",
          imageUrl: altUrl,
          highResUrl: altUrl,
          prompt: `Architectural detail shot showcasing brushed titanium trim, illuminated 3D logo, and high-gloss floor.`,
          specSummary: {
            dimensions: `${w}×${d}m`,
            openSides: project.dimensions.openSides.replace(/_/g, " "),
            featuresIncluded: ["Curved Cantilever Arch", "Biophilic Feature Wall", "Interactive Kiosks"],
            dominantMaterials: ["Parametric Timber", "Preserved Moss"],
            lightingScheme: "Diffused Canopy Glow",
          },
          isClientApproved: false,
          createdAt: new Date().toISOString(),
        },
      ];

      setGeneratedConcepts(newSuite);
      onUpdateProjectConcepts(newSuite);
    }, 450);
  };

  return (
    <div className="space-y-6">
      
      {/* Brand Context Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center p-1.5 border border-slate-700 shadow-md"
            style={{ backgroundColor: brandProfile?.secondaryColor || "#0f172a" }}
          >
            <img
              src={brandProfile?.logoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80"}
              alt="Logo"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">{brandProfile?.brandName || project.client.companyName}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3" /> Logo Geometry Locked
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-400">Palette:</span>
              <div className="flex items-center gap-1">
                {[brandProfile?.primaryColor || "#0284c7", brandProfile?.secondaryColor || "#0f172a", brandProfile?.accentColor || "#38bdf8", brandProfile?.surfaceColor || "#ffffff"].map((c, i) => (
                  <div key={i} className="w-3 h-3 rounded-full border border-slate-800 shadow-sm" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenBrandModal}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold flex items-center gap-1.5 border border-slate-700"
        >
          <Palette className="w-3.5 h-3.5 text-cyan-400" />
          <span>Upload / Edit Brand Guidelines</span>
        </button>
      </div>

      {/* Style Presets Selector (9 Presets) */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          Select Architectural Style Preset (9 AI Styles)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {STYLE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleSelectPreset(preset.name)}
              className={`p-2.5 rounded-xl text-center border transition-all flex flex-col justify-between ${
                selectedPreset === preset.name
                  ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/20"
                  : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              <span className="text-xs font-bold block">{preset.name}</span>
              <span className={`text-[9px] mt-1 font-mono ${selectedPreset === preset.name ? "text-slate-900" : "text-slate-500"}`}>
                {preset.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Natural Language Prompt Box */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Wand2 className="w-4 h-4" /> AI Stall Design Brief Prompt
          </label>
          <span className="text-[11px] font-mono text-slate-500">Auto-Maintains Dimension & Logo Specs</span>
        </div>

        <textarea
          rows={3}
          value={briefPrompt}
          onChange={(e) => setBriefPrompt(e.target.value)}
          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none leading-relaxed"
        />

        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          {onDirect8kRender && (
            <button
              type="button"
              onClick={onDirect8kRender}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all transform active:scale-98"
            >
              <span>⚡ 1-Click 8K Presentation Render</span>
            </button>
          )}

          <button
            onClick={handleGenerate4Concepts}
            disabled={isGenerating}
            className="flex-1 w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isGenerating
                ? "Synthesizing 4 Synchronized Architectural Perspectives..."
                : `Generate 4 Synchronized Concepts (${selectedPreset} Style)`}
            </span>
          </button>
        </div>
      </div>

      {/* 4 PERSPECTIVES CONCEPT SUITE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              Generated 4-Perspective Concept Suite
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Strictly harmonized across dimensions ({project.dimensions.width}×{project.dimensions.depth}m), logo branding, screens, and lighting.
            </p>
          </div>
          <Link
            href="/studio"
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            <Box className="w-4 h-4" />
            <span>Open in 3D Studio</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {generatedConcepts.map((concept, idx) => (
            <div
              key={concept.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
            >
              {/* Image Preview */}
              <div className="relative h-64 w-full bg-slate-950 overflow-hidden">
                <img
                  src={concept.imageUrl}
                  alt={concept.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-xs font-bold text-cyan-300 border border-cyan-500/30">
                  {concept.perspectiveLabel}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenConceptReviewModal && onOpenConceptReviewModal(concept)}
                    className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 border border-slate-700 transition-all"
                    title="Review & Compare Concept"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={concept.highResUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-slate-200 border border-slate-700"
                    title="View High-Res"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Applied Brand Watermark Overlay (Showing un-distorted logo position) */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800 flex items-center gap-2">
                  <img
                    src={brandProfile?.logoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80"}
                    alt="Brand Logo"
                    className="w-4 h-4 object-contain"
                  />
                  <span className="text-[10px] text-slate-300 font-mono">Branding Applied</span>
                </div>
              </div>

              {/* Spec Details */}
              <div className="p-5 space-y-3">
                <h3 className="text-sm font-bold text-white">{concept.title}</h3>
                <p className="text-[11px] text-slate-400 italic line-clamp-2">"{concept.prompt}"</p>

                {/* Features & Materials Tags */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px]">
                  <div className="flex flex-wrap gap-1.5">
                    {concept.specSummary.featuresIncluded.map((feat, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                        {feat}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-slate-400 pt-1">
                    <span>Lighting:</span>
                    <span className="font-mono text-cyan-300">{concept.specSummary.lightingScheme}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-mono">
                      ✓ Matches {project.dimensions.width}×{project.dimensions.depth}m Spec
                    </span>
                    <Link
                      href="/studio"
                      className="text-[11px] font-semibold text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>3D WebGL</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectConceptForRefinement && onSelectConceptForRefinement(concept)}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all transform active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Select This Design</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

