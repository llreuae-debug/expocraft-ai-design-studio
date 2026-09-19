"use client";

import React, { useState } from "react";
import { useProjects } from "@/context/ProjectContext";
import { 
  STANDARD_SIZES, 
  OPEN_SIDES_OPTIONS, 
  STALL_TYPES, 
  INDUSTRIES, 
  DESIGN_STYLES, 
  FUNCTIONAL_ZONES 
} from "@/lib/constants";
import { LiveFootprintCanvas } from "./LiveFootprintCanvas";
import { convertDimension } from "@/lib/utils";
import { MeasurementUnit, OpenSides, StallType, IndustryType, DesignStyle } from "@/types";
import { 
  Building2, 
  Calendar, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  DollarSign, 
  Layers, 
  LayoutGrid, 
  MapPin, 
  Maximize2, 
  Palette, 
  Sparkles, 
  User, 
  X 
} from "lucide-react";
import confetti from "canvas-confetti";

export const ProjectCreationWizard: React.FC = () => {
  const { 
    isWizardOpen, 
    closeWizard, 
    wizardStep, 
    setWizardStep, 
    wizardDraft, 
    updateWizardDraft, 
    createProjectFromWizard 
  } = useProjects();

  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

  if (!isWizardOpen) return null;

  const totalSteps = 5;

  const handleUnitToggle = (newUnit: MeasurementUnit) => {
    if (newUnit === wizardDraft.unit) return;
    const newWidth = convertDimension(wizardDraft.width, wizardDraft.unit, newUnit);
    const newDepth = convertDimension(wizardDraft.depth, wizardDraft.unit, newUnit);
    const newHeight = convertDimension(wizardDraft.height, wizardDraft.unit, newUnit);
    const newMaxHeight = convertDimension(wizardDraft.maxHeightLimit, wizardDraft.unit, newUnit);

    updateWizardDraft({
      unit: newUnit,
      width: newWidth,
      depth: newDepth,
      height: newHeight,
      maxHeightLimit: newMaxHeight,
    });
  };

  const handleStandardSizeSelect = (presetId: string) => {
    const preset = STANDARD_SIZES.find((s) => s.id === presetId);
    if (!preset) return;

    if (preset.id === "custom") {
      // Keep current custom or set reasonable default
      return;
    }

    if (wizardDraft.unit === "METERS") {
      updateWizardDraft({
        width: preset.widthMeters,
        depth: preset.depthMeters,
        height: preset.heightMeters,
      });
    } else {
      updateWizardDraft({
        width: preset.widthFeet,
        depth: preset.depthFeet,
        height: preset.heightFeet,
      });
    }
  };

  const toggleFunctionalZone = (zoneId: string) => {
    const current = [...wizardDraft.functionalZones];
    const idx = current.indexOf(zoneId);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(zoneId);
    }
    updateWizardDraft({ functionalZones: current });
  };

  const handleNextStep = () => {
    if (wizardStep < totalSteps) {
      setWizardStep(wizardStep + 1);
    } else {
      // Final Submit
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      createProjectFromWizard(wizardDraft);
    }
  };

  const handlePrevStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Wizard Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">Project Creation Wizard</h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-400">
                  Step {wizardStep} of {totalSteps}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Setup exhibition stall parameters, dimensions, technical specs & commercial targets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Step Indicators */}
            <div className="hidden md:flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setWizardStep(s)}
                  className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                    s === wizardStep
                      ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 ring-2 ring-cyan-400/40"
                      : s < wizardStep
                      ? "bg-slate-800 text-cyan-400 border border-cyan-500/30"
                      : "bg-slate-800/60 text-slate-500"
                  }`}
                >
                  {s < wizardStep ? <Check className="w-3.5 h-3.5" /> : s}
                </button>
              ))}
            </div>

            <button
              onClick={closeWizard}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wizard Body (2 Column: Inputs + Live Footprint Preview) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left / Main Input Form (7 cols) */}
          <div className="lg:col-span-7 p-6 md:p-8 space-y-6 overflow-y-auto border-r border-slate-800/80">
            
            {/* STEP 1: Project & Client Basics */}
            {wizardStep === 1 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-cyan-400" />
                    1. Project & Client Information
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter the central identity details for this exhibition project.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Project / Stand Name <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NovaTech AI Experience Pavilion"
                      value={wizardDraft.projectName}
                      onChange={(e) => updateWizardDraft({ projectName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Client / Company Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. NovaTech AI Systems"
                        value={wizardDraft.clientCompanyName}
                        onChange={(e) => updateWizardDraft({ clientCompanyName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Key Contact Person
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. David Hoffman (VP Marketing)"
                        value={wizardDraft.contactPerson}
                        onChange={(e) => updateWizardDraft({ contactPerson: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Contact Email <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. david@novatech-ai.com"
                        value={wizardDraft.contactEmail}
                        onChange={(e) => updateWizardDraft({ contactEmail: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +971 50 123 4567"
                        value={wizardDraft.contactPhone}
                        onChange={(e) => updateWizardDraft({ contactPhone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Client Country
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. United Arab Emirates"
                        value={wizardDraft.clientCountry}
                        onChange={(e) => updateWizardDraft({ clientCountry: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Client City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dubai"
                        value={wizardDraft.clientCity}
                        onChange={(e) => updateWizardDraft({ clientCity: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        TRN / VAT Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1002938475"
                        value={wizardDraft.clientVatNumber || ""}
                        onChange={(e) => updateWizardDraft({ clientVatNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Exhibition & Venue Details */}
            {wizardStep === 2 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    2. Exhibition & Venue Information
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Specify event location, hall allocation and build/move-in schedules.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Exhibition / Trade Show Name <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. GITEX GLOBAL, Arab Health, CES, Big 5 Global"
                      value={wizardDraft.exhibitionName}
                      onChange={(e) => updateWizardDraft({ exhibitionName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Venue / Convention Center <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dubai World Trade Centre (DWTC)"
                        value={wizardDraft.venue}
                        onChange={(e) => updateWizardDraft({ venue: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">City</label>
                        <input
                          type="text"
                          placeholder="Dubai"
                          value={wizardDraft.city}
                          onChange={(e) => updateWizardDraft({ city: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Country</label>
                        <input
                          type="text"
                          placeholder="UAE"
                          value={wizardDraft.country}
                          onChange={(e) => updateWizardDraft({ country: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Hall Number</label>
                      <input
                        type="text"
                        placeholder="e.g. Hall 7 / Sheikh Saeed Hall"
                        value={wizardDraft.hallNumber}
                        onChange={(e) => updateWizardDraft({ hallNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">Stall / Booth Number</label>
                      <input
                        type="text"
                        placeholder="e.g. Stand H7-B20"
                        value={wizardDraft.stallNumber}
                        onChange={(e) => updateWizardDraft({ stallNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Event Timeline & Build Window</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Show Dates (Start to End)</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            value={wizardDraft.startDate}
                            onChange={(e) => updateWizardDraft({ startDate: e.target.value })}
                            className="px-2.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                          />
                          <input
                            type="date"
                            value={wizardDraft.endDate}
                            onChange={(e) => updateWizardDraft({ endDate: e.target.value })}
                            className="px-2.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Build / Move-in Window</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            value={wizardDraft.moveInDate}
                            onChange={(e) => updateWizardDraft({ moveInDate: e.target.value })}
                            className="px-2.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                          />
                          <input
                            type="date"
                            value={wizardDraft.moveOutDate}
                            onChange={(e) => updateWizardDraft({ moveOutDate: e.target.value })}
                            className="px-2.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Stall Dimensions, Units & Orientation */}
            {wizardStep === 3 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Maximize2 className="w-5 h-5 text-cyan-400" />
                      3. Stall Dimensions & Structure
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Choose standard size presets or input custom metric/imperial dimensions.
                    </p>
                  </div>

                  {/* Metric / Imperial Switcher */}
                  <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleUnitToggle("METERS")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        wizardDraft.unit === "METERS"
                          ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Meters (m)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUnitToggle("FEET")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        wizardDraft.unit === "FEET"
                          ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Feet (ft)
                    </button>
                  </div>
                </div>

                {/* Standard Sizes Quick Grid */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Standard Size Presets ({wizardDraft.unit === "METERS" ? "Metric in meters" : "Imperial in feet"})
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STANDARD_SIZES.map((preset) => {
                      const isSelected =
                        wizardDraft.unit === "METERS"
                          ? wizardDraft.width === preset.widthMeters && wizardDraft.depth === preset.depthMeters
                          : wizardDraft.width === preset.widthFeet && wizardDraft.depth === preset.depthFeet;

                      const label = wizardDraft.unit === "METERS" ? preset.labelMeters : preset.labelFeet;

                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleStandardSizeSelect(preset.id)}
                          className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                            isSelected
                              ? "bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/20 text-white"
                              : "bg-slate-800/70 border-slate-700/80 hover:border-slate-600 text-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs">{label}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900/80 text-cyan-300 font-mono">
                              {preset.tag}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">{preset.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dimension Inputs */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Width (Frontage) ({wizardDraft.unit === "METERS" ? "m" : "ft"})
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        value={wizardDraft.width}
                        onChange={(e) => updateWizardDraft({ width: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold text-sm focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Depth ({wizardDraft.unit === "METERS" ? "m" : "ft"})
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        value={wizardDraft.depth}
                        onChange={(e) => updateWizardDraft({ depth: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold text-sm focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Height ({wizardDraft.unit === "METERS" ? "m" : "ft"})
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        value={wizardDraft.height}
                        onChange={(e) => updateWizardDraft({ height: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold text-sm focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Open Sides Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Stall Orientation & Open Sides <span className="text-cyan-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {OPEN_SIDES_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateWizardDraft({ openSides: opt.value })}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          wizardDraft.openSides === opt.value
                            ? "bg-cyan-500/15 border-cyan-400 shadow-lg shadow-cyan-500/20 text-white"
                            : "bg-slate-800/60 border-slate-700/80 hover:border-slate-600 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-white">{opt.label}</span>
                          <span className="text-[10px] font-mono text-cyan-300">{opt.walls}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{opt.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stall Type Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Stall Fabrication Type & System <span className="text-cyan-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {STALL_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => updateWizardDraft({ stallType: type.value })}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          wizardDraft.stallType === type.value
                            ? "bg-cyan-500/15 border-cyan-400 text-white"
                            : "bg-slate-800/60 border-slate-700/80 hover:border-slate-600 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{type.label}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 font-medium">
                            {type.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{type.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Design Style & Industry Brief */}
            {wizardStep === 4 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-cyan-400" />
                    4. Design Style, Industry & Requirements
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Select target industry vertical, architectural aesthetic, and key functional zones.
                  </p>
                </div>

                {/* Industry Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Industry Vertical <span className="text-cyan-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {INDUSTRIES.map((ind) => (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => updateWizardDraft({ industry: ind })}
                        className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                          wizardDraft.industry === ind
                            ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400"
                            : "bg-slate-800/70 border-slate-700 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Design Style */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Design Aesthetic Style <span className="text-cyan-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {DESIGN_STYLES.map((style) => (
                      <button
                        key={style.name}
                        type="button"
                        onClick={() => updateWizardDraft({ designStyle: style.name })}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          wizardDraft.designStyle === style.name
                            ? "bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/20 text-white"
                            : "bg-slate-800/60 border-slate-700/80 hover:border-slate-600 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-white">{style.name}</span>
                          <div className="flex items-center gap-1">
                            {style.colors.map((c, i) => (
                              <div
                                key={i}
                                className="w-2.5 h-2.5 rounded-full border border-slate-900"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{style.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Functional Zones Checklist */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Required Functional Zones & Features
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FUNCTIONAL_ZONES.map((zone) => {
                      const isChecked = wizardDraft.functionalZones.includes(zone.id);
                      return (
                        <button
                          key={zone.id}
                          type="button"
                          onClick={() => toggleFunctionalZone(zone.id)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                            isChecked
                              ? "bg-cyan-500/20 border-cyan-400 text-white font-semibold"
                              : "bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <span className="truncate mr-1">{zone.label}</span>
                          <div
                            className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                              isChecked ? "bg-cyan-400 text-slate-950 font-bold" : "border border-slate-600"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Special Requirements */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Special Design Brief & Feature Requests
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Curved double-height entrance arch, LED halo ring suspended from DWTC ceiling, lockable storage room with refrigerator and counter."
                    value={wizardDraft.specialRequirements}
                    onChange={(e) => updateWizardDraft({ specialRequirements: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: Commercial Targets & Budget */}
            {wizardStep === 5 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    5. Budget, Commercial Targets & Review
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Set target estimation boundaries and review project summary before creation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Currency</label>
                    <select
                      value={wizardDraft.currency}
                      onChange={(e) => updateWizardDraft({ currency: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-semibold focus:border-cyan-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="AED">AED (AED)</option>
                      <option value="SAR">SAR (SAR)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Target Budget Min ({wizardDraft.currency})
                    </label>
                    <input
                      type="number"
                      step="1000"
                      value={wizardDraft.targetBudgetMin}
                      onChange={(e) => updateWizardDraft({ targetBudgetMin: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold text-sm focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Target Budget Max ({wizardDraft.currency})
                    </label>
                    <input
                      type="number"
                      step="1000"
                      value={wizardDraft.targetBudgetMax}
                      onChange={(e) => updateWizardDraft({ targetBudgetMax: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold text-sm focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Client Stated Budget (if provided)
                    </label>
                    <input
                      type="number"
                      step="1000"
                      placeholder="e.g. 45000"
                      value={wizardDraft.clientBudgetStated || ""}
                      onChange={(e) => updateWizardDraft({ clientBudgetStated: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Target Profit Margin %
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="60"
                      value={wizardDraft.targetMarginPercent}
                      onChange={(e) => updateWizardDraft({ targetMarginPercent: parseFloat(e.target.value) || 25 })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Final Summary Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Project Specification Summary
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold">
                      Ready for Generation
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Client</span>
                      <span className="font-semibold text-white truncate block">
                        {wizardDraft.clientCompanyName || "NovaTech AI"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Event</span>
                      <span className="font-semibold text-white truncate block">
                        {wizardDraft.exhibitionName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Size & Orientation</span>
                      <span className="font-semibold text-cyan-300 block font-mono">
                        {wizardDraft.width}×{wizardDraft.depth} {wizardDraft.unit === "METERS" ? "m" : "ft"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Theme</span>
                      <span className="font-semibold text-white truncate block">
                        {wizardDraft.designStyle}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Footprint & Overview Canvas (5 cols) */}
          <div className="lg:col-span-5 p-6 md:p-8 bg-slate-950/70 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <LayoutGrid className="w-4 h-4 text-cyan-400" />
                  Real-Time Stall Preview
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Auto-Updating</span>
              </div>

              {/* Live Canvas Component */}
              <LiveFootprintCanvas
                width={wizardDraft.width}
                depth={wizardDraft.depth}
                height={wizardDraft.height}
                unit={wizardDraft.unit}
                openSides={wizardDraft.openSides}
                stallType={wizardDraft.stallType}
                primaryColor={wizardDraft.primaryColor}
                functionalZones={wizardDraft.functionalZones}
              />
            </div>

            {/* Quick Brief Meta Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Target Industry:</span>
                <span className="font-semibold text-cyan-300">{wizardDraft.industry}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Fabrication:</span>
                <span className="font-medium text-white">{wizardDraft.stallType.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Active Zones:</span>
                <span className="font-mono text-emerald-400">{wizardDraft.functionalZones.length} Zones Selected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wizard Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/95 sticky bottom-0 z-20">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={wizardStep === 1}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              wizardStep === 1
                ? "opacity-30 cursor-not-allowed text-slate-500"
                : "bg-slate-800 hover:bg-slate-700 text-white"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Step
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={closeWizard}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95"
            >
              {wizardStep === totalSteps ? (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  Create Project & Initialize Workflow
                </>
              ) : (
                <>
                  Next Step
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
