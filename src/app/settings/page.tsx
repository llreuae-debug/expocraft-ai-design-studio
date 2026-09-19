"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Settings, Shield, Globe, Key, Building2, Check, UserCheck } from "lucide-react";

export default function SettingsPage() {
  const { currentUser, allUsers, switchRole } = useAuth();
  const [defaultUnit, setDefaultUnit] = useState<"METERS" | "FEET">("METERS");
  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [vatRate, setVatRate] = useState("5.0");

  const rolesMatrix = [
    { role: "SUPER_ADMIN", desc: "Full global system access, database migrations, billing & settings.", users: "Alexander Sterling" },
    { role: "ADMIN", desc: "Project creation, estimation oversight, and team role assignments.", users: "Marcus Vance" },
    { role: "DESIGNER", desc: "AI 3D concept prompt generation, spatial layout, and render promotion.", users: "Elena Rostova" },
    { role: "ESTIMATOR", desc: "BOQ building, unit cost overrides, material pricing, and market rates.", users: "Tariq Al-Mansoor" },
    { role: "SALES", desc: "Client relationship management, quotation tuning, and PDF export.", users: "Sophia Chen" },
    { role: "CLIENT", desc: "Client portal view, 3D concept approval, and digital contract signing.", users: "David K. Hoffman" },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Settings className="w-5 h-5 text-cyan-400" />
              Platform Configuration & Role Permissions
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold border border-cyan-500/30">
              System Admin
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure default measurement units, multi-role RBAC permissions, and commercial tax presets.
          </p>
        </div>
      </div>

      {/* Role-Based Access Control Matrix */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <Shield className="w-4 h-4" /> Role-Based Access Control (RBAC) Architecture
        </h2>
        <p className="text-xs text-slate-400">
          Click any role below to instantly switch active persona and test role-specific UI privileges:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rolesMatrix.map((r) => {
            const isCurrent = currentUser.role === r.role;
            return (
              <div
                key={r.role}
                onClick={() => switchRole(r.role as any)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? "bg-cyan-500/15 border-cyan-400 shadow-lg shadow-cyan-500/20"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{r.role.replace('_', ' ')}</span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-md bg-cyan-400 text-slate-950 font-bold text-[10px] font-mono">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{r.desc}</p>
                </div>
                <div className="pt-2 mt-3 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                  Demo User: {r.users}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Provider Setup - Google AI Image Generation */}
      <AiSettingsCard />

      {/* Global Defaults */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-cyan-400" /> Default Platform Standards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Default Measurement Unit</label>
            <select
              value={defaultUnit}
              onChange={(e) => setDefaultUnit(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            >
              <option value="METERS">Metric (Meters & SQM)</option>
              <option value="FEET">Imperial (Feet & SQFT)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Default Currency</label>
            <select
              value={defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="AED">AED (AED)</option>
              <option value="SAR">SAR (SAR)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Default Standard VAT / Tax %</label>
            <input
              type="number"
              value={vatRate}
              onChange={(e) => setVatRate(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
            />
          </div>
        </div>
      </div>

    </div>
  );
}

function AiSettingsCard() {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState<{
    connected: boolean;
    status: string;
    providerName: string;
    model: string;
    maskedKey: string;
  }>({
    connected: false,
    status: "NOT_CONNECTED",
    providerName: "Google AI Imagen 3 & Gemini Visual Engine",
    model: "Google Imagen 3 (imagen-3.0-generate-002)",
    maskedKey: "",
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  React.useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/v1/ai/config");
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (e) {
      console.error("Failed to load AI config", e);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/v1/ai/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKeyInput || undefined }),
      });
      const data = await res.json();
      setStatusMessage(data.message);
      fetchConfig();
    } catch (err: any) {
      setStatusMessage(`Connection Failed: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/v1/ai/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKeyInput }),
      });
      const data = await res.json();
      setStatusMessage(data.message || "Key saved successfully.");
      setIsModalOpen(false);
      setApiKeyInput("");
      fetchConfig();
    } catch (err: any) {
      setStatusMessage(`Failed to save key: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = () => {
    switch (config.status) {
      case "CONNECTED":
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Connected
          </span>
        );
      case "INVALID_KEY":
        return (
          <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 font-mono text-xs font-bold border border-rose-500/30">
            Invalid Key
          </span>
        );
      case "QUOTA_ERROR":
        return (
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30">
            Quota/API Error
          </span>
        );
      case "CONNECTION_FAILED":
        return (
          <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 font-mono text-xs font-bold border border-rose-500/30">
            Connection Failed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 font-mono text-xs font-bold border border-slate-700">
            Not Connected
          </span>
        );
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Key className="w-4 h-4" /> AI Provider Setup
            </h2>
          </div>
          <p className="text-sm font-bold text-white mt-1">Google AI Image Generation</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Powers the 4-Concept generator, 8K architectural upscaling pipeline, and client quotation visuals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Active AI Engine</span>
          <p className="text-sm font-bold text-white font-mono">{config.model}</p>
          <p className="text-slate-400 text-[11px]">
            Target Output: 8K Presentation Quality (7680×4320) with architectural ray-tracing simulation.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Secure Server Secret</span>
          <p className="text-sm font-mono text-cyan-300 font-bold">
            {config.maskedKey || "No API key configured in server environment"}
          </p>
          <p className="text-slate-400 text-[11px]">
            Keys are strictly stored in server secrets and never exposed in client JavaScript.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs text-cyan-300 font-mono">
          ℹ️ {statusMessage}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Key className="w-3.5 h-3.5" />
          <span>Connect Google AI</span>
        </button>

        <button
          onClick={handleTestConnection}
          disabled={isTesting}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isTesting ? "Testing Connection..." : "Test Connection"}
        </button>
      </div>

      {/* Modal for setting Google API Key */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">Secure Setup</span>
                <h3 className="text-lg font-bold text-white mt-1">Configure Google AI Key</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your Google AI Studio API Key to enable 8K architectural render synthesis.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5 font-mono">
                  GOOGLE_API_KEY
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                  autoFocus
                />
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Masked upon save. Stored only in server environment/memory. Never exposed via public bundle.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-white">🔒 Enterprise Security Standards:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                  <li>Do NOT place keys in frontend JavaScript.</li>
                  <li>Do NOT commit keys to GitHub.</li>
                  <li>Use <code className="text-cyan-300 font-mono">.env.example</code> with blank template only.</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !apiKeyInput.trim()}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {isSaving ? "Validating & Saving..." : "Save & Verify Key"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

