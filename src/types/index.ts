export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'DESIGNER' 
  | 'ESTIMATOR' 
  | 'SALES' 
  | 'CLIENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  company?: string;
  phone?: string;
}

export type MeasurementUnit = 'METERS' | 'FEET';

export type OpenSides = 
  | '1_SIDE_INLINE'    // Inline / Linear (1 side open to aisle, 3 walls)
  | '2_SIDES_CORNER'   // Corner (2 adjacent sides open, 2 walls)
  | '3_SIDES_PENINSULA'// Peninsula / End-Cap (3 sides open, 1 back wall)
  | '4_SIDES_ISLAND';  // Island (4 sides open, 360 degree access)

export type StallType = 
  | 'CUSTOM_WOODEN'
  | 'MODULAR_OCTANORM'
  | 'HYBRID_SYSTEM'
  | 'DOUBLE_DECKER'
  | 'FABRIC_TENSION'
  | 'TRUSS_SYSTEM';

export type IndustryType = 
  | 'Technology & AI'
  | 'Real Estate & Property'
  | 'Healthcare & Pharma'
  | 'Automotive & Mobility'
  | 'Energy & Sustainability'
  | 'Finance & Fintech'
  | 'Food & Beverage'
  | 'Luxury & Jewelry'
  | 'Defense & Aerospace'
  | 'General Exhibition';

export type DesignStyle = 
  | 'Ultra-Modern Minimalist'
  | 'Futuristic High-Tech LED'
  | 'Warm Wood & Biophilic'
  | 'Industrial Truss & Metal'
  | 'Luxury Sleek & Glossy'
  | 'Bold Vibrant Experiential'
  | 'Corporate Executive';

export type ProjectStatus = 
  | 'BRIEF_RECEIVED'
  | 'AI_DESIGN_IN_PROGRESS'
  | 'DESIGN_READY'
  | 'BOQ_ESTIMATING'
  | 'QUOTATION_GENERATED'
  | 'SENT_TO_CLIENT'
  | 'APPROVED'
  | 'REJECTED'
  | 'IN_PRODUCTION';

export interface StallDimensions {
  unit: MeasurementUnit;
  width: number;       // Frontage (m or ft)
  depth: number;       // Depth (m or ft)
  height: number;      // Height (m or ft)
  maxHeightLimit?: number;
  totalAreaSqm: number;
  totalAreaSqft: number;
  openSides: OpenSides;
  stallType: StallType;
}

export interface ClientInfo {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  country: string;
  city: string;
  vatNumber?: string;
}

export interface ExhibitionDetails {
  exhibitionName: string;
  venue: string;
  city: string;
  country: string;
  hallNumber?: string;
  stallNumber?: string;
  startDate: string;
  endDate: string;
  moveInDate: string;
  moveOutDate: string;
}

export interface DesignBrief {
  industry: IndustryType;
  designStyle: DesignStyle;
  primaryColor?: string;
  secondaryColor?: string;
  brandGuidelinesUrl?: string;
  functionalZones: string[];
  specialRequirements?: string;
  targetAudience?: string;
  productDisplaysCount?: number;
  meetingRoomsCount?: number;
  hasLedScreen: boolean;
  hasPantryStorage: boolean;
  hasReceptionCounter: boolean;
  hasHangingBanner: boolean;
}

export interface BudgetCommercials {
  currency: string;
  targetBudgetMin: number;
  targetBudgetMax: number;
  targetMarginPercent: number;
  clientBudgetStated?: number;
  paymentTerms?: string;
}

export interface BOQItem {
  id: string;
  category: 'FLOORING' | 'WALLS_PARTITIONS' | 'FASCIA_CEILING' | 'FURNITURE_AV' | 'GRAPHICS_BRANDING' | 'ELECTRICAL_LIGHTING' | 'LABOUR_LOGISTICS';
  itemCode: string;
  name: string;
  description: string;
  unit: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
  markupPercent: number;
  clientRate: number;
  totalClientPrice: number;
  notes?: string;
}

export interface DesignConcept {
  id: string;
  title: string;
  version: number;
  thumbnailUrl: string;
  highResUrl?: string;
  aiPromptUsed?: string;
  isClientApproved: boolean;
  createdAt: string;
  views: {
    front?: string;
    isometric?: string;
    top?: string;
    interior?: string;
  };
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  version: number;
  issueDate: string;
  validUntil: string;
  subtotalCost: number;
  overheadMargin: number;
  discountAmount: number;
  vatPercent: number;
  vatAmount: number;
  grandTotal: number;
  currency: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REVISED' | 'DECLINED';
  clientNotes?: string;
  internalNotes?: string;
}

export interface Project {
  id: string;
  projectCode: string; // e.g. EXP-2026-081
  name: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  assignedDesigner?: string;
  assignedEstimator?: string;
  assignedSales?: string;
  
  // 1. Brief & Client
  client: ClientInfo;
  
  // 2. Exhibition & Venue
  exhibition: ExhibitionDetails;
  
  // 3. Technical Stall Specs
  dimensions: StallDimensions;
  
  // 4. Style & Brief
  brief: DesignBrief;
  
  // 5. Commercials & Budget
  budget: BudgetCommercials;
  
  // 6. Connected Design Concepts
  designConcepts: DesignConcept[];
  
  // 6b. Brand Profile & Assets
  brandProfile?: import('./studio').ExtractedBrandProfile;
  brandAssets?: import('./studio').BrandAsset[];
  perspectiveConcepts?: import('./studio').PerspectiveConcept[];

  // 6c. 3D Studio Live Config
  scene3DConfig?: import('./studio').Scene3DConfig;

  // 6d. Final 8K Presentation Renders
  finalRenders?: import('./studio').FinalRenderRecord[];
  activeFinalRenderId?: string;

  // 7. Connected BOQ Items
  boqItems: BOQItem[];
  
  // 8. Connected Quotations
  quotations: Quotation[];
  
  // 9. Activity Log
  activityLogs: {
    id: string;
    timestamp: string;
    actor: string;
    role: UserRole;
    action: string;
    details?: string;
  }[];
}
