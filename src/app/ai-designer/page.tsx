"use client";

import React, { useState, useEffect } from "react";
import { useProjects } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { ConversationalAiDesigner } from "@/components/ai-designer/ConversationalAiDesigner";
import { Ai4PerspectiveGenerator } from "@/components/ai-designer/Ai4PerspectiveGenerator";
import { ConceptReviewModal } from "@/components/ai-designer/ConceptReviewModal";
import { DesignRefinementPanel } from "@/components/ai-designer/DesignRefinementPanel";
import { FinalDesignApprovalModal } from "@/components/ai-designer/FinalDesignApprovalModal";
import { FinalRenderWorkspace } from "@/components/ai-designer/FinalRenderWorkspace";
import { BrandUploadModal } from "@/components/branding/BrandUploadModal";
import { DesignBrief } from "@/types";
import {
  ExtractedBrandProfile,
  BrandAsset,
  PerspectiveConcept,
  DesignRefinements,
  FinalRenderRecord,
  AiConfigStatus,
} from "@/types/studio";
import {
  Sparkles,
  Palette,
  Shield,
  Box,
  Wand2,
  Sliders,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  Key,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { getRenderAssetForStyle } from "@/lib/renderAssets";

type WorkflowStage = "CHAT_BRIEF" | "CONCEPTS" | "REFINE" | "APPROVAL" | "FINAL_RENDER";

export default function AiDesignerPage() {
  const { projects, updateProject } = useProjects();
  const { currentUser, isClient } = useAuth();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "");
  const [currentStage, setCurrentStage] = useState<WorkflowStage>("CHAT_BRIEF");
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isConceptReviewModalOpen, setIsConceptReviewModalOpen] = useState(false);
  const [activeCompiledPrompt, setActiveCompiledPrompt] = useState<string>("");
  const [autoTriggerRender, setAutoTriggerRender] = useState(false);

  // AI Connection State Check
  const [aiStatus, setAiStatus] = useState<AiConfigStatus | null>(null);

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const [selectedConcept, setSelectedConcept] = useState<PerspectiveConcept | null>(
    currentProject?.perspectiveConcepts?.[0] || null
  );

  const [refinements, setRefinements] = useState<DesignRefinements>({
    flooringType: "EPOXY_GLOSS_WHITE",
    lightingScheme: "WARM_3000K",
    receptionStyle: "FLOATING_LED_POD",
    ledScreenScale: "PANORAMIC_CURVED",
    brandingProminence: "MAXIMUM_HERO",
    furnitureDensity: "BALANCED_EXECUTIVE",
    meetingRoomEnclosed: true,
  });

  useEffect(() => {
    fetchAiConfig();
  }, []);

  const fetchAiConfig = async () => {
    try {
      const res = await fetch("/api/v1/ai/config");
      if (res.ok) {
        const data = await res.json();
        setAiStatus(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveBrandProfile = (profile: ExtractedBrandProfile, assets: BrandAsset[]) => {
    if (currentProject) {
      updateProject(currentProject.id, {
        brandProfile: profile,
        brandAssets: assets,
      });
    }
  };

  const handleUpdateProjectBrief = (brief: DesignBrief, dimensions: any) => {
    if (currentProject) {
      updateProject(currentProject.id, {
        brief,
        dimensions: {
          ...currentProject.dimensions,
          ...dimensions,
        },
      });
    }
  };

  const handleUpdatePerspectiveConcepts = (concepts: PerspectiveConcept[]) => {
    if (currentProject) {
      updateProject(currentProject.id, {
        perspectiveConcepts: concepts,
        status: "DESIGN_READY",
      });
      if (!selectedConcept && concepts.length > 0) {
        setSelectedConcept(concepts[0]);
      }
    }
  };

  const handleSelectConceptForRefinement = (concept: PerspectiveConcept) => {
    setSelectedConcept(concept);
    setCurrentStage("REFINE");
  };

  const handleOpenConceptReviewModal = (concept?: PerspectiveConcept) => {
    if (concept) {
      setSelectedConcept(concept);
    }
    setIsConceptReviewModalOpen(true);
  };

  const handleUpdateProjectRenders = (renders: FinalRenderRecord[], activeId: string) => {
    if (currentProject) {
      updateProject(currentProject.id, {
        finalRenders: renders,
        activeFinalRenderId: activeId,
        status: "DESIGN_READY",
      });
    }
  };

  const handleDirect8kRender = (prompt?: string) => {
    if (prompt) {
      setActiveCompiledPrompt(prompt);
    }
    setAutoTriggerRender(true);
    setCurrentStage("FINAL_RENDER");
  };

  const handleProceedToConcepts = (prompt: string, w: number, d: number, style: any) => {
    setActiveCompiledPrompt(prompt);
    const styleName = style || currentProject.brief.designStyle || "Futuristic High-Tech LED";

    const heroUrl = getRenderAssetForStyle(styleName, "hero");
    const cornerUrl = getRenderAssetForStyle(styleName, "corner");
    const interiorUrl = getRenderAssetForStyle(styleName, "interior");
    const altUrl = getRenderAssetForStyle(styleName, "detail");

    const newSuite: PerspectiveConcept[] = [
      {
        id: `pc-front-${Date.now()}`,
        type: "FRONT",
        title: `Perspective 1: ${styleName} Front Elevation`,
        perspectiveLabel: "Front Perspective",
        imageUrl: heroUrl,
        highResUrl: heroUrl,
        prompt: `Direct front entrance view of ${w}×${d}m ${styleName} pavilion with illuminated reception desk and P2.6 LED screen.`,
        specSummary: {
          dimensions: `${w}×${d}m`,
          openSides: currentProject.dimensions.openSides.replace(/_/g, " "),
          featuresIncluded: ["Backlit Logo Fascia", "Reception Counter", "LED Video Wall"],
          dominantMaterials: ["Polyurethane MDF", "Backlit Fabric"],
          lightingScheme: "Warm Ambient 3000K + Accent Neon Halo",
        },
        isClientApproved: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: `pc-corner-${Date.now()}`,
        type: "CORNER",
        title: `Perspective 2: ${styleName} Corner 3/4 Aisle`,
        perspectiveLabel: "Corner Perspective",
        imageUrl: cornerUrl,
        highResUrl: cornerUrl,
        prompt: `3/4 corner perspective showing dual-aisle circulation, ceiling truss, and VIP meeting boardroom.`,
        specSummary: {
          dimensions: `${w}×${d}m`,
          openSides: currentProject.dimensions.openSides.replace(/_/g, " "),
          featuresIncluded: ["Multi-Aisle Visibility", "Meeting Enclosure", "Ceiling Hanging Truss"],
          dominantMaterials: ["Acoustic Slats", "Tempered Glass"],
          lightingScheme: "Directional Spotlights",
        },
        isClientApproved: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: `pc-interior-${Date.now()}`,
        type: "INTERIOR",
        title: `Perspective 3: ${styleName} Interior VIP Hospitality`,
        perspectiveLabel: "Interior Perspective",
        imageUrl: interiorUrl,
        highResUrl: interiorUrl,
        prompt: `Interior walk-in view inside the private VIP lounge, executive meeting table, and coffee pantry.`,
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
        title: `Perspective 4: ${styleName} Macro Architectural Form`,
        perspectiveLabel: "Alternative Concept",
        imageUrl: altUrl,
        highResUrl: altUrl,
        prompt: `Architectural detail shot showcasing brushed titanium trim, illuminated 3D logo, and high-gloss floor.`,
        specSummary: {
          dimensions: `${w}×${d}m`,
          openSides: currentProject.dimensions.openSides.replace(/_/g, " "),
          featuresIncluded: ["Curved Cantilever Arch", "Biophilic Feature Wall", "Interactive Kiosks"],
          dominantMaterials: ["Parametric Timber", "Preserved Moss"],
          lightingScheme: "Diffused Canopy Glow",
        },
        isClientApproved: false,
        createdAt: new Date().toISOString(),
      },
    ];

    handleUpdatePerspectiveConcepts(newSuite);
    setSelectedConcept(newSuite[0]);
    setCurrentStage("CONCEPTS");
    setIsConceptReviewModalOpen(true);
  };

  if (!currentProject) return null;

  const conceptsList = currentProject.perspectiveConcepts || [];
  const activeConcept = selectedConcept || conceptsList[0];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Missing Google AI Key Alert Banner */}
      {aiStatus && !aiStatus.connected && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-300">
          <div className="flex items-center gap-2.5 text-xs font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
            <span>
              <strong>Google AI is not connected.</strong> Add your Google API key in Settings → AI to generate 3D presentation renders.
            </span>
          </div>
          <Link
            href="/settings"
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md self-start sm:self-auto"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Configure AI Key</span>
          </Link>
        </div>
      )}

      {/* Page Header & Workflow Step Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              ExpoCraft AI Design Studio
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold border border-cyan-500/30">
              Conversational & 8K Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            AI Chat Brief → 4 Synchronized Concepts → Selection → Refinement → Approval → 8K Render
          </p>
        </div>

        {/* Project Selector & Brand Button */}
        <div className="flex items-center gap-3">
          <select
            value={selectedProjectId}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              setCurrentStage("CHAT_BRIEF");
            }}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:border-cyan-500 focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectCode} — {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsBrandModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Palette className="w-4 h-4" />
            <span>Brand Assets</span>
          </button>
        </div>
      </div>

      {/* 5-Stage Connected Workflow Stepper Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
        {[
          { id: "CHAT_BRIEF", label: "1. AI Chat Brief", desc: "Natural Language Parser", icon: MessageSquare },
          { id: "CONCEPTS", label: "2. Four 3D Concepts", desc: "Front, Corner, Interior, Alt", icon: Sparkles },
          { id: "REFINE", label: "3. Design Refinement", desc: "Colors, Lighting & Furniture", icon: Sliders },
          { id: "APPROVAL", label: "4. Final Design Approval", desc: "Specification Sign-off", icon: Lock },
          { id: "FINAL_RENDER", label: "5. 8K Presentation Render", desc: "High-Res Visual Package", icon: CheckCircle2 },
        ].map((stage, idx) => {
          const isActive = currentStage === stage.id;
          const Icon = stage.icon;
          return (
            <button
              key={stage.id}
              onClick={() => setCurrentStage(stage.id as WorkflowStage)}
              className={`p-3 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                isActive
                  ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20"
                  : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isActive ? "bg-slate-950 text-cyan-400" : "bg-slate-900 text-slate-400"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="text-xs font-bold block truncate">{stage.label}</span>
                <span
                  className={`text-[9px] block truncate font-mono ${
                    isActive ? "text-slate-900" : "text-slate-500"
                  }`}
                >
                  {stage.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* STAGE 1: CONVERSATIONAL AI DESIGN CONTROLLER */}
      {currentStage === "CHAT_BRIEF" && (
        <ConversationalAiDesigner
          project={currentProject}
          brandProfile={currentProject.brandProfile}
          onUpdateProjectBrief={handleUpdateProjectBrief}
          onProceedToConcepts={handleProceedToConcepts}
          onDirect8kRender={handleDirect8kRender}
        />
      )}

      {/* STAGE 2: 4 PERSPECTIVE GENERATION */}
      {currentStage === "CONCEPTS" && (
        <Ai4PerspectiveGenerator
          project={currentProject}
          brandProfile={currentProject.brandProfile}
          onOpenBrandModal={() => setIsBrandModalOpen(true)}
          onUpdateProjectConcepts={handleUpdatePerspectiveConcepts}
          onSelectConceptForRefinement={handleSelectConceptForRefinement}
          onOpenConceptReviewModal={handleOpenConceptReviewModal}
          onDirect8kRender={() => handleDirect8kRender(activeCompiledPrompt)}
        />
      )}

      {/* STAGE 3: DESIGN REFINEMENT */}
      {currentStage === "REFINE" && activeConcept && (
        <DesignRefinementPanel
          project={currentProject}
          selectedConcept={activeConcept}
          brandProfile={currentProject.brandProfile}
          refinements={refinements}
          onUpdateRefinements={setRefinements}
          onProceedToApproval={() => setCurrentStage("APPROVAL")}
          onBackToConcepts={() => setCurrentStage("CONCEPTS")}
        />
      )}

      {/* STAGE 4: FINAL DESIGN APPROVAL */}
      {currentStage === "APPROVAL" && activeConcept && (
        <FinalDesignApprovalModal
          project={currentProject}
          selectedConcept={activeConcept}
          brandProfile={currentProject.brandProfile}
          refinements={refinements}
          onApproveAndGenerate={() => handleDirect8kRender(activeCompiledPrompt)}
          onBackToEdit={() => setCurrentStage("REFINE")}
        />
      )}

      {/* STAGE 5: FINAL 8K PRESENTATION RENDER */}
      {currentStage === "FINAL_RENDER" && (
        <FinalRenderWorkspace
          project={currentProject}
          brandProfile={currentProject.brandProfile}
          refinements={refinements}
          customPrompt={activeCompiledPrompt}
          autoTrigger={autoTriggerRender}
          activeRender={
            currentProject.finalRenders?.find((r) => r.id === currentProject.activeFinalRenderId) ||
            currentProject.finalRenders?.[0]
          }
          onUpdateProjectRenders={handleUpdateProjectRenders}
          onBackToEdit={() => setCurrentStage("REFINE")}
        />
      )}

      {/* Concept Review / Comparison Modal */}
      <ConceptReviewModal
        isOpen={isConceptReviewModalOpen}
        onClose={() => setIsConceptReviewModalOpen(false)}
        concepts={conceptsList}
        project={currentProject}
        brandProfile={currentProject.brandProfile}
        selectedConceptId={activeConcept?.id || ""}
        onSelectConcept={handleSelectConceptForRefinement}
      />

      {/* Brand Asset Upload & Extraction Modal */}
      <BrandUploadModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        currentProfile={currentProject.brandProfile}
        onSaveProfile={handleSaveBrandProfile}
      />

    </div>
  );
}
