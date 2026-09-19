"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Project, ProjectStatus, MeasurementUnit, OpenSides, StallType, IndustryType, DesignStyle } from "@/types";
import { INITIAL_PROJECTS } from "@/lib/constants";
import { calculateArea, generateProjectCode } from "@/lib/utils";

export interface WizardDraftData {
  // Step 1: Project & Client
  projectName: string;
  clientCompanyName: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  clientCountry: string;
  clientCity: string;
  clientVatNumber?: string;

  // Step 2: Exhibition Details
  exhibitionName: string;
  venue: string;
  city: string;
  country: string;
  hallNumber: string;
  stallNumber: string;
  startDate: string;
  endDate: string;
  moveInDate: string;
  moveOutDate: string;

  // Step 3: Stall Dimensions & Orientation
  unit: MeasurementUnit;
  width: number;
  depth: number;
  height: number;
  maxHeightLimit: number;
  openSides: OpenSides;
  stallType: StallType;

  // Step 4: Design Style & Brief
  industry: IndustryType;
  designStyle: DesignStyle;
  primaryColor: string;
  secondaryColor: string;
  functionalZones: string[];
  specialRequirements: string;
  hasLedScreen: boolean;
  hasPantryStorage: boolean;
  hasReceptionCounter: boolean;
  hasHangingBanner: boolean;
  productDisplaysCount: number;
  meetingRoomsCount: number;

  // Step 5: Commercial & Budget
  currency: string;
  targetBudgetMin: number;
  targetBudgetMax: number;
  targetMarginPercent: number;
  clientBudgetStated: number;
}

const DEFAULT_WIZARD_DRAFT: WizardDraftData = {
  projectName: "",
  clientCompanyName: "",
  contactPerson: "",
  contactEmail: "",
  contactPhone: "",
  clientCountry: "United Arab Emirates",
  clientCity: "Dubai",
  clientVatNumber: "",

  exhibitionName: "GITEX GLOBAL 2026",
  venue: "Dubai World Trade Centre",
  city: "Dubai",
  country: "United Arab Emirates",
  hallNumber: "Hall 6",
  stallNumber: "Stand 6-A10",
  startDate: "2026-10-12",
  endDate: "2026-10-16",
  moveInDate: "2026-10-09",
  moveOutDate: "2026-10-17",

  unit: "METERS",
  width: 6,
  depth: 6,
  height: 4,
  maxHeightLimit: 4.5,
  openSides: "2_SIDES_CORNER",
  stallType: "CUSTOM_WOODEN",

  industry: "Technology & AI",
  designStyle: "Futuristic High-Tech LED",
  primaryColor: "#0284c7",
  secondaryColor: "#0f172a",
  functionalZones: ["reception", "vip_lounge", "led_wall", "storage_pantry"],
  specialRequirements: "Modern double-height entrance arch with high-lumen LED edge lighting and lockable pantry.",
  hasLedScreen: true,
  hasPantryStorage: true,
  hasReceptionCounter: true,
  hasHangingBanner: false,
  productDisplaysCount: 3,
  meetingRoomsCount: 1,

  currency: "USD",
  targetBudgetMin: 35000,
  targetBudgetMax: 50000,
  targetMarginPercent: 28,
  clientBudgetStated: 42000,
};

interface ProjectContextType {
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  getProjectById: (id: string) => Project | undefined;
  createProjectFromWizard: (draft: WizardDraftData) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Wizard Modal Control
  isWizardOpen: boolean;
  openWizard: () => void;
  closeWizard: () => void;
  wizardStep: number;
  setWizardStep: (step: number) => void;
  wizardDraft: WizardDraftData;
  updateWizardDraft: (updates: Partial<WizardDraftData>) => void;
  resetWizardDraft: () => void;

  // Search and Filters
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  filteredProjects: Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(INITIAL_PROJECTS[0] || null);
  
