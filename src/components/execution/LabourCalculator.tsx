"use client";

import React, { useState } from "react";
import { LabourTradeRole, LabourRoleCalculation } from "@/types/execution";
import { Hammer, Users, Clock, DollarSign, PlusCircle, Trash2, ShieldCheck, Sparkles } from "lucide-react";

interface LabourCalculatorProps {
  initialRoles?: LabourRoleCalculation[];
  currency?: string;
  onTotalLabourChange?: (total: number) => void;
}

const DEFAULT_LABOUR_ROLES: LabourRoleCalculation[] = [
  {
    role: "Carpenter",
    workersCount: 4,
    daysCount: 3,
    hoursPerDay: 10,
    ratePerDay: 180,
    ratePerHour: 18,
    overtimeHours: 6,
    overtimeRatePerHour: 25,
    totalCost: 4 * (3 * 180 + 6 * 25), // 4 * (540 + 150) = 2760
    notes: "Master joiners for raised floor platform and feature walls",
  },
  {
    role: "Painter",
    workersCount: 2,
    daysCount: 2,
    hoursPerDay: 10,
    ratePerDay: 165,
    ratePerHour: 16.5,
    overtimeHours: 4,
    overtimeRatePerHour: 22,
    totalCost: 2 * (2 * 165 + 4 * 22),
    notes: "PU spray coating touch-ups and shadow gap finishing",
  },
  {
    role: "Electrician",
    workersCount: 2,
    daysCount: 3,
    hoursPerDay: 10,
    ratePerDay: 210,
    ratePerHour: 21,
    overtimeHours: 4,
    overtimeRatePerHour: 30,
    totalCost: 2 * (3 * 210 + 4 * 30),
    notes: "DEWA certified 3-phase connection & testing",
  },
  {
    role: "Installer",
    workersCount: 3,
    daysCount: 3,
    hoursPerDay: 10,
    ratePerDay: 150,
    ratePerHour: 15,
    overtimeHours: 6,
    overtimeRatePerHour: 20,
    totalCost: 3 * (3 * 150 + 6 * 20),
    notes: "Hardware assembly and wall panel erection",
  },
  {
    role: "Graphic installer",
    workersCount: 2,
    daysCount: 2,
    hoursPerDay: 8,
    ratePerDay: 160,
    ratePerHour: 20,
    overtimeHours: 2,
    overtimeRatePerHour: 25,
    totalCost: 2 * (2 * 160 + 2 * 25),
    notes: "Seamless SEG fabric tensioning & 3D acrylic signage",
  },
  {
    role: "Aluminum fabricator",
    workersCount: 2,
    daysCount: 2,
    hoursPerDay: 10,
    ratePerDay: 175,
    ratePerHour: 17.5,
    overtimeHours: 4,
    overtimeRatePerHour: 24,
    totalCost: 2 * (2 * 175 + 4 * 24),
    notes: "Ceiling fascia truss and modular extrusion frames",
  },
  {
    role: "Supervisor",
    workersCount: 1,
    daysCount: 4,
    hoursPerDay: 12,
    ratePerDay: 350,
    ratePerHour: 35,
    overtimeHours: 8,
    overtimeRatePerHour: 50,
    totalCost: 1 * (4 * 350 + 8 * 50),
    notes: "24/7 dedicated site lead and venue authority liaison",
  },
  {
    role: "Helper",
    workersCount: 4,
    daysCount: 3,
    hoursPerDay: 10,
    ratePerDay: 110,
    ratePerHour: 11,
    overtimeHours: 6,
    overtimeRatePerHour: 15,
    totalCost: 4 * (3 * 110 + 6 * 15),
    notes: "Unloading, material staging, and continuous site cleaning",
  },
  {
    role: "AV technician",
    workersCount: 2,
    daysCount: 3,
    hoursPerDay: 10,
    ratePerDay: 260,
    ratePerHour: 26,
    overtimeHours: 4,
    overtimeRatePerHour: 35,
    totalCost: 2 * (3 * 260 + 4 * 35),
    notes: "P2.6 LED screen rigging, calibration & show standby",
  },
];

