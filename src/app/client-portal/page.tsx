"use client";

import React from "react";
import { useProjects } from "@/context/ProjectContext";
import { ClientPortalView } from "@/components/portal/ClientPortalView";
import { ShieldCheck, AlertCircle } from "lucide-react";

export default function ClientPortalPage() {
  const { selectedProject, updateProject } = useProjects();

  if (!selectedProject) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">No Project Selected</h2>
        <p className="text-sm text-slate-400">
          Please select a project from the Projects tab to access its client portal and lifecycle review.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <ClientPortalView
        project={selectedProject}
        onUpdateProject={(updates) => updateProject(selectedProject.id, updates)}
      />
    </div>
  );
}
