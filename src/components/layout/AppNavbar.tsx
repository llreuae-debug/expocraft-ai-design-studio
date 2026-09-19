"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/context/ProjectContext";
import { useI18n } from "@/context/I18nContext";
import { UserRole } from "@/types";
import { SupportedLanguage, SupportedCurrency } from "@/types/i18n";
import {
  Bell,
  Check,
  ChevronDown,
  Globe,
  PlusCircle,
  Search,
  Shield,
  Sparkles,
  Coins,
  Key,
} from "lucide-react";
import { QuickApiKeyModal } from "@/components/ai-designer/QuickApiKeyModal";

export const AppNavbar: React.FC = () => {
  const { currentUser, allUsers, switchRole } = useAuth();
  const { searchTerm, setSearchTerm, openWizard } = useProjects();
  const { currentLanguage, allLanguages, setLanguage, currentCurrency, allCurrencies, setCurrency } = useI18n();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [curMenuOpen, setCurMenuOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const roleColors: Record<UserRole, string> = {
    SUPER_ADMIN: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    ADMIN: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    DESIGNER: "bg-pink-500/20 text-pink-300 border-pink-500/40",
    ESTIMATOR: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    SALES: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    CLIENT: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  };

  const activeLangConfig = allLanguages.find((l) => l.code === currentLanguage) || allLanguages[0];
  const activeCurConfig = allCurrencies.find((c) => c.code === currentCurrency) || allCurrencies[0];

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      
      {/* Left: Global Search & Active Project */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects, client companies, exhibitions, venues, materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all"
          />
        </div>
      </div>

      {/* Right Controls: Language, Currency, Role Switcher, Quick Actions */}
      <div className="flex items-center gap-2.5">
        
        {/* Language Selector (12 Languages + LTR/RTL support) */}
        <div className="relative">
          <button
            onClick={() => {
              setLangMenuOpen(!langMenuOpen);
              setCurMenuOpen(false);
              setRoleMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-all"
            title="Switch Language (12 Languages + RTL/LTR)"
          >
            <span className="text-sm">{activeLangConfig.flag}</span>
            <span className="hidden md:inline text-[11px] font-medium">{activeLangConfig.nativeName}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Language & Direction (LTR/RTL)
              </div>
              <div className="space-y-0.5">
                {allLanguages.map((l) => {
                  const isSelected = l.code === currentLanguage;
                  return (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all ${
                        isSelected
                          ? "bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.nativeName}</span>
                        <span className="text-[10px] text-slate-500">({l.direction.toUpperCase()})</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Currency Selector (10 Currencies: PKR, USD, EUR, GBP, AED, SAR, QAR, TRY, INR, CNY) */}
        <div className="relative">
          <button
            onClick={() => {
              setCurMenuOpen(!curMenuOpen);
              setLangMenuOpen(false);
              setRoleMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-all font-mono"
            title="Switch Currency & Multi-Rate Calculation"
          >
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold text-emerald-400">{activeCurConfig.code}</span>
            <span className="hidden lg:inline text-[10px] text-slate-400">({activeCurConfig.symbol})</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {curMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Multi-Currency Engine (10 Rates)
              </div>
              <div className="space-y-0.5">
                {allCurrencies.map((c) => {
                  const isSelected = c.code === currentCurrency;
                  return (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code);
                        setCurMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all ${
                        isSelected
                          ? "bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-400">{c.code}</span>
                        <span className="text-slate-400 text-[11px]">{c.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">{c.rateAgainstUSD}x</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setRoleMenuOpen(!roleMenuOpen);
              setLangMenuOpen(false);
              setCurMenuOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-all shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline text-[11px] text-slate-400">Role:</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${roleColors[currentUser.role]}`}
            >
              {currentUser.role.replace("_", " ")}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Role / Persona Demo
              </div>
              <div className="py-1 space-y-1">
                {allUsers.map((user) => {
                  const isSelected = user.role === currentUser.role;
                  return (
                    <button
                      key={user.role}
                      onClick={() => {
                        switchRole(user.role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                        isSelected
                          ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-left truncate">
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <div className="truncate">
                          <div className="truncate text-xs">{user.name}</div>
                          <div className="text-[10px] text-slate-500">{user.role.replace("_", " ")}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick Google AI Connect Button */}
        <button
          onClick={() => setIsApiKeyModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 transition-all"
          title="Connect or Test Google AI API Key"
        >
          <Key className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden lg:inline text-[11px] font-semibold">Google AI</span>
        </button>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-950" />
        </button>

        {/* Wizard Trigger in Header */}
        <button
          onClick={openWizard}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Project</span>
        </button>

      </div>

      {/* Global Quick API Key Setup Modal */}
      <QuickApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </header>
  );
};
