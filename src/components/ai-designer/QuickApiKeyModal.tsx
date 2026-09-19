"use client";

import React, { useState, useEffect } from "react";
import { Key, CheckCircle2, AlertCircle, Sparkles, X, ExternalLink, ShieldCheck, RefreshCw, Eye, EyeOff } from "lucide-react";

interface QuickApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const QuickApiKeyModal: React.FC<QuickApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [currentConfig, setCurrentConfig] = useState<{
    connected: boolean;
    maskedKey: string;
    model: string;
  }>({
    connected: false,
    maskedKey: "",
    model: "Google Imagen 3 & Gemini Vision",
  });

  useEffect(() => {
    if (isOpen) {
      fetchCurrentConfig();
    }
  }, [isOpen]);

  const fetchCurrentConfig = async () => {
    try {
      const res = await fetch("/api/v1/ai/config");
      if (res.ok) {
        const data = await res.json();
        setCurrentConfig({
          connected: data.connected,
          maskedKey: data.maskedKey,
          model: data.model,
        });
        if (data.connected) {
          setStatusMessage({
            type: "success",
            text: `Connected • Active Key: ${data.maskedKey || "Saved"}`,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setStatusMessage({ type: "error", text: "Please enter your Google API key first." });
      return;
    }
    setIsTesting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/v1/ai/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: "success", text: "✓ Valid Key! Google Imagen 3 & Gemini Vision connected." });
      } else {
        setStatusMessage({ type: "error", text: data.message || "Invalid Key. Please check your Google AI Studio key." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Connection timed out. Please try again." });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      setStatusMessage({ type: "error", text: "Please enter a valid Google API key." });
      return;
    }
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/v1/ai/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: "success", text: "Google AI Key saved & activated successfully!" });
        setCurrentConfig((prev) => ({
          ...prev,
          connected: true,
          maskedKey: `AIzaSy••••••••••••${apiKey.trim().slice(-4)}`,
        }));
        setApiKey("");
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setStatusMessage({ type: "error", text: data.message || "Failed to activate API Key." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Error saving key. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Connect Google AI
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/30">
                  Imagen 3 & Gemini
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Enter your Google API Key for 8K architectural generation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Connection Status Pill */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                currentConfig.connected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span className="text-slate-300 font-mono text-[11px]">
              Status:{" "}
              <strong className={currentConfig.connected ? "text-emerald-400" : "text-amber-400"}>
                {currentConfig.connected ? "Connected" : "Not Connected"}
              </strong>
            </span>
          </div>
          {currentConfig.maskedKey && (
            <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
              {currentConfig.maskedKey}
            </span>
          )}
        </div>

        {/* API Key Input Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-slate-300 font-mono text-[11px]">
              Google API Key (GOOGLE_API_KEY)
            </label>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
            >
              Get Free Key <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={currentConfig.connected ? "Enter new key to replace..." : "AIzaSy..."}
              className="w-full p-3 pr-10 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white font-mono placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-2xl text-xs flex items-center gap-2 border ${
              statusMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : statusMessage.type === "error"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span className="leading-snug text-[11px]">{statusMessage.text}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting || !apiKey.trim()}
            className="py-2.5 px-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold font-mono flex items-center justify-center gap-1.5 disabled:opacity-40 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
            <span>{isTesting ? "Testing..." : "Test Key"}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveKey}
            disabled={isSaving || !apiKey.trim()}
            className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 disabled:opacity-40 transition-all active:scale-98"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save & Connect"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
