"use client";

import React, { useState } from "react";
import { Project } from "@/types";
import { MasterQuotationData } from "@/types/execution";
import { formatCurrency } from "@/lib/utils";
import {
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Download,
  Building2,
  Calendar,
  Maximize2,
  Edit3,
  DollarSign,
  PlusCircle,
  X,
  Share2,
} from "lucide-react";
import confetti from "canvas-confetti";

interface MasterQuotationBuilderProps {
  project: Project;
  onSaveQuotation?: (data: MasterQuotationData) => void;
}

export const MasterQuotationBuilder: React.FC<MasterQuotationBuilderProps> = ({
  project,
  onSaveQuotation,
}) => {
  const [quotation, setQuotation] = useState<MasterQuotationData>({
    quotationNumber: `QT-2026-${project.projectCode.replace("EXP-2026-", "")}-V1`,
    version: 1,
    issueDate: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    
    clientCompanyName: project.client.companyName,
    clientContactPerson: project.client.contactPerson,
    clientEmail: project.client.email,
    clientPhone: project.client.phone,
    clientCity: project.client.city,
    clientCountry: project.client.country,
    clientVatNumber: project.client.vatNumber || "TRN-100293847500003",
    
    projectName: project.name,
    exhibitionName: project.exhibition.exhibitionName,
    venue: project.exhibition.venue,
    hallNumber: project.exhibition.hallNumber || "Hall 7",
    stallNumber: project.exhibition.stallNumber || "Stand H7-B20",
    stallDimensions: `${project.dimensions.width}×${project.dimensions.depth}m (H: ${project.dimensions.height}m)`,
    totalAreaSqm: project.dimensions.totalAreaSqm,
    
    materialSubtotal: 38450,
    labourSubtotal: 14850,
    installationCost: 8900,
    dismantlingCost: 4200,
    transportFreightCost: 2400,
    overheadMarginPercent: 20,
    overheadMarginAmount: 13760,
    discountAmount: 2500,
    vatPercent: 5,
    vatAmount: 4003,
    grandTotal: 84063,
    currency: project.budget.currency || "USD",
    
    paymentTerms: "50% Upon Contract Execution, 40% Onsite Handover Inspection, 10% Post-Event Settlement within 14 Days.",
    validityTerms: "This commercial quotation is valid for 14 calendar days from the date of issue.",
    legalTermsAndConditions: "Includes all DWTC / Venue Civil Defense safety approvals, electrical compliance certificates, 24/7 onsite standby technician during exhibition hours, and licensed teardown waste clearance.",
    status: "SENT",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (field: keyof MasterQuotationData, value: any) => {
    const updated = { ...quotation, [field]: value };

    // Recalculate commercials
    const directCosts =
      updated.materialSubtotal +
      updated.labourSubtotal +
      updated.installationCost +
      updated.dismantlingCost +
      updated.transportFreightCost;

    const overheadAmount = (directCosts * updated.overheadMarginPercent) / 100;
    const subtotalWithMargin = directCosts + overheadAmount - updated.discountAmount;
    const vat = (subtotalWithMargin * updated.vatPercent) / 100;
    const total = subtotalWithMargin + vat;

    updated.overheadMarginAmount = Number(overheadAmount.toFixed(2));
    updated.vatAmount = Number(vat.toFixed(2));
    updated.grandTotal = Number(total.toFixed(2));

    setQuotation(updated);
    if (onSaveQuotation) onSaveQuotation(updated);
  };

  const handleApprove = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    handleUpdate("status", "ACCEPTED");
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              Master Exhibition Quotation Builder
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/30">
              Contract Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Client-ready commercial proposal with embedded 3D concepts, technical takeoff, itemized BOQ, and full manual editing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isEditing
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? "Editing Mode Active" : "Toggle Edit Fields"}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print to PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable Master Quotation Sheet */}
      <div className="max-w-5xl mx-auto p-8 md:p-12 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-8 text-slate-200 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        
        {/* 1. Header & Brand Masthead */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-800 pb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-white font-display tracking-tight">ExpoCraft</span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono text-[10px] font-bold">
                Official Proposal
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Exhibition Design, Estimation & Turnkey Fabrication LLC</p>
            <p className="text-xs text-slate-500">Dubai World Trade Centre, UAE • London • Frankfurt • Las Vegas</p>
            <p className="text-xs text-slate-500">Contact: proposals@expocraft.io • +971 4 800 EXPO</p>
          </div>

          <div className="text-right space-y-1">
            <span className="font-mono text-sm font-bold text-cyan-400 px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800 inline-block">
              {quotation.quotationNumber}
            </span>
            <div className="text-xs text-slate-400 pt-1">
              <span>Issue Date: </span>
              {isEditing ? (
                <input
                  type="date"
                  value={quotation.issueDate}
                  onChange={(e) => handleUpdate("issueDate", e.target.value)}
                  className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                />
              ) : (
                <span className="font-mono text-white">{quotation.issueDate}</span>
              )}
            </div>
            <div className="text-xs text-slate-400">
              <span>Valid Until: </span>
              {isEditing ? (
                <input
                  type="date"
                  value={quotation.validUntil}
                  onChange={(e) => handleUpdate("validUntil", e.target.value)}
                  className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                />
              ) : (
                <span className="font-mono text-white">{quotation.validUntil}</span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Client Info & Exhibition Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">Client Organization</span>
            <h3 className="text-sm font-bold text-white">{quotation.clientCompanyName}</h3>
            <p className="text-slate-300">Attention: {quotation.clientContactPerson}</p>
            <p className="text-slate-400">Email: {quotation.clientEmail} • Phone: {quotation.clientPhone}</p>
            <p className="text-slate-400">Location: {quotation.clientCity}, {quotation.clientCountry}</p>
            <p className="text-slate-500 font-mono">Tax/TRN: {quotation.clientVatNumber}</p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">Exhibition Venue & Stand Location</span>
            <h3 className="text-sm font-bold text-white">{quotation.exhibitionName}</h3>
            <p className="text-slate-300">Venue: {quotation.venue} ({quotation.hallNumber})</p>
            <p className="text-slate-400">Stand Location: {quotation.stallNumber}</p>
            <p className="text-slate-400">Dimensions: {quotation.stallDimensions} ({quotation.totalAreaSqm} m² / {project.dimensions.totalAreaSqft} sqft)</p>
            <p className="text-slate-500">Orientation: {project.dimensions.openSides.replace(/_/g, " ")}</p>
          </div>
        </div>

        {/* 3. Embedded 3D Design Renderings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Architectural 3D Visualization Concepts
            </span>
            <span className="text-[10px] font-mono text-slate-500">Embedded 4-Perspective Visuals</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Front Elevation", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80" },
              { label: "Corner 3/4 Aisle", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80" },
              { label: "VIP Hospitality", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80" },
              { label: "Alternative Form", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80" },
            ].map((render, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <img src={render.img} alt={render.label} className="w-full h-24 object-cover" />
                <div className="p-2 text-center text-[10px] font-semibold text-slate-300">{render.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Commercial Execution Breakdown Table */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
            Itemized Commercial Execution Summary
          </span>

          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/60 text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Execution Component</th>
                  <th className="p-3.5">Scope Description</th>
                  <th className="p-3.5 text-right">Amount ({quotation.currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="p-3.5 font-bold text-white">1. Materials & Fabrication</td>
                  <td className="p-3.5 text-slate-400">Raised floor, structural MDF walls, P2.6 LED screen, acrylics, SEG print</td>
                  <td className="p-3.5 text-right font-mono font-bold text-white">
                    {isEditing ? (
                      <input
                        type="number"
                        value={quotation.materialSubtotal}
                        onChange={(e) => handleUpdate("materialSubtotal", parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-right font-mono"
                      />
                    ) : (
                      `$${quotation.materialSubtotal.toLocaleString()}`
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="p-3.5 font-bold text-white">2. Direct Onsite Labour</td>
                  <td className="p-3.5 text-slate-400">Master carpenters, electricians, riggers, graphic installers, supervisor (9 trades)</td>
                  <td className="p-3.5 text-right font-mono font-bold text-white">
                    {isEditing ? (
                      <input
                        type="number"
                        value={quotation.labourSubtotal}
                        onChange={(e) => handleUpdate("labourSubtotal", parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-right font-mono"
                      />
                    ) : (
                      `$${quotation.labourSubtotal.toLocaleString()}`
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="p-3.5 font-bold text-white">3. Turnkey Installation & Testing</td>
                  <td className="p-3.5 text-slate-400">9-phase sequence, DEWA electrical certification, 4K screen testing & handover</td>
                  <td className="p-3.5 text-right font-mono font-bold text-white">
                    {isEditing ? (
                      <input
                        type="number"
                        value={quotation.installationCost}
                        onChange={(e) => handleUpdate("installationCost", parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-right font-mono"
                      />
                    ) : (
                      `$${quotation.installationCost.toLocaleString()}`
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="p-3.5 font-bold text-white">4. Dismantling & Site Clearance</td>
                  <td className="p-3.5 text-slate-400">14h rapid teardown, safe electrical de-rig, eco-recycling & asset recovery</td>
                  <td className="p-3.5 text-right font-mono font-bold text-white">
                    {isEditing ? (
                      <input
                        type="number"
                        value={quotation.dismantlingCost}
                        onChange={(e) => handleUpdate("dismantlingCost", parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-right font-mono"
                      />
                    ) : (
                      `$${quotation.dismantlingCost.toLocaleString()}`
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="p-3.5 font-bold text-white">5. Transport & Logistics Freight</td>
                  <td className="p-3.5 text-slate-400">Dedicated 40ft air-ride trucking to venue marshalling yard (round trip)</td>
                  <td className="p-3.5 text-right font-mono font-bold text-white">
                    {isEditing ? (
                      <input
                        type="number"
                        value={quotation.transportFreightCost}
                        onChange={(e) => handleUpdate("transportFreightCost", parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-right font-mono"
                      />
                    ) : (
                      `$${quotation.transportFreightCost.toLocaleString()}`
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Financial Totals & Tax Calculation Card */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
          <div className="flex justify-between text-slate-300">
            <span>Direct Execution Subtotal:</span>
            <span className="font-mono">
              ${(quotation.materialSubtotal + quotation.labourSubtotal + quotation.installationCost + quotation.dismantlingCost + quotation.transportFreightCost).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-slate-300">
            <span>Project Management & Overhead ({quotation.overheadMarginPercent}%):</span>
            <span className="font-mono">${quotation.overheadMarginAmount.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-emerald-400">
            <span>Negotiated Client Discount:</span>
            <span className="font-mono font-bold">-${quotation.discountAmount.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-slate-300">
            <span>Applicable VAT / Tax ({quotation.vatPercent}%):</span>
            <span className="font-mono">${quotation.vatAmount.toLocaleString()}</span>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
            <div>
              <span className="text-sm font-black uppercase tracking-wider text-white block">Grand Total:</span>
              <span className="text-[11px] text-slate-500">All-Inclusive Turnkey Project Investment</span>
            </div>
            <span className="text-3xl font-black text-emerald-400 font-mono">
              {formatCurrency(quotation.grandTotal, quotation.currency)}
            </span>
          </div>
        </div>

        {/* 6. Payment Milestones & Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
          <div className="space-y-1">
            <span className="font-bold text-white uppercase text-[10px] block">Payment Schedule & Milestones</span>
            <p className="leading-relaxed">{quotation.paymentTerms}</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-white uppercase text-[10px] block">Legal & Safety Compliance</span>
            <p className="leading-relaxed">{quotation.legalTermsAndConditions}</p>
          </div>
        </div>

        {/* 7. Sign-off & Digital Signature Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-800 text-xs">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold text-slate-400">Authorized ExpoCraft Signatory:</span>
            <div className="h-12 border-b border-dashed border-slate-700 flex items-end">
              <span className="font-display italic text-cyan-300 text-sm">Alexander Sterling (Managing Director)</span>
            </div>
            <p className="text-[10px] text-slate-500">Date: {quotation.issueDate}</p>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold text-slate-400">Client Acceptance & Approval:</span>
            {quotation.status === "ACCEPTED" ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Digitally Signed by {quotation.clientContactPerson}</span>
              </div>
            ) : (
              <button
                onClick={handleApprove}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sign & Approve Commercial Quotation</span>
              </button>
            )}
            <p className="text-[10px] text-slate-500">Signatory: {quotation.clientContactPerson} ({quotation.clientCompanyName})</p>
          </div>
        </div>

      </div>

    </div>
  );
};
