"use client";

import React, { useState } from "react";
import { Scene3DConfig, Scene3DObject, FlooringTextureType, SceneObjectType } from "@/types/studio";
import {
  Layers,
  Maximize2,
  Tv,
  Box,
  Palette,
  Sun,
  Shield,
  PlusCircle,
  Trash2,
  Check,
  Eye,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

interface StudioControlsProps {
  config: Scene3DConfig;
  onUpdateConfig: (updates: Partial<Scene3DConfig>) => void;
  onAddObject: (type: SceneObjectType) => void;
  onRemoveObject: (id: string) => void;
  selectedObjectId: string | null;
}

export const StudioControls: React.FC<StudioControlsProps> = ({
  config,
  onUpdateConfig,
  onAddObject,
  onRemoveObject,
  selectedObjectId,
}) => {
  const [activeTab, setActiveTab] = useState<"ai_cmd" | "architecture" | "furniture" | "flooring" | "lighting">("ai_cmd");
  const [aiCmdInput, setAiCmdInput] = useState("");
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const handleExecuteAi3DCommand = (customCmd?: string) => {
    const cmd = (customCmd || aiCmdInput).trim().toLowerCase();
    if (!cmd) return;

    setAiFeedback("Analyzing spatial command & updating 3D scene graph...");

    setTimeout(() => {
      let feedback = "";
      if (cmd.includes("sofa") || cmd.includes("lounge")) {
        onAddObject("VIP_LOUNGE_SOFA");
        feedback = "Added Executive VIP Lounge Sofa to 3D scene.";
      } else if (cmd.includes("chair") || cmd.includes("chairs") || cmd.includes("stool")) {
        onAddObject("CHAIR_EXECUTIVE");
        onAddObject("CHAIR_EXECUTIVE");
        feedback = "Added two Executive Leather Chairs beside reception area.";
      } else if (cmd.includes("table") || cmd.includes("meeting") || cmd.includes("conference")) {
        onAddObject("MEETING_TABLE");
        feedback = "Added Conference Meeting Table module.";
      } else if (cmd.includes("led") || cmd.includes("screen") || cmd.includes("wall")) {
        onAddObject("LED_VIDEO_WALL");
        feedback = "Added P2.6 Ultra-Fine Curved LED Screen Wall.";
      } else if (cmd.includes("reception") || cmd.includes("desk") || cmd.includes("counter")) {
        onAddObject("RECEPTION_COUNTER");
        feedback = "Added Illuminated Reception Desk Pod.";
      } else if (cmd.includes("kiosk") || cmd.includes("touch")) {
        onAddObject("TOUCHSCREEN_KIOSK");
        feedback = "Added 55\" Digital Interactive Touchscreen Kiosk.";
      } else if (cmd.includes("podium") || cmd.includes("display") || cmd.includes("plinth")) {
        onAddObject("DISPLAY_PODIUM");
        feedback = "Added Product Display Podium.";
      } else if (cmd.includes("oak") || cmd.includes("wood") || cmd.includes("timber")) {
        onUpdateConfig({ flooringType: "WARM_OAK_WOOD" });
        feedback = "Updated flooring texture to Natural Warm Oak Timber.";
      } else if (cmd.includes("slate") || cmd.includes("dark")) {
        onUpdateConfig({ flooringType: "DARK_SLATE" });
        feedback = "Updated flooring texture to Dark Architectural Slate.";
      } else if (cmd.includes("white") || cmd.includes("epoxy") || cmd.includes("gloss")) {
        onUpdateConfig({ flooringType: "EPOXY_GLOSS_WHITE" });
        feedback = "Updated flooring texture to High-Gloss Epoxy White.";
      } else if (cmd.includes("neon") || cmd.includes("halo")) {
        onUpdateConfig({ neonEdgeEnabled: true });
        feedback = "Enabled perimeter LED Neon Halo lighting.";
      } else {
        onAddObject("DISPLAY_PODIUM");
        feedback = `Executed: "${cmd}". Added modular architectural element to scene.`;
      }

      setAiFeedback(feedback);
      setAiCmdInput("");
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    }, 450);
  };

  const flooringOptions: { type: FlooringTextureType; label: string; color: string }[] = [
    { type: "EPOXY_GLOSS_WHITE", label: "High-Gloss Epoxy White", color: "#f8fafc" },
    { type: "DARK_SLATE", label: "Dark Architectural Slate", color: "#0f172a" },
    { type: "WARM_OAK_WOOD", label: "Natural Warm Oak Timber", color: "#78350f" },
    { type: "CARPET_CHARCOAL", label: "Charcoal Exhibition Carpet", color: "#1e293b" },
  ];

  const furniturePresets: { type: SceneObjectType; label: string; desc: string }[] = [
    { type: "RECEPTION_COUNTER", label: "Reception Desk Pod", desc: "Illuminated counter with front LED strip" },
    { type: "LED_VIDEO_WALL", label: "P2.6 LED Video Wall", desc: "High-refresh seamless display screen" },
    { type: "VIP_LOUNGE_SOFA", label: "VIP Lounge Sofa", desc: "Executive 2m plush designer sofa" },
    { type: "MEETING_TABLE", label: "Conference Meeting Table", desc: "Circular table with chrome pedestals" },
    { type: "TOUCHSCREEN_KIOSK", label: "55\" Touchscreen Kiosk", desc: "Digital interactive lead kiosk" },
    { type: "DISPLAY_PODIUM", label: "Product Display Plinth", desc: "Acrylic illuminated pedestal" },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
      
      {/* Control Tabs */}
      <div className="grid grid-cols-5 border-b border-slate-800 bg-slate-950/60 p-1 gap-1">
        <button
          onClick={() => setActiveTab("ai_cmd")}
          className={`py-2 text-[11px] font-semibold rounded-xl transition-all flex items-center justify-center gap-1 ${
            activeTab === "ai_cmd" ? "bg-cyan-500 text-slate-950 font-bold shadow-md" : "text-cyan-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI 3D</span>
        </button>

        <button
          onClick={() => setActiveTab("architecture")}
          className={`py-2 text-[11px] font-semibold rounded-xl transition-all flex items-center justify-center gap-1 ${
            activeTab === "architecture" ? "bg-cyan-500 text-slate-950 font-bold shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Walls</span>
        </button>

        <button
          onClick={() => setActiveTab("furniture")}
          className={`py-2 text-[11px] font-semibold rounded-xl transition-all flex items-center justify-center gap-1 ${
            activeTab === "furniture" ? "bg-cyan-500 text-slate-950 font-bold shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Objects</span>
        </button>

        <button
          onClick={() => setActiveTab("flooring")}
          className={`py-2 text-[11px] font-semibold rounded-xl transition-all flex items-center justify-center gap-1 ${
            activeTab === "flooring" ? "bg-cyan-500 text-slate-950 font-bold shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Floor</span>
        </button>

        <button
          onClick={() => setActiveTab("lighting")}
          className={`py-2 text-[11px] font-semibold rounded-xl transition-all flex items-center justify-center gap-1 ${
            activeTab === "lighting" ? "bg-cyan-500 text-slate-950 font-bold shadow-md" : "text-slate-400 hover:text-white"
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Lights</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        
        {/* TAB 0: AI 3D NATURAL LANGUAGE CONTROLLER */}
        {activeTab === "ai_cmd" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-4 h-4" /> AI 3D Natural Language Controller
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Type natural language spatial instructions to directly modify the 3D WebGL scene graph in real time.
              </p>
            </div>

            {/* Natural Language Command Bar */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="relative">
                <textarea
                  rows={2}
                  value={aiCmdInput}
                  onChange={(e) => setAiCmdInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleExecuteAi3DCommand();
                    }
                  }}
                  placeholder="e.g. Add two chairs beside the reception..."
                  className="w-full p-3 pr-10 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none leading-relaxed"
                />
                <button
                  type="button"
                  onClick={() => handleExecuteAi3DCommand()}
                  disabled={!aiCmdInput.trim()}
                  className="absolute right-2 bottom-2.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 disabled:opacity-40 transition-all"
                >
                  Execute
                </button>
              </div>

              {aiFeedback && (
                <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 font-mono">
                  ✨ {aiFeedback}
                </div>
              )}
            </div>

            {/* Quick 1-Click AI Commands */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                Try 1-Click Conversational Commands:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  "Add two chairs beside the reception",
                  "Add P2.6 curved LED video wall",
                  "Add VIP lounge sofa and coffee bar",
                  "Change flooring to warm oak timber",
                  "Add 55\" interactive touchscreen kiosk",
                  "Add product display plinth",
                ].map((cmd, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleExecuteAi3DCommand(cmd)}
                    className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80 hover:border-slate-700 text-xs text-left flex items-center justify-between group transition-all"
                  >
                    <span>"{cmd}"</span>
                    <span className="text-[10px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Apply →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: ARCHITECTURE & DIMENSIONS */}
        {activeTab === "architecture" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4" /> Real-Time Parametric Dimensions
            </h3>

            {/* Dimension Sliders */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Frontage Width:</span>
                  <span className="font-mono font-bold text-white">{config.stallWidth} meters</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="16"
                  step="0.5"
                  value={config.stallWidth}
                  onChange={(e) => onUpdateConfig({ stallWidth: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Depth:</span>
                  <span className="font-mono font-bold text-white">{config.stallDepth} meters</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="16"
                  step="0.5"
                  value={config.stallDepth}
                  onChange={(e) => onUpdateConfig({ stallDepth: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Height:</span>
                  <span className="font-mono font-bold text-white">{config.stallHeight} meters</span>
                </div>
                <input
                  type="range"
                  min="2.5"
                  max="6"
                  step="0.5"
                  value={config.stallHeight}
                  onChange={(e) => onUpdateConfig({ stallHeight: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800"
                />
              </div>
            </div>

            {/* Walls & Partitions Toggles */}
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Wall Systems & Partitions</h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs cursor-pointer hover:border-slate-700">
                <span className="text-slate-200">Solid Rear Back Wall</span>
                <input
                  type="checkbox"
                  checked={config.backWallEnabled}
                  onChange={(e) => onUpdateConfig({ backWallEnabled: e.target.checked })}
                  className="w-4 h-4 rounded accent-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs cursor-pointer hover:border-slate-700">
                <span className="text-slate-200">Left Enclosing Wall</span>
                <input
                  type="checkbox"
                  checked={config.leftWallEnabled}
                  onChange={(e) => onUpdateConfig({ leftWallEnabled: e.target.checked })}
                  className="w-4 h-4 rounded accent-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs cursor-pointer hover:border-slate-700">
                <span className="text-slate-200">Right Enclosing Wall</span>
                <input
                  type="checkbox"
                  checked={config.rightWallEnabled}
                  onChange={(e) => onUpdateConfig({ rightWallEnabled: e.target.checked })}
                  className="w-4 h-4 rounded accent-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs cursor-pointer hover:border-slate-700">
                <span className="text-slate-200">Meeting Room Glass Divider</span>
                <input
                  type="checkbox"
                  checked={config.meetingRoomDividerEnabled}
                  onChange={(e) => onUpdateConfig({ meetingRoomDividerEnabled: e.target.checked })}
                  className="w-4 h-4 rounded accent-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs cursor-pointer hover:border-slate-700">
                <span className="text-slate-200">Suspended Overhead Truss Ring</span>
                <input
                  type="checkbox"
                  checked={config.hangingBannerEnabled}
                  onChange={(e) => onUpdateConfig({ hangingBannerEnabled: e.target.checked })}
                  className="w-4 h-4 rounded accent-cyan-400"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 2: 3D FURNITURE & OBJECTS */}
        {activeTab === "furniture" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4" /> Add 3D Scene Fixtures
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {furniturePresets.map((preset) => (
                <button
                  key={preset.type}
                  onClick={() => onAddObject(preset.type)}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 text-left transition-all flex items-center justify-between group"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">{preset.label}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{preset.desc}</p>
                  </div>
                  <span className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                    <PlusCircle className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>

            {/* Active Scene Objects List */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Active 3D Fixtures ({config.objects.length})
              </span>
              <div className="space-y-1.5">
                {config.objects.map((obj) => (
                  <div
                    key={obj.id}
                    className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-white truncate">{obj.name}</span>
                    <button
                      onClick={() => onRemoveObject(obj.id)}
                      className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Remove object"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FLOORING & MATERIALS */}
        {activeTab === "flooring" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Platform Flooring Textures
            </h3>

            <div className="space-y-2.5">
              {flooringOptions.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => onUpdateConfig({ flooringType: opt.type })}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    config.flooringType === opt.type
                      ? "bg-cyan-500/15 border-cyan-400 text-white shadow-md shadow-cyan-500/20"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg border border-slate-700" style={{ backgroundColor: opt.color }} />
                    <span className="text-xs font-bold">{opt.label}</span>
                  </div>
                  {config.flooringType === opt.type && <Check className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs cursor-pointer">
                <span className="text-slate-200">Perimeter LED Under-Floor Glow</span>
                <input
                  type="checkbox"
                  checked={config.neonEdgeEnabled}
                  onChange={(e) => onUpdateConfig({ neonEdgeEnabled: e.target.checked })}
                  className="w-4 h-4 rounded accent-cyan-400"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 4: LIGHTING & ATMOSPHERE */}
        {activeTab === "lighting" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sun className="w-4 h-4" /> Theatrical Lighting Controls
            </h3>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Ambient Flood Light:</span>
                  <span className="font-mono text-white">{config.ambientLightIntensity}</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.5"
                  step="0.1"
                  value={config.ambientLightIntensity}
                  onChange={(e) => onUpdateConfig({ ambientLightIntensity: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Spotlight Gimbal Power:</span>
                  <span className="font-mono text-white">{config.spotlightIntensity}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.2"
                  value={config.spotlightIntensity}
                  onChange={(e) => onUpdateConfig({ spotlightIntensity: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Architectural Neon Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.neonEdgeColor}
                    onChange={(e) => onUpdateConfig({ neonEdgeColor: e.target.value })}
                    className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                  />
                  <input
                    type="text"
                    value={config.neonEdgeColor}
                    onChange={(e) => onUpdateConfig({ neonEdgeColor: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer Sync Indicator */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-mono text-[10px] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Synchronized to Project BOQ & Spec
        </span>
        <button
          onClick={() => confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } })}
          className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
        >
          Save 3D State
        </button>
      </div>

    </div>
  );
};