  // Wizard state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardDraft, setWizardDraft] = useState<WizardDraftData>(DEFAULT_WIZARD_DRAFT);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("expocraft_projects");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load projects from localStorage", e);
    }
  }, []);

  // Sync to local storage
  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    try {
      localStorage.setItem("expocraft_projects", JSON.stringify(newProjects));
    } catch (e) {
      console.error("Failed to save projects to localStorage", e);
    }
  };

  const getProjectById = (id: string) => {
    return projects.find((p) => p.id === id);
  };

  const updateWizardDraft = (updates: Partial<WizardDraftData>) => {
    setWizardDraft((prev) => ({ ...prev, ...updates }));
  };

  const resetWizardDraft = () => {
    setWizardDraft(DEFAULT_WIZARD_DRAFT);
    setWizardStep(1);
  };

  const openWizard = () => {
    setIsWizardOpen(true);
  };

  const closeWizard = () => {
    setIsWizardOpen(false);
  };

  const createProjectFromWizard = (draft: WizardDraftData): Project => {
    const { areaSqm, areaSqft } = calculateArea(draft.width, draft.depth, draft.unit);
    const newCode = generateProjectCode(projects.length);
    const now = new Date().toISOString();

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      projectCode: newCode,
      name: draft.projectName || `${draft.clientCompanyName} - ${draft.exhibitionName} Stall`,
      status: "BRIEF_RECEIVED",
      createdAt: now,
      updatedAt: now,
      client: {
        id: `client-${Date.now()}`,
        companyName: draft.clientCompanyName,
        contactPerson: draft.contactPerson,
        email: draft.contactEmail,
        phone: draft.contactPhone,
        country: draft.clientCountry,
        city: draft.clientCity,
        vatNumber: draft.clientVatNumber,
      },
      exhibition: {
        exhibitionName: draft.exhibitionName,
        venue: draft.venue,
        city: draft.city,
        country: draft.country,
        hallNumber: draft.hallNumber,
        stallNumber: draft.stallNumber,
        startDate: draft.startDate,
        endDate: draft.endDate,
        moveInDate: draft.moveInDate,
        moveOutDate: draft.moveOutDate,
      },
      dimensions: {
        unit: draft.unit,
        width: draft.width,
        depth: draft.depth,
        height: draft.height,
        maxHeightLimit: draft.maxHeightLimit,
        totalAreaSqm: areaSqm,
        totalAreaSqft: areaSqft,
        openSides: draft.openSides,
        stallType: draft.stallType,
      },
      brief: {
        industry: draft.industry,
        designStyle: draft.designStyle,
        primaryColor: draft.primaryColor,
        secondaryColor: draft.secondaryColor,
        functionalZones: draft.functionalZones,
        specialRequirements: draft.specialRequirements,
        hasLedScreen: draft.hasLedScreen,
        hasPantryStorage: draft.hasPantryStorage,
        hasReceptionCounter: draft.hasReceptionCounter,
        hasHangingBanner: draft.hasHangingBanner,
        productDisplaysCount: draft.productDisplaysCount,
        meetingRoomsCount: draft.meetingRoomsCount,
      },
      budget: {
        currency: draft.currency,
        targetBudgetMin: draft.targetBudgetMin,
        targetBudgetMax: draft.targetBudgetMax,
        targetMarginPercent: draft.targetMarginPercent,
        clientBudgetStated: draft.clientBudgetStated,
      },
      designConcepts: [],
      boqItems: [],
      quotations: [],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          timestamp: now,
          actor: "Current User",
          role: "ADMIN",
          action: "Project Initialized via Wizard",
          details: `Created new project with ${draft.width}x${draft.depth}${draft.unit === 'METERS' ? 'm' : 'ft'} dimensions.`,
        }
      ]
    };

    const updated = [newProject, ...projects];
    saveProjects(updated);
    setSelectedProject(newProject);
    setIsWizardOpen(false);
    resetWizardDraft();
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updated = projects.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });
    saveProjects(updated);
    if (selectedProject?.id === id) {
      setSelectedProject((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    saveProjects(updated);
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.exhibition.exhibitionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.exhibition.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        setSelectedProject,
        getProjectById,
        createProjectFromWizard,
        updateProject,
        deleteProject,
        isWizardOpen,
        openWizard,
        closeWizard,
        wizardStep,
        setWizardStep,
        wizardDraft,
        updateWizardDraft,
        resetWizardDraft,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        filteredProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
}
