"use client";

import React, { useState, useEffect } from "react";
import { Project, DesignBrief, OpenSides, StallType, IndustryType, DesignStyle } from "@/types";
import { ExtractedBrandProfile, PerspectiveConcept } from "@/types/studio";
import {
  Sparkles,
  Wand2,
  Send,
  MessageSquare,
  CheckCircle2,
  Box,
  Layers,
  Building2,
  Palette,
  Sliders,
  Tv,
  Users,
  ArrowRight,
  RotateCcw,
  Zap,
  Copy,
  Check,
  Cpu,
  Key,
} from "lucide-react";
import confetti from "canvas-confetti";

interface ConversationalAiDesignerProps {
  project: Project;
  brandProfile?: ExtractedBrandProfile;
  onUpdateProjectBrief: (brief: DesignBrief, dimensions: any) => void;
  onProceedToConcepts: (compiledPrompt: string, width: number, depth: number, style: DesignStyle) => void;
  onDirect8kRender?: (compiledPrompt: string) => void;
  onOpenApiKeyModal?: () => void;
}

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  extractedData?: {
    dimensions?: string;
    style?: string;
    industry?: string;
    zones?: string[];
    stallType?: string;
  };
  timestamp: string;
}

const QUICK_DIMENSIONS = [
  { label: "3×3m", width: 3, depth: 3, desc: "Inline Standard (9m²)" },
  { label: "3×6m", width: 6, depth: 3, desc: "Corner Booth (18m²)" },
  { label: "6×6m", width: 6, depth: 6, desc: "Flagship Pavilion (36m²)" },
  { label: "6×9m", width: 9, depth: 6, desc: "Peninsula Stand (54m²)" },
  { label: "9×9m", width: 9, depth: 9, desc: "Island Arena (81m²)" },
];

const QUICK_STYLES: { name: DesignStyle; desc: string; tag: string }[] = [
  { name: "Ultra-Modern Minimalist", desc: "Crisp white volumes & shadow gaps", tag: "Modern" },
  { name: "Luxury Sleek & Glossy", desc: "Titanium gold trims & black high-gloss acrylic", tag: "Luxury" },
  { name: "Futuristic High-Tech LED", desc: "Curved cybernetic arches & P2.6 LED video wall", tag: "Futuristic" },
  { name: "Corporate Executive", desc: "Executive slate blue & acoustic glass boardroom", tag: "Corporate" },
  { name: "Warm Wood & Biophilic", desc: "Natural timber joinery & preserved living moss", tag: "Minimal" },
];

