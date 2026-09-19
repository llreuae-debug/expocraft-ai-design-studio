import {
  FinalRenderRecord,
  FinalRenderView,
  QualityValidationReport,
  DesignRefinements,
  ExtractedBrandProfile,
  GenerationProgressStep
} from "@/types/studio";
import { Project } from "@/types";

export interface FinalRenderInput {
  project: Project;
  selectedConceptId?: string;
  brandProfile?: ExtractedBrandProfile;
  refinements?: DesignRefinements;
  targetResolution?: '4K' | '8K';
  customPrompt?: string;
  viewTypes?: ('HERO_VIEW' | 'THREE_QUARTER_VIEW' | 'INTERIOR_VIP_VIEW' | 'DETAIL_ARCHITECTURAL_VIEW')[];
}

export interface FinalRenderJob {
  jobId: string;
  projectId: string;
  status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  currentStep: GenerationProgressStep;
  progressPercent: number;
  renderRecord?: FinalRenderRecord;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinalRenderStatus {
  jobId: string;
  status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  currentStep: GenerationProgressStep;
  progressPercent: number;
  renderRecord?: FinalRenderRecord;
  error?: string;
}

export interface FinalRenderProvider {
  providerId: string;
  providerName: string;
  isConfigured(): Promise<boolean>;
  testConnection(): Promise<{ success: boolean; message: string; details?: any }>;
  generate(input: FinalRenderInput): Promise<FinalRenderJob>;
  getStatus(jobId: string): Promise<FinalRenderStatus>;
  cancel(jobId: string): Promise<boolean>;
  retry(jobId: string): Promise<FinalRenderJob>;
}
