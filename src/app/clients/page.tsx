"use client";

import React from "react";
import { useProjects } from "@/context/ProjectContext";
import { Users, Building2, Mail, Phone, MapPin, FolderKanban, PlusCircle } from "lucide-react";

export default function ClientsPage() {
  const { projects } = useProjects();

  const clients = Array.from(new Set(projects.map((p) => p.client.companyName))).map((company) => {
    const proj = projects.find((p) => p.client.companyName === company)!;
    const clientProjects = projects.filter((p) => p.client.companyName === company);
    return {
      client: proj.client,
      projectCount: clientProjects.length,
      totalBudget: clientProjects.reduce((acc, p) => acc + p.budget.targetBudgetMax, 0),
    };
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Client Directory & Corporate Accounts
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold border border-cyan-500/30">
              {clients.length} Accounts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage client enterprise relationships, primary contacts, and historical project portfolios.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clients.map(({ client, projectCount, totalBudget }) => (
          <div
            key={client.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 hover:border-cyan-500/40 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30 font-bold">
                {client.companyName.charAt(0)}
              </div>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-cyan-300">
                {projectCount} Active Stands
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">{client.companyName}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{client.contactPerson}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{client.city}, {client.country}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Portfolio Value:</span>
              <span className="font-mono font-bold text-amber-300">${totalBudget.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
