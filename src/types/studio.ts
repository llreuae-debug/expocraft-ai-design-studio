export type StylePreset = 
  | 'Modern'
  | 'Luxury'
  | 'Minimal'
  | 'Corporate'
  | 'Futuristic'
  | 'Premium'
  | 'Industrial'
  | 'Sustainable'
  | 'Technology';

export interface BrandAsset {
  id: string;
  type: 'LOGO' | 'GUIDELINES' | 'PRODUCT' | 'CATALOGUE' | 'INSPIRATION';
  fileName: string;
  fileSize: string;
  fileUrl: string;
  mimeType: string;
  uploadedAt: string;
}

export interface ExtractedBrandProfile {
  brandName: string;
  tagline?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceColor: string;
  logoUrl: string;
  logoAspectRatio: number; // width / height
  typographyPrimary: string;
  typographySecondary: string;
  detectedIndustry: string;
  visualStyleKeywords: string[];
  designAesthetic: StylePreset;
}

export type PerspectiveType = 'FRONT' | 'CORNER' | 'INTERIOR' | 'ALTERNATIVE';

export interface PerspectiveConcept {
  id: string;
  type: PerspectiveType;
  title: string;
  perspectiveLabel: string;
  imageUrl: string;
  highResUrl: string;
  prompt: string;
  specSummary: {
    dimensions: string;
    openSides: string;
    featuresIncluded: string[];
    dominantMaterials: string[];
    lightingScheme: string;
  };
  isClientApproved: boolean;
  createdAt: string;
}

export type SceneObjectType = 
  | 'WALL_SOLID'
  | 'WALL_GLASS'
  | 'WALL_CURVED'
  | 'RECEPTION_COUNTER'
  | 'VIP_LOUNGE_SOFA'
  | 'MEETING_TABLE'
  | 'CHAIR_EXECUTIVE'
  | 'BAR_STOOL'
  | 'LED_VIDEO_WALL'
  | 'TOUCHSCREEN_KIOSK'
  | 'DISPLAY_PODIUM'
  | 'HANGING_RING_BANNER'
  | 'CEILING_TRUSS'
  | 'BRANDING_SIGNAGE';

export interface Scene3DObject {
  id: string;
  type: SceneObjectType;
  name: string;
  position: [number, number, number]; // [x, y, z] in meters
  rotation: [number, number, number]; // [rx, ry, rz] in radians
  scale: [number, number, number];    // [sx, sy, sz]
  color?: string;
  materialType?: 'WOOD' | 'METAL' | 'GLOSS' | 'MATTE' | 'GLASS' | 'LED_SCREEN' | 'FABRIC';
  textLabel?: string;
  isLocked?: boolean;
}

export type FlooringTextureType = 'EPOXY_GLOSS_WHITE' | 'DARK_SLATE' | 'WARM_OAK_WOOD' | 'ILLUMINATED_LED_EDGE' | 'CARPET_CHARCOAL';

export interface Scene3DConfig {
  stallWidth: number;
  stallDepth: number;
  stallHeight: number;
  flooringType: FlooringTextureType;
  flooringColor: string;
  ambientLightIntensity: number;
  spotlightIntensity: number;
  neonEdgeColor: string;
  neonEdgeEnabled: boolean;
  backWallEnabled: boolean;
  leftWallEnabled: boolean;
  rightWallEnabled: boolean;
  meetingRoomDividerEnabled: boolean;
  hangingBannerEnabled: boolean;
  logoBrandingApplied: boolean;
  objects: Scene3DObject[];
}

// ----------------------------------------------------
// FINAL 3D PRESENTATION RENDER & 8K PIPELINE TYPES
// ----------------------------------------------------

export type FinalRenderViewType = 'HERO_VIEW' | 'THREE_QUARTER_VIEW' | 'INTERIOR_VIP_VIEW' | 'DETAIL_ARCHITECTURAL_VIEW';

