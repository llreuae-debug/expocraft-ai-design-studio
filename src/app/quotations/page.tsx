"use client";

import React, { useState } from "react";
import { useProjects } from "@/context/ProjectContext";
import { MasterQuotationBuilder } from "@/components/quotations/MasterQuotationBuilder";
import { FileSpreadsheet, PlusCircle, CheckCircle2 } from "lucide-react";

export default function QuotationsPage() {
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "");

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  if (!currentProject) return null;

  return (
    <div className="space-y-6">
      <MasterQuotationBuilder project={currentProject} />
    </div>
  );
}