export const LabourCalculator: React.FC<LabourCalculatorProps> = ({
  initialRoles = DEFAULT_LABOUR_ROLES,
  currency = "USD",
  onTotalLabourChange,
}) => {
  const [roles, setRoles] = useState<LabourRoleCalculation[]>(initialRoles);

  const handleUpdate = (
    index: number,
    field: keyof LabourRoleCalculation,
    value: any
  ) => {
    const updated = [...roles];
    const item = { ...updated[index], [field]: value };

    const workers = field === "workersCount" ? parseInt(value) || 0 : item.workersCount;
    const days = field === "daysCount" ? parseFloat(value) || 0 : item.daysCount;
    const rateDay = field === "ratePerDay" ? parseFloat(value) || 0 : item.ratePerDay;
    const otHours = field === "overtimeHours" ? parseFloat(value) || 0 : item.overtimeHours;
    const otRate = field === "overtimeRatePerHour" ? parseFloat(value) || 0 : item.overtimeRatePerHour;

    const totalCost = workers * (days * rateDay + otHours * otRate);
    item.totalCost = totalCost;
    updated[index] = item;
    setRoles(updated);

    const grandTotal = updated.reduce((acc, r) => acc + r.totalCost, 0);
    if (onTotalLabourChange) onTotalLabourChange(grandTotal);
  };

  const totalWorkers = roles.reduce((acc, r) => acc + r.workersCount, 0);
  const totalLabourCost = roles.reduce((acc, r) => acc + r.totalCost, 0);
  const totalManDays = roles.reduce((acc, r) => acc + r.workersCount * r.daysCount, 0);

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              9-Role Onsite Labour Calculator
            </h3>
            <p className="text-xs text-slate-400">
              Formula: <span className="font-mono text-cyan-300">Workers × (Days × Day Rate + OT Hours × OT Rate)</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
            {totalWorkers} Active Crew ({totalManDays} Man-Days)
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-sm">
            Total: ${totalLabourCost.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Interactive Table for 9 Roles */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
            <tr>
              <th className="p-3.5">Trade Role</th>
              <th className="p-3.5 w-20">Workers</th>
              <th className="p-3.5 w-20">Days</th>
              <th className="p-3.5 w-24">Day Rate ($)</th>
              <th className="p-3.5 w-20">OT (Hrs)</th>
              <th className="p-3.5 w-24">OT Rate ($)</th>
              <th className="p-3.5 text-right font-mono text-cyan-400 w-28">Total ($)</th>
              <th className="p-3.5 min-w-[200px]">Scope / Assignment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {roles.map((r, idx) => (
              <tr key={r.role} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-3.5 font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>{r.role}</span>
                </td>

                <td className="p-3.5">
                  <input
                    type="number"
                    min="1"
                    value={r.workersCount}
                    onChange={(e) => handleUpdate(idx, "workersCount", e.target.value)}
                    className="w-16 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-white font-mono font-bold text-xs focus:border-cyan-500"
                  />
                </td>

                <td className="p-3.5">
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={r.daysCount}
                    onChange={(e) => handleUpdate(idx, "daysCount", e.target.value)}
                    className="w-16 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500"
                  />
                </td>

                <td className="p-3.5">
                  <input
                    type="number"
                    value={r.ratePerDay}
                    onChange={(e) => handleUpdate(idx, "ratePerDay", e.target.value)}
                    className="w-20 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500"
                  />
                </td>

                <td className="p-3.5">
                  <input
                    type="number"
                    min="0"
                    value={r.overtimeHours}
                    onChange={(e) => handleUpdate(idx, "overtimeHours", e.target.value)}
                    className="w-16 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs focus:border-cyan-500"
                  />
                </td>

                <td className="p-3.5">
                  <input
                    type="number"
                    value={r.overtimeRatePerHour}
                    onChange={(e) => handleUpdate(idx, "overtimeRatePerHour", e.target.value)}
                    className="w-20 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs focus:border-cyan-500"
                  />
                </td>

                <td className="p-3.5 font-mono font-bold text-right text-emerald-400 text-sm">
                  ${r.totalCost.toLocaleString()}
                </td>

                <td className="p-3.5 text-slate-400 text-[11px] italic">
                  {r.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
