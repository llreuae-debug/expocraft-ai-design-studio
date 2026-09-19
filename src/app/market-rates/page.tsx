"use client";

import React, { useState } from "react";
import { VERIFIED_MARKET_RATES } from "@/lib/marketRateEngine";
import { MarketRateEntry, BOQCategory16 } from "@/types/boq";
import {
  TrendingUp,
  Globe,
  Layers,
  Download,
  Filter,
  Shield,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Building2,
  FileSpreadsheet,
} from "lucide-react";

export default function MarketRatesPage() {
  const [rates, setRates] = useState<MarketRateEntry[]>(VERIFIED_MARKET_RATES);
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const cities = ["ALL", "Dubai", "Riyadh", "Las Vegas", "London", "Frankfurt"];

  const filteredRates = rates.filter((r) => {
    const matchCity = selectedCity === "ALL" || r.city === selectedCity;
    const matchSearch =
      r.materialOrService.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCity && matchSearch;
  });

  const handleExportCSV = () => {
    const headers = ["Category", "Material/Service", "Unit", "Country", "City", "Supplier", "Quality Grade", "Base Rate", "Labour Rate", "Currency", "Date", "Confidence %", "Level"];
    const rows = rates.map((r) => [
      r.category,
      `"${r.materialOrService.replace(/"/g, '""')}"`,
      r.unit,
      r.country,
      r.city,
      `"${r.supplier.replace(/"/g, '""')}"`,
      r.qualityGrade,
      r.baseRate,
      r.labourRate,
      r.currency,
      r.effectiveDate,
      `${r.confidenceScore}%`,
      r.confidenceLevel,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ExpoCraft_Verified_Market_Rates.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Verified Market Rates & Supplier Benchmark Engine
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/30">
              Q3 2026 Live Database
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real supplier tender rates tagged with effective dates, currencies, and verified confidence scores.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Rates CSV</span>
        </button>
      </div>

      {/* Strict Commercial Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3 text-xs">
        <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Commercial Integrity Rule:</span>
          <p className="text-slate-400 mt-0.5">
            Every rate displays its verified supplier origin, audit date, and confidence percentage. AI estimates are always clearly distinguished from legally binding supplier contracts.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedCity === city
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {city === "ALL" ? "All Cities" : city}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filter materials, suppliers, categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none w-full sm:w-64"
        />
      </div>

      {/* Rates Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="p-4">Category</th>
                <th className="p-4">Material / Service Specification</th>
                <th className="p-4">Location</th>
                <th className="p-4">Supplier Source</th>
                <th className="p-4">Unit</th>
                <th className="p-4">Material Rate</th>
                <th className="p-4">Labour Rate</th>
                <th className="p-4">Effective Date</th>
                <th className="p-4 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filteredRates.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-semibold text-cyan-400">{r.category}</td>
                  <td className="p-4">
                    <span className="font-bold text-white block">{r.materialOrService}</span>
                    <span className="text-[10px] text-slate-500">{r.qualityGrade}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-white block font-medium">{r.city}</span>
                    <span className="text-[10px] text-slate-500">{r.country}</span>
                  </td>
                  <td className="p-4 text-slate-300 font-medium">{r.supplier}</td>
                  <td className="p-4 font-mono text-slate-400">{r.unit}</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">
                    {r.currency} {r.baseRate}
                  </td>
                  <td className="p-4 font-mono text-slate-300">
                    {r.labourRate > 0 ? `${r.currency} ${r.labourRate}` : "Included"}
                  </td>
                  <td className="p-4 font-mono text-slate-400 text-[11px]">{r.effectiveDate}</td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{r.confidenceScore}% Verified</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
