"use client";

import React from "react";
import { AppSidebar } from "./AppSidebar";
import { AppNavbar } from "./AppNavbar";
import { MobileBottomNav } from "./MobileBottomNav";
import { ProjectCreationWizard } from "../wizard/ProjectCreationWizard";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Left Navigation Sidebar (Desktop) */}
      <AppSidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <AppNavbar />

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-6 pb-20 md:pb-6 custom-scrollbar">
          {children}
        </main>
      </div>

      {/* Mobile Native Bottom Navigation Bar (Android & iOS) */}
      <MobileBottomNav />

      {/* Global Project Creation Wizard Modal */}
      <ProjectCreationWizard />
    </div>
  );
};