export const ConversationalAiDesigner: React.FC<ConversationalAiDesignerProps> = ({
  project,
  brandProfile,
  onUpdateProjectBrief,
  onProceedToConcepts,
  onDirect8kRender,
  onOpenApiKeyModal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "ai",
      text: `Hello! I am your ExpoCraft AI Design Controller. Select any size or type your brief below, and I will instantly compile an 8K architectural visualization prompt with exact dimensions and photorealistic materials.`,
      timestamp: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState(
    `Create a premium ${project.dimensions.width}×${project.dimensions.depth}m exhibition stall for ${project.client.companyName} with reception desk, P2.6 LED video wall, and VIP meeting room.`
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Live extracted structured state
  const [activeBrief, setActiveBrief] = useState<DesignBrief>(project.brief);
  const [activeWidth, setActiveWidth] = useState<number>(project.dimensions.width);
  const [activeDepth, setActiveDepth] = useState<number>(project.dimensions.depth);
  const [activeStallType, setActiveStallType] = useState<StallType>(project.dimensions.stallType);
  const [activeOpenSides, setActiveOpenSides] = useState<OpenSides>(project.dimensions.openSides);

  // Automatically compiled 8K master prompt
  const company = brandProfile?.brandName || project.client.companyName;
  const exhibition = project.exhibition.exhibitionName;
  const areaSqm = activeWidth * activeDepth;

  const compiled8kPrompt = `Photorealistic 8K architectural visualization, master exhibition presentation quality. Ultra-HD 7680×4320 canvas. Exhibition pavilion for ${company} at ${exhibition}. Spatial footprint: ${activeWidth}m frontage × ${activeDepth}m depth (${areaSqm}m² floor area), 4m permissible height, ${activeOpenSides.replace(/_/g, " ")}. Architectural Style: ${activeBrief.designStyle}, premium polyurethane high-gloss lacquer finishes, seamless SEG backlit fabric tension graphics, brushed titanium trims. Functional Zones: ${activeBrief.functionalZones.join(", ")}, ${activeBrief.hasReceptionCounter ? "illuminated floating reception desk pod with 3D acrylic logo" : ""}, ${activeBrief.hasLedScreen ? "P2.6 fine-pitch curved LED video wall" : ""}, private VIP glass meeting boardroom. Lighting: 3200K warm interior wash, precision LED halo cove accents, ray-traced reflections, physically plausible shadows, zero geometric distortion, trade-show convention hall ambience.`;

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsProcessing(true);

    setTimeout(() => {
      // Natural language parser & dimension extraction
      let extractedW = activeWidth;
      let extractedD = activeDepth;
      const dimMatch = text.match(/(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)/i);
      if (dimMatch) {
        extractedW = parseFloat(dimMatch[1]);
        extractedD = parseFloat(dimMatch[2]);
      }

      let extractedStyle: DesignStyle = activeBrief.designStyle;
      if (text.toLowerCase().includes("luxury") || text.toLowerCase().includes("gold")) {
        extractedStyle = "Luxury Sleek & Glossy";
      } else if (text.toLowerCase().includes("futuristic") || text.toLowerCase().includes("tech") || text.toLowerCase().includes("cyber")) {
        extractedStyle = "Futuristic High-Tech LED";
      } else if (text.toLowerCase().includes("minimal") || text.toLowerCase().includes("clean")) {
        extractedStyle = "Ultra-Modern Minimalist";
      } else if (text.toLowerCase().includes("corporate") || text.toLowerCase().includes("executive")) {
        extractedStyle = "Corporate Executive";
      } else if (text.toLowerCase().includes("wood") || text.toLowerCase().includes("organic") || text.toLowerCase().includes("textile")) {
        extractedStyle = "Warm Wood & Biophilic";
      }

      const hasLed = text.toLowerCase().includes("led") || text.toLowerCase().includes("screen") || text.toLowerCase().includes("video");
      const hasReception = text.toLowerCase().includes("reception") || text.toLowerCase().includes("counter") || text.toLowerCase().includes("pod");
      const hasMeeting = text.toLowerCase().includes("meeting") || text.toLowerCase().includes("room") || text.toLowerCase().includes("boardroom") || text.toLowerCase().includes("lounge");
      const hasPantry = text.toLowerCase().includes("pantry") || text.toLowerCase().includes("storage") || text.toLowerCase().includes("kitchen");

      const zones: string[] = [];
      if (hasReception) zones.push("reception");
      if (hasLed) zones.push("led_wall");
      if (hasMeeting) zones.push("vip_lounge");
      if (hasPantry) zones.push("storage_pantry");
      if (text.toLowerCase().includes("display") || text.toLowerCase().includes("product")) zones.push("product_podiums");
      if (zones.length === 0) zones.push("reception", "display_area");

      const updatedBrief: DesignBrief = {
        ...activeBrief,
        designStyle: extractedStyle,
        hasLedScreen: hasLed,
        hasReceptionCounter: hasReception,
        hasPantryStorage: hasPantry,
        functionalZones: zones,
        specialRequirements: text,
      };

      setActiveWidth(extractedW);
      setActiveDepth(extractedD);
      setActiveBrief(updatedBrief);
      onUpdateProjectBrief(updatedBrief, {
        width: extractedW,
        depth: extractedD,
        totalAreaSqm: extractedW * extractedD,
        totalAreaSqft: Math.round(extractedW * extractedD * 10.764),
        stallType: activeStallType,
        openSides: activeOpenSides,
      });

      const aiReply: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: "ai",
        text: `Auto-compiled 8K architectural prompt for ${extractedW}×${extractedD}m (${extractedW * extractedD}m²) ${extractedStyle} stand. Exact geometry and 3200K lighting physics locked.`,
        extractedData: {
          dimensions: `${extractedW}×${extractedD}m (${extractedW * extractedD} m²)`,
          style: extractedStyle,
          zones: zones.map(z => z.replace(/_/g, ' ')),
          stallType: activeStallType.replace(/_/g, ' '),
        },
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, aiReply]);
      setIsProcessing(false);
    }, 450);
  };

  const handleApplyDimensionQuick = (w: number, d: number) => {
    setActiveWidth(w);
    setActiveDepth(d);
    onUpdateProjectBrief(activeBrief, {
      width: w,
      depth: d,
      totalAreaSqm: w * d,
      totalAreaSqft: Math.round(w * d * 10.764),
      stallType: activeStallType,
      openSides: activeOpenSides,
    });
    handleSendMessage(`Configure spatial dimensions to ${w}×${d}m (${w * d}m²).`);
  };

  const handleApplyStyleQuick = (styleName: DesignStyle) => {
    setActiveBrief((prev) => ({ ...prev, designStyle: styleName }));
    onUpdateProjectBrief({ ...activeBrief, designStyle: styleName }, {
      width: activeWidth,
      depth: activeDepth,
      totalAreaSqm: activeWidth * activeDepth,
      totalAreaSqft: Math.round(activeWidth * activeDepth * 10.764),
      stallType: activeStallType,
      openSides: activeOpenSides,
    });
    handleSendMessage(`Apply ${styleName} design aesthetic.`);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(compiled8kPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Conversational AI Controller */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl min-h-[580px] space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                ExpoCraft AI Design Controller
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">
                Auto-Generates 8K Architectural Prompts on Size Selection
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenApiKeyModal}
              className="px-2.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold flex items-center gap-1.5 border border-cyan-500/30 transition-all"
              title="Click to Connect or Test Google API Key"
            >
              <Key className="w-3 h-3 text-cyan-400" />
              <span>Google AI Key</span>
            </button>
            <span className="hidden sm:flex px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Auto-8K Engine
            </span>
          </div>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[300px]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === "user"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-semibold rounded-tr-none shadow-md shadow-cyan-500/15"
                    : "bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none space-y-2 shadow-sm"
                }`}
              >
                <p>{m.text}</p>
                {m.extractedData && (
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono space-y-1 text-slate-300">
                    <div className="text-cyan-300 font-bold">✓ Parameters Extracted:</div>
                    <div>📐 Footprint: <span className="text-white">{m.extractedData.dimensions}</span></div>
                    <div>🎨 Aesthetic: <span className="text-white">{m.extractedData.style}</span></div>
                    <div>🏢 Zones: <span className="text-white">{m.extractedData.zones?.join(", ")}</span></div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-cyan-400 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Extracting spatial geometry & synthesizing 8K architectural prompt...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Size Selection (Instant 8K Auto-Prompting) */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-bold text-white flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Select Stall Size (Instant 8K Prompt):
            </span>
            <span className="font-mono text-cyan-400 text-[10px]">1-Click Size Switch</span>
          </div>
          
          <div className="grid grid-cols-5 gap-1.5">
            {QUICK_DIMENSIONS.map((d) => {
              const isSelected = activeWidth === d.width && activeDepth === d.depth;
              return (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => handleApplyDimensionQuick(d.width, d.depth)}
                  className={`p-2 rounded-xl text-center border transition-all flex flex-col items-center justify-center ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 font-black shadow-lg shadow-cyan-500/20 scale-102"
                      : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <span className="text-xs font-mono font-bold">{d.label}</span>
                  <span className={`text-[9px] font-mono ${isSelected ? "text-slate-950" : "text-slate-500"}`}>
                    {d.width * d.depth}m²
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {QUICK_STYLES.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => handleApplyStyleQuick(s.name)}
                className={`px-2.5 py-1 rounded-lg text-[10px] border transition-all ${
                  activeBrief.designStyle === s.name
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                }`}
              >
                {s.tag}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Field */}
        <div className="relative">
          <textarea
            rows={2}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Describe any custom changes or say: 'Make it a 9x9m island stand with luxury gold trims'..."
            className="w-full p-3 pr-12 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none leading-relaxed"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={isProcessing || !inputValue.trim()}
            className="absolute right-2.5 bottom-3.5 p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20 disabled:opacity-40 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Right Column: Real-Time 8K Auto-Prompt & 1-Click Render Hub */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* Real-Time Auto-Prompt Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Auto-Compiled 8K Master Prompt
              </h3>
            </div>
            <button
              onClick={handleCopyPrompt}
              className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[10px] font-mono flex items-center gap-1"
            >
              {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedPrompt ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {/* Compiled Prompt Text Box */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 font-mono leading-relaxed max-h-36 overflow-y-auto custom-scrollbar">
            {compiled8kPrompt}
          </div>

          {/* Feature Token Badges */}
          <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              📐 {activeWidth}×{activeDepth}m ({areaSqm}m²)
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              8K Ultra-HD (7680×4320)
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {activeBrief.designStyle.split(" ")[0]}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              3200K Raytraced
            </span>
          </div>

          {/* Dual 1-Click Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            {onDirect8kRender && (
              <button
                type="button"
                onClick={() => onDirect8kRender(compiled8kPrompt)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs md:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all transform active:scale-98"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>⚡ 1-Click Auto-Generate 8K Presentation Render</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onProceedToConcepts(compiled8kPrompt, activeWidth, activeDepth, activeBrief.designStyle)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs md:text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all transform active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate 4 Synchronized Concepts → Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