export interface FinalRenderView {
  id: string;
  viewType: FinalRenderViewType;
  title: string;
  label: string;
  description: string;
  imageUrl: string;
  highResUrl: string;
  canvas8kUrl?: string;
  aspectRatio: string;
  cameraAngle: string;
  keyFeaturesVisible: string[];
}

export interface DesignRefinements {
  primaryColorOverride?: string;
  secondaryColorOverride?: string;
  flooringType?: FlooringTextureType;
  lightingScheme?: 'WARM_3000K' | 'NEON_CYAN_TECH' | 'STUDIO_WHITE_5000K' | 'CINEMATIC_DRAMATIC';
  meetingRoomEnclosed?: boolean;
  ledScreenScale?: 'STANDARD' | 'PANORAMIC_CURVED' | 'DOUBLE_WALL' | 'NONE';
  receptionStyle?: 'FLOATING_LED_POD' | 'WOOD_CURVED_BAR' | 'MONOLITHIC_MARBLE' | 'MINIMAL_COUNTER';
  furnitureDensity?: 'MINIMAL_OPEN' | 'BALANCED_EXECUTIVE' | 'HIGH_CAPACITY_LOUNGE';
  productDisplayCount?: number;
  brandingProminence?: 'SUBTLE' | 'BALANCED' | 'MAXIMUM_HERO';
  styleModifiers?: ('MORE_PREMIUM' | 'MORE_MODERN' | 'MORE_MINIMAL' | 'REDUCE_CLUTTER' | 'WARM_HOSPITALITY')[];
  naturalLanguageInstruction?: string;
}

export interface QualityValidationReport {
  passed: boolean;
  overallScore: number; // 0 - 100
  checks: {
    name: string;
    description: string;
    passed: boolean;
    details?: string;
  }[];
  detectedArtifacts: string[];
  recommendations: string[];
}

export type GenerationProgressStep = 
  | 'LOCKING_APPROVED_DESIGN'
  | 'PREPARING_3D_SCENE'
  | 'APPLYING_BRAND_IDENTITY'
  | 'BUILDING_ARCHITECTURAL_PROMPT'
  | 'GENERATING_HIGH_RES_RENDER'
  | 'ENHANCING_DETAILS'
  | 'UPSCALING_8K'
  | 'FINAL_QUALITY_CHECK'
  | 'PREPARING_PRESENTATION_ASSETS'
  | 'COMPLETED'
  | 'FAILED';

export interface FinalRenderRecord {
  id: string;
  projectId: string;
  designId?: string;
  versionNumber: number; // e.g., 1 for V1, 2 for V2
  versionLabel: string;  // e.g., "Final Render V1"
  provider: 'GOOGLE_IMAGEN_3' | 'GOOGLE_GEMINI_IMAGE' | 'EXPOCRAFT_AI_ADAPTER';
  model: string;
  nativeResolution: string; // e.g. "2048x2048" or "1024x1024"
  upscaledResolution: string; // e.g. "7680x4320 (8K UHD Presentation Standard)"
  width: number;
  height: number;
  heroImageUrl: string;
  heroImage8kUrl: string;
  views: FinalRenderView[];
  promptVersion: string;
  compiledPrompt: string;
  refinementsApplied?: DesignRefinements;
  generationStatus: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  currentStep?: GenerationProgressStep;
  progressPercent: number;
  qualityStatus: 'PASSED' | 'WARNING' | 'FAILED';
  qualityReport: QualityValidationReport;
  brandingComposited: boolean;
  isQuotationHero: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface AiConfigStatus {
  connected: boolean;
  status: 'CONNECTED' | 'NOT_CONNECTED' | 'INVALID_KEY' | 'CONNECTION_FAILED' | 'QUOTA_ERROR';
  providerName: string;
  model: string;
  maskedKey: string;
  lastChecked?: string;
  errorDetails?: string;
}

