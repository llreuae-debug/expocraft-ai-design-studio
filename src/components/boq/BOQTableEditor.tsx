"use client";

import React, { useState } from "react";
import { DetailedBOQLineItem, BOQCategory16 } from "@/types/boq";
import {
  FileSpreadsheet,
  PlusCircle,
  Trash2,
  Download,
  Filter,
  Shield,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface BOQTableEditorProps {
  items: DetailedBOQLineItem[];
  currency: string;
  onUpdateItems: (newItems: DetailedBOQLineItem[]) => void;
}

const CATEGORIES_16: BOQCategory16[] = [
  "Structure",
  "Carpentry",
  "MDF/Plywood",
  "Aluminum",
  "Glass",
  "Acrylic",
  "Flooring",
  "Printing",
  "Branding",
  "Furniture",
  "Lighting",
  "Electrical",
  "AV",
  "Transport",
  "Installation",
  "Dismantling",
];

export const BOQTableEditor: React.FC<BOQTableEditorProps> = ({
  items,
  currency,
  onUpdateItems,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const handleFieldChange = (
    id: string,
    field: keyof DetailedBOQLineItem,
    value: any
  ) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value, isCustomModified: true };

        // Recalculate totals
        if (field === "quantity" || field === "unitRate" || field === "labourCost" || field === "markupPercent") {
          const qty = field === "quantity" ? parseFloat(value) || 0 : item.quantity;
          const rate = field === "unitRate" ? parseFloat(value) || 0 : item.unitRate;
          const labour = field === "labourCost" ? parseFloat(value) || 0 : item.labourCost;
          const markup = field === "markupPercent" ? parseFloat(value) || 0 : item.markupPercent;

          const totalCost = qty * (rate + labour);
          const clientRate = Number(((rate + labour) * (1 + markup / 100)).toFixed(2));
          const totalClientPrice = Number((qty * clientRate).toFixed(2));

          newItem.totalCost = totalCost;
          newItem.clientRate = clientRate;
          newItem.totalClientPrice = totalClientPrice;
        }
        return newItem;
      }
      return item;
    });
    onUpdateItems(updated);
  };

  const handleAddNewRow = () => {
    const newRow: DetailedBOQLineItem = {
      id: `boq-custom-${Date.now()}`,
      category: "Carpentry",
      itemCode: `CST-${items.length + 1}`,
      description: "Custom Bespoke Exhibition Feature Element",
      quantity: 1,
      unit: "unit",
      material: "High Grade Materials",
      unitRate: 500,
      labourCost: 150,
      totalCost: 650,
      markupPercent: 30,
      clientRate: 845,
      totalClientPrice: 845,
      supplierSource: "Verified Supplier Quotation",
      confidenceScore: 95,
      confidenceLevel: "VERIFIED_SUPPLIER",
      isCustomModified: true,
    };
    onUpdateItems([...items, newRow]);
  };

  const handleDeleteRow = (id: string) => {
    onUpdateItems(items.filter((i) => i.id !== id));
  };

  const filteredItems = items.filter((item) => {
    const matchCat = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchSearch =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalBaseCost = items.reduce((acc, i) => acc + i.totalCost, 0);
  const totalClientPrice = items.reduce((acc, i) => acc + i.totalClientPrice, 0);
  const totalGrossProfit = totalClientPrice - totalBaseCost;
  const overallMarginPercent = totalClientPrice > 0 ? ((totalGrossProfit / totalClientPrice) * 100).toFixed(1) : "0";

  const handleExportCSV = () => {
    const headers = ["Category", "Code", "Description", "Qty", "Unit", "Material", "Unit Rate", "Labour", "Total Cost", "Client Rate", "Total Client Price", "Source", "Confidence"];
    const rows = items.map((i) => [
      i.category,
      i.itemCode,
      `"${i.description.replace(/"/g, '""')}"`,
      i.quantity,
      i.unit,
      `"${i.material.replace(/"/g, '""')}"`,
      i.unitRate,
      i.labourCost,
      i.totalCost,
      i.clientRate,
      i.totalClientPrice,
      `"${i.supplierSource || ''}"`,
      `${i.confidenceScore || 95}%`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ExpoCraft_BOQ_16Categories.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      
      {/* Financial Summary Top Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Material & Labour Cost</span>
          <div className="text-lg font-bold text-slate-200 font-mono mt-0.5">
            ${totalBaseCost.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Client Selling Price</span>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
            ${totalClientPrice.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Gross Profit Value</span>
          <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
            ${totalGrossProfit.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Realized Margin %</span>
          <div className="text-lg font-bold text-amber-300 font-mono mt-0.5">{overallMarginPercent}%</div>
        </div>
      </div>

      {/* 16 Category Filtering Ribbon */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            16 Commercial Trade Categories
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleAddNewRow}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Custom Line</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              selectedCategory === "ALL"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            All 16 Categories ({items.length})
          </button>
          {CATEGORIES_16.map((cat) => {
            const count = items.filter((i) => i.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {cat} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editable BOQ Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="p-3.5">Category & Code</th>
                <th className="p-3.5 min-w-[200px]">Description</th>
                <th className="p-3.5 w-20">Qty</th>
                <th className="p-3.5 w-16">Unit</th>
                <th className="p-3.5 min-w-[160px]">Material Spec</th>
                <th className="p-3.5 w-24">Unit Rate</th>
                <th className="p-3.5 w-24">Labour</th>
                <th className="p-3.5 w-24 text-right">Total Price</th>
                <th className="p-3.5 min-w-[140px]">Source / Confidence</th>
                <th className="p-3.5 w-10 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
                  
                  {/* Category & Code */}
                  <td className="p-3.5">
                    <span className="font-semibold text-cyan-400 text-xs block">{item.category}</span>
                    <span className="font-mono text-[10px] text-slate-500">{item.itemCode}</span>
                  </td>

                  {/* Description */}
                  <td className="p-3.5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleFieldChange(item.id, "description", e.target.value)}
                      className="w-full px-2 py-1 rounded bg-slate-950/60 border border-slate-800 text-white text-xs focus:border-cyan-500"
                    />
                  </td>

                  {/* Qty */}
                  <td className="p-3.5">
                    <input
                      type="number"
                      step="0.1"
                      value={item.quantity}
                      onChange={(e) => handleFieldChange(item.id, "quantity", e.target.value)}
                      className="w-16 px-2 py-1 rounded bg-slate-950/60 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500"
                    />
                  </td>

                  {/* Unit */}
                  <td className="p-3.5 font-mono text-slate-400 text-[11px]">{item.unit}</td>

                  {/* Material */}
                  <td className="p-3.5">
                    <input
                      type="text"
                      value={item.material}
                      onChange={(e) => handleFieldChange(item.id, "material", e.target.value)}
                      className="w-full px-2 py-1 rounded bg-slate-950/60 border border-slate-800 text-slate-300 text-xs focus:border-cyan-500"
                    />
                  </td>

                  {/* Unit Rate */}
                  <td className="p-3.5">
                    <input
                      type="number"
                      value={item.unitRate}
                      onChange={(e) => handleFieldChange(item.id, "unitRate", e.target.value)}
                      className="w-20 px-2 py-1 rounded bg-slate-950/60 border border-slate-800 text-slate-200 font-mono text-xs focus:border-cyan-500"
                    />
                  </td>

                  {/* Labour */}
                  <td className="p-3.5">
                    <input
                      type="number"
                      value={item.labourCost}
                      onChange={(e) => handleFieldChange(item.id, "labourCost", e.target.value)}
                      className="w-20 px-2 py-1 rounded bg-slate-950/60 border border-slate-800 text-slate-200 font-mono text-xs focus:border-cyan-500"
                    />
                  </td>

                  {/* Total Price */}
                  <td className="p-3.5 font-mono font-bold text-right text-emerald-400 text-xs">
                    ${item.totalClientPrice.toLocaleString()}
                  </td>

                  {/* Source & Confidence */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span className="text-[10px] text-slate-400 truncate max-w-[100px]" title={item.supplierSource}>
                        {item.supplierSource || "Supplier Tender"}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 text-[9px] font-mono font-bold">
                        {item.confidenceScore || 98}%
                      </span>
                    </div>
                  </td>

                  {/* Delete Action */}
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleDeleteRow(item.id)}
                      className="p-1 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                      title="Delete line"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
