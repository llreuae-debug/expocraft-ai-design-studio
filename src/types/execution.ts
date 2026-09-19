export type LabourTradeRole = 
  | 'Carpenter'
  | 'Painter'
  | 'Electrician'
  | 'Installer'
  | 'Graphic installer'
  | 'Aluminum fabricator'
  | 'Supervisor'
  | 'Helper'
  | 'AV technician';

export interface LabourRoleCalculation {
  role: LabourTradeRole;
  workersCount: number;
  daysCount: number;
  hoursPerDay: number;
  ratePerDay: number;
  ratePerHour: number;
  overtimeHours: number;
  overtimeRatePerHour: number;
  totalCost: number;
  notes?: string;
}

export type InstallationPhaseType =
  | 'Fabrication'
  | 'Transport'
  | 'Unloading'
  | 'Installation'
  | 'Electrical setup'
  | 'Branding installation'
  | 'AV installation'
  | 'Testing'
  | 'Final inspection';

export interface InstallationPhaseItem {
  id: string;
  phase: InstallationPhaseType;
  title: string;
  durationHours: number;
  crewCount: number;
  estimatedCost: number;
  milestone: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  startDateOffsetHours: number; // relative to move-in start
}

export interface DismantlingSpec {
  estimatedHours: number;
  manpowerCount: number;
  dismantlingLabourCost: number;
  electricalRemovalCost: number;
  graphicRemovalCost: number;
  furniturePackingCost: number;
  structureDismantlingCost: number;
  loadingAndTransportCost: number;
  disposalCost: number;
  totalDismantlingCost: number;
  reusableAssetValue: number;
  reusableItems: string[];
  disposalTonnage: number;
  recyclingRatePercent: number;
}

export interface MasterQuotationData {
  quotationNumber: string;
  version: number;
  issueDate: string;
  validUntil: string;
  clientCompanyName: string;
  clientContactPerson: string;
  clientEmail: string;
  clientPhone: string;
  clientCity: string;
  clientCountry: string;
  clientVatNumber?: string;
  
  projectName: string;
  exhibitionName: string;
  venue: string;
  hallNumber: string;
  stallNumber: string;
  stallDimensions: string;
  totalAreaSqm: number;
  
  materialSubtotal: number;
  labourSubtotal: number;
  installationCost: number;
  dismantlingCost: number;
  transportFreightCost: number;
  overheadMarginPercent: number;
  overheadMarginAmount: number;
  discountAmount: number;
  vatPercent: number;
  vatAmount: number;
  grandTotal: number;
  currency: string;
  
  paymentTerms: string;
  validityTerms: string;
  legalTermsAndConditions: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REVISED' | 'DECLINED';
}
