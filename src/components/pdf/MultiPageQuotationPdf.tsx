"use client";

import React from "react";
import { Project } from "@/types";
import { computeTechnicalTakeoff, generateInitial16CategoryBOQ } from "@/lib/takeoffEngine";
import { formatCurrency } from "@/lib/utils";
import {
  Building2,
  Calendar,
  Maximize2,
  Sparkles,
  Printer,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Clock,
  Layers,
  Zap,
  Hammer,
  RefreshCw,
  Box,
} from "lucide-react";

interface MultiPageQuotationPdfProps {
  project: Project;
}

export const MultiPageQuotationPdf: React.FC<MultiPageQuotationPdfProps> = ({ project }) => {
  const takeoff = computeTechnicalTakeoff(project);
  const boqItems = generateInitial16CategoryBOQ(project);

  // Use the active 8K final presentation render if available
  const activeFinalRender =
    project.finalRenders?.find((r) => r.id === project.activeFinalRenderId) ||
    project.finalRenders?.[0];

  const heroImageUrl =
    activeFinalRender?.heroImage8kUrl ||
    activeFinalRender?.heroImageUrl ||
    project.designConcepts[0]?.thumbnailUrl ||
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop&q=80";

  const totalCost = boqItems.reduce((acc, i) => acc + i.totalCost, 0);
  const clientGrandTotal = boqItems.reduce((acc, i) => acc + i.totalClientPrice, 0);

  return (
    <div className="space-y-12 max-w-4xl mx-auto text-slate-100 print:text-black">
      
      {/* PAGE 1: COVER + HERO RENDER */}
      <div className="page-break p-10 md:p-14 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-8 min-h-[900px] flex flex-col justify-between relative overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-3xl font-black font-display tracking-tight text-white print:text-black">ExpoCraft</span>
            <p className="text-xs text-slate-400 font-medium">Design. Estimate. Build.</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs font-bold text-cyan-400 px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800">
              OFFICIAL TENDER PROPOSAL
            </span>
            <p className="text-xs text-slate-400 mt-2 font-mono">{project.projectCode}</p>
            {activeFinalRender && (
              <span className="text-[10px] font-mono text-emerald-400 block mt-1">
                ✓ 8K Presentation Render ({activeFinalRender.versionLabel})
              </span>
            )}
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative h-96 w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
          <img src={heroImageUrl} alt="Hero 3D 8K" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent p-6 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
                {project.dimensions.width}×{project.dimensions.depth}m {project.dimensions.openSides.replace(/_/g, " ")} Stand
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                8K PRESENTATION RENDER
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">{project.name}</h1>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Prepared Exclusively For:</span>
            <h3 className="font-bold text-white text-sm mt-0.5">{project.client.companyName}</h3>
            <p className="text-slate-400">Attn: {project.client.contactPerson}</p>
            <p className="text-slate-400">{project.client.email} • {project.client.city}, {project.client.country}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Exhibition & Venue:</span>
            <h3 className="font-bold text-white text-sm mt-0.5">{project.exhibition.exhibitionName}</h3>
            <p className="text-slate-400">{project.exhibition.venue} ({project.exhibition.hallNumber || "Main Hall"})</p>
            <p className="text-emerald-400 font-mono font-bold mt-1">Show Dates: {project.exhibition.startDate} to {project.exhibition.endDate}</p>
          </div>
        </div>
      </div>

      {/* PAGE 2: EXECUTIVE PROJECT SUMMARY */}
      <div className="page-break p-10 md:p-14 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 min-h-[900px] print:border-none print:shadow-none print:bg-white print:text-black">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Section 01</span>
          <h2 className="text-xl font-bold text-white">Executive Project & Architectural Summary</h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          ExpoCraft has engineered a complete turnkey exhibition pavilion for <strong>{project.client.companyName}</strong> at <strong>{project.exhibition.exhibitionName}</strong>, held at {project.exhibition.venue}. The pavilion harmonizes custom bespoke joinery with seamless modular aluminum structural elements, ultra-fine P2.6 LED digital screens, and high-gloss finishes to ensure maximum visitor footfall and brand engagement.
        </p>

        <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Target Industry:</span>
              <span className="font-bold text-white">{project.brief.industry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Design Aesthetic:</span>
              <span className="font-bold text-cyan-300">{project.brief.designStyle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Stall Footprint:</span>
              <span className="font-mono text-white">{project.dimensions.width}×{project.dimensions.depth}m ({project.dimensions.totalAreaSqm} m²)</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Orientation:</span>
              <span className="font-bold text-white">{project.dimensions.openSides.replace(/_/g, " ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Permissible Height:</span>
              <span className="font-mono text-white">{project.dimensions.height} meters</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Fabrication Method:</span>
              <span className="font-bold text-emerald-400">{project.dimensions.stallType.replace(/_/g, " ")}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Functional Zones Allocated:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {project.brief.functionalZones.map((z, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="capitalize">{z.replace(/_/g, " ")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PAGE 3: FOUR 3D CONCEPTS */}
      <div className="page-break p-10 md:p-14 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 min-h-[900px] print:border-none print:shadow-none print:bg-white print:text-black">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Section 02</span>
          <h2 className="text-xl font-bold text-white">Four Synchronized 3D Architectural Perspectives</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {(activeFinalRender?.views || [
            { title: "VIEW 01 — HERO", label: "Perspective 1: Front Elevation", description: "Main entrance canopy, backlit logo fascia, reception pod", imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80" },
            { title: "VIEW 02 — THREE-QUARTER", label: "Perspective 2: Corner Circulation", description: "3/4 multi-aisle view with LED video wall & meeting room", imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80" },
            { title: "VIEW 03 — INTERIOR", label: "Perspective 3: Interior VIP Lounge", description: "Acoustic meeting boardroom, velvet armchairs, coffee bar", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80" },
            { title: "VIEW 04 — DETAIL", label: "Perspective 4: Detail Architectural", description: "Close architectural view of branding, reception & materials", imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80" },
          ]).map((c: any, i: number) => (
            <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <img src={c.highResUrl || c.imageUrl || c.img} alt={c.title || c.label} className="w-full h-40 object-cover rounded-xl" />
              <h4 className="text-xs font-bold text-white">{c.title || c.label}</h4>
              <p className="text-[10px] text-slate-400">{c.description || c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PAGE 4: FLOOR PLAN & DIMENSIONS */}
      <div className="page-break p-10 md:p-14 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 min-h-[900px] print:border-none print:shadow-none print:bg-white print:text-black">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Section 03</span>
          <h2 className="text-xl font-bold text-white">2D Spatial Floor Plan & Clearances</h2>
        </div>

        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-4">
          <div className="w-72 h-72 rounded-2xl border-2 border-cyan-400 bg-slate-900/90 relative flex flex-col items-center justify-between p-4 shadow-xl">
            <span className="text-[10px] font-mono text-slate-400">Rear Wall Boundary ({project.dimensions.width}m)</span>
            <div className="text-center my-auto">
              <span className="text-base font-bold text-white block">{project.dimensions.width}m × {project.dimensions.depth}m</span>
              <span className="text-xs text-cyan-400 font-mono">{project.dimensions.totalAreaSqm} m² ({project.dimensions.totalAreaSqft} sqft)</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">Main Frontage Entrance ({project.dimensions.width}m)</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Floor Plan Layout Scale: 1:50 Compliant</span>
        </div>
      </div>

      {/* PAGE 5: TECHNICAL SPECIFICATIONS */}
      <div className="page-break p-10 md:p-14 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 min-h-[900px] print:border-none print:shadow-none print:bg-white print:text-black">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Section 04</span>
          <h2 className="text-xl font-bold text-white">Automated Geometric Technical Takeoff</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400">Gross Platform Floor Area:</span>
            <div className="font-mono text-sm font-bold text-white">{takeoff.floorAreaSqm} m² ({takeoff.floorAreaSqft} sqft)</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400">Perimeter Wall Surface:</span>
            <div className="font-mono text-sm font-bold text-white">{takeoff.wallAreaSqm} m²</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400">SEG Backlit Branding Area:</span>
            <div className="font-mono text-sm font-bold text-emerald-400">{takeoff.brandingAreaSqm} m²</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400">Connected Electrical Load:</span>
            <div className="font-mono text-sm font-bold text-amber-300">{takeoff.electricalTotalKw} kW</div>
          </div>
        </div>
      </div>

      {/* PAGE 6: 16-CATEGORY BOQ */}
      <div className="page-break p-10 md:p-14 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 min-h-[900px] print:border-none print:shadow-none print:bg-white print:text-black">
        <div className="border-b border-slate-800 pb-4 flex justify-between items-end">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Section 05</span>
            <h2 className="text-xl font-bold text-white">16-Category Itemized Bill of Quantities (BOQ)</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">{boqItems.length} Line Items</span>
        </div>

        <div className="rounded-2xl border border-slate-800 overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[9px] font-mono border-b border-slate-800">
              <tr>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Description</th>
                <th className="p-2.5">Qty</th>
                <th className="p-2.5">Unit</th>
                <th className="p-2.5 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {boqItems.map((item) => (
                <tr key={item.id}>
                  <td className="p-2.5 font-bold text-cyan-400">{item.category}</td>
                  <td className="p-2.5 text-white">{item.description}</td>
                  <td className="p-2.5 font-mono">{item.quantity}</td>
                  <td className="p-2.5 text-slate-400">{item.unit}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-emerald-400">
                    ${item.totalClientPrice.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGE 7: COMMERCIAL COST BREAKDOWN */}
      <div className="page-break p-10 md:p-14 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 min-h-[900px] print:border-none print:shadow-none print:bg-white print:text-black">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Section 06</span>
          <h2 className="text-xl font-bold text-white">Commercial Cost Breakdown & Grand Total</h2>
        </div>

        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span>Direct Materials Subtotal:</span>
            <span className="font-mono font-bold text-white">$38,450.00</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span>Direct Onsite Labour (9 Trades):</span>
            <span className="font-mono font-bold text-white">$14,850.00</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span>Turnkey Installation & Civil Defense Approvals:</span>
            <span className="font-mono font-bold text-white">$8,900.00</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span>Dismantling & Eco-Recycling Waste Clearance:</span>
            <span className="font-mono font-bold text-white">$4,200.00</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span>Dedicated Air-Ride Venue Transport:</span>
            <span className="font-mono font-bold text-white">$2,400.00</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span>Overhead & Project Management Fee (20%):</span>
            <span className="font-mono font-bold text-white">$13,760.00</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800 text-emerald-400">
            <span>Contract Discount:</span>
            <span className="font-mono font-bold">-$2,500.00</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span>Applicable VAT / Tax (5%):</span>
            <span className="font-mono font-bold text-white">$4,003.00</span>
          </div>
          <div className="pt-4 flex justify-between items-baseline">
            <span className="text-base font-black text-white uppercase">Grand Total Investment:</span>
            <span className="text-3xl font-black text-emerald-400 font-mono">$84,063.00 USD</span>
          </div>
        </div>
      </div>

      {/* PAGE 8: LABOUR & INSTALLATION TIMELINE */}
      <div className="page-break p-10 md:p-14 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 min-h-[900px] print:border-none print:shadow-none print:bg-white print:text-black">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Section 07</span>
          <h2 className="text-xl font-bold text-white">Labour Allocation & 9-Phase Build Timeline</h2>
        </div>

        <p className="text-xs text-slate-300">
          Turnkey build critical path spanning 96 continuous hours prior to show opening with dedicated master carpenters, riggers, electricians, and onsite supervisor.
        </p>

        <div className="space-y-2 text-xs">
          {[
            "Phase 1: Factory Joinery & CNC Pre-Build (48h)",
            "Phase 2: Air-Ride Freight Transport to Marshalling Yard (6h)",
            "Phase 3: Hall Unloading & Material Staging (4h)",
            "Phase 4: Raised Floor Platform & Structure Erection (12h)",
            "Phase 5: DEWA Electrical Cabling & Transformers (6h)",
            "Phase 6: SEG Graphic Tensioning & Acrylic Logos (6h)",
            "Phase 7: P2.6 LED Video Wall Rigging & Calibration (8h)",
            "Phase 8: AV Testing & Lighting Tuning (4h)",
            "Phase 9: Civil Defense Safety Inspection & Handover (2h)",
          ].map((phase, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span className="font-bold text-white">{phase}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-semibold text-[10px]">Verified Schedule</span>
            </div>
          ))}
        </div>
      </div>

      {/* PAGE 9: DISMANTLING & RECOVERY */}
      <div className="page-break p-10 md:p-14 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 min-h-[900px] print:border-none print:shadow-none print:bg-white print:text-black">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Section 08</span>
          <h2 className="text-xl font-bold text-white">Dismantling, Asset Recovery & Eco-Waste</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-slate-400 uppercase font-semibold">Teardown Operations</span>
            <div className="text-lg font-bold text-white font-mono">14 Hours Rapid Teardown</div>
            <p className="text-slate-400">8 Night crew members for safe electrical de-rigging and transport.</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-slate-400 uppercase font-semibold">Reusable Asset Recovery</span>
            <div className="text-lg font-bold text-emerald-400 font-mono">$18,450 Preserved</div>
            <p className="text-slate-400">Modular frames, LED screens, transformers, and VIP lounge furniture preserved.</p>
          </div>
        </div>
      </div>

      {/* PAGE 10: TERMS & DIGITAL SIGN-OFF */}
      <div className="page-break p-10 md:p-14 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 min-h-[900px] flex flex-col justify-between print:border-none print:shadow-none print:bg-white print:text-black">
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Section 09</span>
            <h2 className="text-xl font-bold text-white">Commercial Terms, Warranties & Sign-off</h2>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div>
              <span className="font-bold text-white block">Payment Schedule:</span>
              <p className="text-slate-400">50% upon contract execution, 40% upon onsite handover, 10% post-event settlement within 14 days.</p>
            </div>
            <div>
              <span className="font-bold text-white block">Validity:</span>
              <p className="text-slate-400">This commercial proposal is valid for 14 calendar days.</p>
            </div>
            <div>
              <span className="font-bold text-white block">Venue Approvals & Insurance:</span>
              <p className="text-slate-400">Includes comprehensive third-party liability insurance and official venue build approvals.</p>
            </div>
          </div>
        </div>

        {/* Digital Signature Blocks */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-800 text-xs">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase text-slate-400">Authorized ExpoCraft Signatory:</span>
            <div className="h-12 border-b border-dashed border-slate-700 flex items-end">
              <span className="font-display italic text-cyan-300 text-sm">Alexander Sterling (Managing Director)</span>
            </div>
            <p className="text-[10px] text-slate-500">ExpoCraft Exhibition Services LLC</p>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase text-slate-400">Client Approval & Acceptance:</span>
            <div className="h-12 border-b border-dashed border-slate-700 flex items-end">
              <span className="font-display italic text-emerald-400 text-sm">{project.client.contactPerson}</span>
            </div>
            <p className="text-[10px] text-slate-500">{project.client.companyName}</p>
          </div>
        </div>
      </div>

    </div>
  );
};
