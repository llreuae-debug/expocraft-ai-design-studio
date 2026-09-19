"use client";

import React, { useState } from "react";
import { BrandAsset, ExtractedBrandProfile, StylePreset } from "@/types/studio";
import { Upload, X, Check, Image as ImageIcon, Sparkles, Shield, Palette, FileText, Lock } from "lucide-react";
import confetti from "canvas-confetti";

interface BrandUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile?: ExtractedBrandProfile;
  onSaveProfile: (profile: ExtractedBrandProfile, assets: BrandAsset[]) => void;
}

export const BrandUploadModal: React.FC<BrandUploadModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "ai_analysis">("upload");
  const [brandName, setBrandName] = useState(currentProfile?.brandName || "NovaTech AI Systems");
  const [logoUrl, setLogoUrl] = useState(
    currentProfile?.logoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80"
  );
  const [primaryColor, setPrimaryColor] = useState(currentProfile?.primaryColor || "#0284c7");
  const [secondaryColor, setSecondaryColor] = useState(currentProfile?.secondaryColor || "#0f172a");
  const [accentColor, setAccentColor] = useState(currentProfile?.accentColor || "#38bdf8");
  const [surfaceColor, setSurfaceColor] = useState(currentProfile?.surfaceColor || "#f8fafc");
  const [detectedIndustry, setDetectedIndustry] = useState(currentProfile?.detectedIndustry || "Technology & AI");
  const [aesthetic, setAesthetic] = useState<StylePreset>(currentProfile?.designAesthetic || "Futuristic");
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assets, setAssets] = useState<BrandAsset[]>([
    {
      id: "ast-1",
      type: "LOGO",
      fileName: "novatech_logo_vector_master.svg",
      fileSize: "142 KB",
      fileUrl: logoUrl,
      mimeType: "image/svg+xml",
      uploadedAt: new Date().toISOString(),
    },
    {
      id: "ast-2",
      type: "GUIDELINES",
      fileName: "NovaTech_Global_Brand_Manual_2026.pdf",
      fileSize: "8.4 MB",
      fileUrl: "#",
      mimeType: "application/pdf",
      uploadedAt: new Date().toISOString(),
    },
    {
      id: "ast-3",
      type: "PRODUCT",
      fileName: "AI_Quantum_Server_Rack_Hero.png",
      fileSize: "3.1 MB",
      fileUrl: "#",
      mimeType: "image/png",
      uploadedAt: new Date().toISOString(),
    }
  ]);

  if (!isOpen) return null;

  const handleSimulatedUpload = (type: BrandAsset["type"], name: string, size: string) => {
    const newAsset: BrandAsset = {
      id: `ast-${Date.now()}`,
      type,
      fileName: name,
      fileSize: size,
      fileUrl: logoUrl,
      mimeType: "image/png",
      uploadedAt: new Date().toISOString(),
    };
    setAssets((prev) => [newAsset, ...prev]);
  };

  const handleRunAiAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setActiveTab("ai_analysis");
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    }, 1200);
  };

  const handleApplyProfile = () => {
    const profile: ExtractedBrandProfile = {
      brandName,
      primaryColor,
      secondaryColor,
      accentColor,
      surfaceColor,
      logoUrl,
      logoAspectRatio: 1.0,
      typographyPrimary: "Outfit, Inter, sans-serif",
      typographySecondary: "Inter, monospace",
      detectedIndustry,
      visualStyleKeywords: ["High-Tech", "Precision Gloss", "Neon Halo", "Minimalist Clean"],
      designAesthetic: aesthetic,
    };
    onSaveProfile(profile, assets);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">Brand Assets & AI Analysis Engine</h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-semibold border border-cyan-500/30">
                  Logo Lock Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Upload logos, manuals, and imagery. AI extracts color harmony and locks logo geometry without distortion.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-2 border-b-2 text-xs font-semibold transition-all ${
              activeTab === "upload" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400"
            }`}
          >
            1. Asset Upload Repository
          </button>
          <button
            onClick={() => setActiveTab("ai_analysis")}
            className={`px-4 py-2 border-b-2 text-xs font-semibold transition-all ${
              activeTab === "ai_analysis" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400"
            }`}
          >
            2. AI Extracted Brand Profile & Palette
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {activeTab === "upload" ? (
            <div className="space-y-6">
              {/* Logo Non-Distortion Strict Guarantee Banner */}
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
                <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-cyan-300">Protected Logo Rendering Protocol:</span>
                  <p className="text-slate-300 mt-0.5">
                    ExpoCraft strictly preserves uploaded logos. Logos are never distorted, restyled, or reshaped in 2D renders or 3D architectural signboards.
                  </p>
                </div>
              </div>

              {/* Upload Dropzones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Logo Uploader */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-dashed border-slate-700 hover:border-cyan-500/50 transition-all text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Company Logo (SVG, PNG, JPG)</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Vector SVG or High-Res PNG with alpha transparency preferred</p>
                  </div>
                  <button
                    onClick={() => handleSimulatedUpload("LOGO", "Company_Master_Logo_Transparent.svg", "340 KB")}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                  >
                    Select Vector / PNG File
                  </button>
                </div>

                {/* Brand Manual & Product Imagery */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-dashed border-slate-700 hover:border-cyan-500/50 transition-all text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 mx-auto flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Brand Manual, Products & Inspiration</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">PDF Guidelines, Product Catalogues, Booth Moodboards</p>
                  </div>
                  <button
                    onClick={() => handleSimulatedUpload("GUIDELINES", "Corporate_Visual_Guidelines.pdf", "4.2 MB")}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                  >
                    Upload Guidelines / Product Photos
                  </button>
                </div>
              </div>

              {/* Uploaded Assets List */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Uploaded Brand Vault ({assets.length} items)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {assets.map((ast) => (
                    <div key={ast.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="truncate pr-2">
                        <span className="font-semibold text-white block truncate">{ast.fileName}</span>
                        <span className="text-[10px] text-cyan-400 font-mono">{ast.type} • {ast.fileSize}</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Trigger AI Analysis */}
              <button
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAnalyzing ? "AI Analyzing Brand Assets..." : "Run AI Brand Analysis & Extract Palette"}</span>
              </button>
            </div>
          ) : (
            /* Tab 2: AI Analysis & Palette Extraction */
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Extracted Color Palette */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Palette className="w-4 h-4" /> Extracted Brand Color Palette
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Primary Brand Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                        />
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Secondary Brand Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                        />
                        <input
                          type="text"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Accent Neon / Glow</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                        />
                        <input
                          type="text"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Surface / Floor Tone</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={surfaceColor}
                          onChange={(e) => setSurfaceColor(e.target.value)}
                          className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                        />
                        <input
                          type="text"
                          value={surfaceColor}
                          onChange={(e) => setSurfaceColor(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Brand Visual Identity & Logo Lock */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Lock className="w-4 h-4" /> Locked Architectural Signage Preview
                  </h3>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center p-2 shadow-md"
                        style={{ backgroundColor: secondaryColor }}
                      >
                        <img
                          src={logoUrl}
                          alt="Company Logo"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{brandName}</h4>
                        <span className="text-[10px] text-emerald-400 font-mono">1:1 Aspect Ratio Preserved</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Detected Industry</label>
                    <input
                      type="text"
                      value={detectedIndustry}
                      onChange={(e) => setDetectedIndustry(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/95 sticky bottom-0 z-20">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleApplyProfile}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25"
          >
            <Check className="w-4 h-4" />
            <span>Apply Brand Profile to AI Design Engine</span>
          </button>
        </div>

      </div>
    </div>
  );
};
