export type BOQCategory16 = 
  | 'Structure'
  | 'Carpentry'
  | 'MDF/Plywood'
  | 'Aluminum'
  | 'Glass'
  | 'Acrylic'
  | 'Flooring'
  | 'Printing'
  | 'Branding'
  | 'Furniture'
  | 'Lighting'
  | 'Electrical'
  | 'AV'
  | 'Transport'
  | 'Installation'
  | 'Dismantling';

export interface TechnicalTakeoffSpec {
  floorAreaSqm: number;
  floorAreaSqft: number;
  wallAreaSqm: number;
  wallAreaSqft: number;
  brandingAreaSqm: number;
  brandingAreaSqft: number;
  flooringQuantitySqm: number;
  structuralTimberSqm: number;
  aluminumTrussLinearMeters: number;
  glassPanelsCount: number;
  acrylicSheetsCount: number;
  furnitureCountTotal: number;
  lightingFixturesCount: number;
  lightingLinearMeters: number;
  electricalTotalKw: number;
  electricalPointsCount: number;
  avScreenAreaSqm: number;
  displayPlinthsCount: number;
}

export type RateConfidenceLevel = 'VERIFIED_SUPPLIER' | 'REGIONAL_INDEX' | 'AI_ESTIMATE';

export interface MarketRateEntry {
  id: string;
  category: BOQCategory16;
  materialOrService: string;
  unit: string;
  country: string;
  city: string;
  supplier: string;
  qualityGrade: 'Standard' | 'Commercial' | 'Premium High-Gloss' | 'Eco Sustainable';
  baseRate: number;
  labourRate: number;
  currency: string;
  effectiveDate: string;
  confidenceScore: number; // 0-100%
  confidenceLevel: RateConfidenceLevel;
  notes?: string;
}

export interface DetailedBOQLineItem {
  id: string;
  category: BOQCategory16;
  itemCode: string;
  description: string;
  quantity: number;
  unit: string;
  material: string;
  unitRate: number;
  labourCost: number;
  totalCost: number;
  markupPercent: number;
  clientRate: number;
  totalClientPrice: number;
  supplierSource?: string;
  confidenceScore?: number;
  confidenceLevel?: RateConfidenceLevel;
  isCustomModified?: boolean;
}
