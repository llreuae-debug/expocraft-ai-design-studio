import { Project } from "@/types";
import { TechnicalTakeoffSpec, DetailedBOQLineItem } from "@/types/boq";

export function computeTechnicalTakeoff(project: Project): TechnicalTakeoffSpec {
  const { width, depth, height, openSides, totalAreaSqm, totalAreaSqft } = project.dimensions;
  const unit = project.dimensions.unit;

  // 1. Calculate Perimeter Wall Area based on Open Sides configuration
  let wallPerimeterLinearMeters = 0;
  if (openSides === "1_SIDE_INLINE") {
    // 3 sides enclosed (Back + Left + Right)
    wallPerimeterLinearMeters = width + depth * 2;
  } else if (openSides === "2_SIDES_CORNER") {
    // 2 sides enclosed (Back + Left)
    wallPerimeterLinearMeters = width + depth;
  } else if (openSides === "3_SIDES_PENINSULA") {
    // 1 side enclosed (Back only)
    wallPerimeterLinearMeters = width;
  } else {
    // 4 sides open Island (Free-standing feature walls approx 40% of perimeter)
    wallPerimeterLinearMeters = width * 0.4 + depth * 0.4;
  }

  const rawWallAreaSqm = Number((wallPerimeterLinearMeters * height).toFixed(2));
  const rawWallAreaSqft = Number((rawWallAreaSqm * 10.7639).toFixed(2));

  // 2. Branding Area (Fascia Header + Reception Plaque + Wall Graphic Infill)
  const brandingAreaSqm = Number((width * 0.8 + rawWallAreaSqm * 0.45).toFixed(2));
  const brandingAreaSqft = Number((brandingAreaSqm * 10.7639).toFixed(2));

  // 3. Electrical Load Calculation
  // LED Wall (approx 0.6 kW per sqm) + Lighting Spotlights (0.15 kW per fixture) + Refrigerator/Pantry (1.5 kW) + Base 2.0 kW
  const avScreenAreaSqm = project.brief.hasLedScreen ? Number((width * 0.5 * 2.5).toFixed(1)) : 0;
  const spotlightsCount = Math.max(6, Math.ceil(totalAreaSqm / 5));
  const electricalTotalKw = Number((2.0 + avScreenAreaSqm * 0.6 + spotlightsCount * 0.15 + (project.brief.hasPantryStorage ? 1.5 : 0)).toFixed(1));

  // 4. Furniture counts
  const furnitureCountTotal = 1 + (project.brief.meetingRoomsCount || 1) * 4 + (project.brief.productDisplaysCount || 2);

  return {
    floorAreaSqm: totalAreaSqm,
    floorAreaSqft: totalAreaSqft,
    wallAreaSqm: rawWallAreaSqm,
    wallAreaSqft: rawWallAreaSqft,
    brandingAreaSqm,
    brandingAreaSqft,
    flooringQuantitySqm: Number((totalAreaSqm * 1.05).toFixed(2)), // 5% waste allowance
    structuralTimberSqm: rawWallAreaSqm,
    aluminumTrussLinearMeters: Number((width * 2 + depth * 2).toFixed(1)),
    glassPanelsCount: project.brief.meetingRoomsCount ? 4 : 0,
    acrylicSheetsCount: Math.ceil(totalAreaSqm / 12),
    furnitureCountTotal,
    lightingFixturesCount: spotlightsCount + (project.dimensions.totalAreaSqm >= 36 ? 8 : 4),
    lightingLinearMeters: Number((width * 2 + depth * 2).toFixed(1)),
    electricalTotalKw,
    electricalPointsCount: Math.ceil(totalAreaSqm / 8) + 3,
    avScreenAreaSqm,
    displayPlinthsCount: project.brief.productDisplaysCount || 3,
  };
}

export function generateInitial16CategoryBOQ(project: Project): DetailedBOQLineItem[] {
  const takeoff = computeTechnicalTakeoff(project);
  const city = project.exhibition.city || "Dubai";

  return [
    // 1. Structure
    {
      id: "boq-1",
      category: "Structure",
      itemCode: "STR-01",
      description: `Primary Structural Timber Framework (H: ${project.dimensions.height}m) with Bracing`,
      quantity: takeoff.wallAreaSqm,
      unit: "sqm",
      material: "Structural C16 Timber Studs & Fire Retardant Framing",
      unitRate: 48,
      labourCost: 22,
      totalCost: takeoff.wallAreaSqm * 70,
      markupPercent: 30,
      clientRate: 91,
      totalClientPrice: Number((takeoff.wallAreaSqm * 91).toFixed(2)),
      supplierSource: `${city} Structural Joinery Co.`,
      confidenceScore: 96,
      confidenceLevel: "VERIFIED_SUPPLIER",
    },
    // 2. Carpentry
    {
      id: "boq-2",
      category: "Carpentry",
      itemCode: "CRP-02",
      description: "Custom Reception Desk Pod with Internal Storage, Cable Glands & Curved Return",
      quantity: 1,
      unit: "set",
      material: "18mm High-Density MDF with Seamless PU Finish",
      unitRate: 1450,
      labourCost: 550,
      totalCost: 2000,
      markupPercent: 35,
      clientRate: 2700,
      totalClientPrice: 2700,
      supplierSource: `${city} Joinery Guild`,
      confidenceScore: 98,
      confidenceLevel: "VERIFIED_SUPPLIER",
    },
    // 3. MDF/Plywood
    {
      id: "boq-3",
      category: "MDF/Plywood",
      itemCode: "MDF-01",
      description: "18mm Class-0 Fire Rated MDF Sheeting with Shadow Gap Details",
      quantity: Math.ceil(takeoff.wallAreaSqm * 1.8),
      unit: "sqm",
      material: "Class-0 Flame Retardant MDF",
      unitRate: 36,
      labourCost: 14,
      totalCost: Math.ceil(takeoff.wallAreaSqm * 1.8) * 50,
      markupPercent: 30,
      clientRate: 65,
      totalClientPrice: Number((Math.ceil(takeoff.wallAreaSqm * 1.8) * 65).toFixed(2)),
      supplierSource: "National Timber Supply",
      confidenceScore: 95,
      confidenceLevel: "VERIFIED_SUPPLIER",
    },
    // 4. Aluminum
    {
      id: "boq-4",
      category: "Aluminum",
      itemCode: "ALU-03",
      description: "Modular Heavy-Duty Aluminum Perimeter Ceiling Fascia Frame (50x50mm)",
      quantity: takeoff.aluminumTrussLinearMeters,
      unit: "lm",
      material: "Anodized Architectural Aluminum Profile",
      unitRate: 42,
      labourCost: 18,
      totalCost: takeoff.aluminumTrussLinearMeters * 60,
      markupPercent: 28,
      clientRate: 76.8,
      totalClientPrice: Number((takeoff.aluminumTrussLinearMeters * 76.8).toFixed(2)),
      supplierSource: "Alumatech Global",
      confidenceScore: 92,
      confidenceLevel: "VERIFIED_SUPPLIER",
    },
    // 5. Glass
    {
      id: "boq-5",
      category: "Glass",
      itemCode: "GLS-01",
      description: "10mm Toughened Safety Glass Partitions for Meeting Room with Smoked Tint",
      quantity: takeoff.glassPanelsCount || 2,
      unit: "panels",
      material: "10mm Toughened Glass with Polished Edges",
      unitRate: 320,
      labourCost: 110,
      totalCost: (takeoff.glassPanelsCount || 2) * 430,
      markupPercent: 32,
      clientRate: 567.6,
      totalClientPrice: Number(((takeoff.glassPanelsCount || 2) * 567.6).toFixed(2)),
      supplierSource: "Gulf Glass Fabricators",
      confidenceScore: 94,
      confidenceLevel: "VERIFIED_SUPPLIER",
    },
    // 6. Acrylic
    {
      id: "boq-6",
      category: "Acrylic",
      itemCode: "ACR-02",
      description: "8mm Opal Translucent Backlit Acrylic Light Diffuser Panels",
      quantity: takeoff.acrylicSheetsCount,
      unit: "sheets",
      material: "Cast Acrylic Opal 050",
      unitRate: 160,
      labourCost: 45,
      totalCost: takeoff.acrylicSheetsCount * 205,
      markupPercent: 30,
      clientRate: 266.5,
      totalClientPrice: Number((takeoff.acrylicSheetsCount * 266.5).toFixed(2)),
      supplierSource: "Perspex Middle East",
      confidenceScore: 91,
      confidenceLevel: "VERIFIED_SUPPLIER",
    },
    // 7. Flooring
    {
      id: "boq-7",
      category: "Flooring",
      itemCode: "FLR-01",
      description: "100mm Raised Floor Platform with High-Gloss Epoxy Finish & Aluminum Ramp Edges",
      quantity: takeoff.flooringQuantitySqm,
      unit: "sqm",
      material: "Heavy Duty Platform with Acrylic/Vinyl Topcoat",
      unitRate: 55,
      labourCost: 20,
      totalCost: takeoff.flooringQuantitySqm * 75,
      markupPercent: 30,
      clientRate: 97.5,
      totalClientPrice: Number((takeoff.flooringQuantitySqm * 97.5).toFixed(2)),
      supplierSource: "FloorCraft Contracts",
      confidenceScore: 97,
      confidenceLevel: "VERIFIED_SUPPLIER",
    },
    // 8. Printing
    {
      id: "boq-8",
      category: "Printing",
      itemCode: "PRN-01",
      description: "High-Resolution Seamless SEG Dye-Sublimation Backlit Fabric Graphics",
      quantity: takeoff.brandingAreaSqm,
      unit: "sqm",
      material: "210gsm Samba Backlit Fabric with Silicone Keder",
      unitRate: 38,
      labourCost: 12,
      totalCost: takeoff.brandingAreaSqm * 50,
      markupPercent: 35,
      clientRate: 67.5,
      totalClientPrice: Number((takeoff.brandingAreaSqm * 67.5).toFixed(2)),
      supplierSource: "TexPrint Global UAE",
      confidenceScore: 98,
      confidenceLevel: "VERIFIED_SUPPLIER",
    },
    // 9. Branding
    {
      id: "boq-9",
      category: "Branding",
      itemCode: "BRN-02",
      description: `Precision CNC 3D Acrylic Backlit Corporate Logo (${project.client.companyName}) with Warm White LEDs`,
      quantity: 2,
      unit: "sets",
      material: "15mm CNC Cut Acrylic with Integrated Samsung LED Modules",
      unitRate: 650,
      labourCost: 220,
      totalCost: 1740,
      markupPercent: 35,
      clientRate: 1174.5,
      totalClientPrice: 2349,
      supplierSource: "Apex Signage & Neon",
      confidenceScore: 96,
      confidenceLevel: "VERIFIED_SUPPLIER",
    },
    // 10. Furniture
    {
      id: "boq-10",
      category: "Furniture",
      itemCode: "FUR-01",
      description: "Designer VIP Lounge Package: Velvet Armchairs, Coffee Table, Barstools & Brochure Display",
      quantity: 1,
      unit: "package",
      material: "Italian Velvet Seating & Matte Black Metal Frames",
      unitRate: 1600,
      labourCost: 200,
      totalCost: 1800,
      markupPercent: 30,
      clientRate: 2340,
      totalClientPrice: 2340,
      supplierSource: "Exhibition Hire Masters",
      confidenceScore: 95,
      confidenceLevel: "VERIFIED_SUPPLIER",
    },
    // 11. Lighting
    {
      id: "boq-11",
      category: "Lighting",
      itemCode: "LGT-01",
      description: "LED Theatrical Long-Arm Spotlights (50W 4000K) + Concealed Cove LED Strips",
      quantity: takeoff.lightingFixturesCount,
      unit: "fixtures",
      material: "CREE LED Chip 50W CRI>90 with Electronic Drivers",
      unitRate: 65,
      labourCost: 25,
      totalCost: takeoff.lightingFixturesCount * 90,
      markupPercent: 30,
      clientRate: 117,
      totalClientPrice: Number((takeoff.lightingFixturesCount * 117).toFixed(2)),
      supplierSource: "Osram / Philips Stage Lighting",
      confidenceScore: 94,
      confidenceLevel: "VERIFIED_SUPPLIER",
    },
    // 12. Electrical
    {
      id: "boq-12",
      category: "Electrical",
      itemCode: "ELC-01",
      description: `Complete Onsite Electrical Distribution Panel (${takeoff.electricalTotalKw} kW), Main Incomer & Sockets`,
      quantity: 1,
      unit: "lot",
      material: "DEWA / DWTC Certified 3-Phase Distribution DB with RCD Protection",
      unitRate: 1400,
      labourCost: 650,
      totalCost: 2050,
      markupPercent: 25,
      clientRate: 2562.5,
      totalClientPrice: 2562.5,
      supplierSource: "Certified Show Power LLC",
      confidenceScore: 99,
      confidenceLevel: "VERIFIED_SUPPLIER",
    },
    // 13. AV
    {
      id: "boq-13",
      category: "AV",
      itemCode: "AV-01",
      description: `P2.6 High Refresh Rate Indoor LED Video Wall (${takeoff.avScreenAreaSqm || 12} sqm) with 4K Processor`,
      quantity: takeoff.avScreenAreaSqm || 12,
      unit: "sqm",
      material: "Unilumin / Absen P2.6 Rental Cabinets with Novastar 4K Controller",
      unitRate: 480,
      labourCost: 150,
      totalCost: (takeoff.avScreenAreaSqm || 12) * 630,
      markupPercent: 28,
      clientRate: 806.4,
      totalClientPrice: Number(((takeoff.avScreenAreaSqm || 12) * 806.4).toFixed(2)),
      supplierSource: "DWTC Official AV Partner",
      confidenceScore: 97,
      confidenceLevel: "VERIFIED_SUPPLIER",
    },
    // 14. Transport
    {
      id: "boq-14",
      category: "Transport",
      itemCode: "TRN-01",
      description: "Dedicated 40ft Air-Ride Logistics Trucking to Venue (Round Trip)",
      quantity: 1,
      unit: "trip",
      material: "Logistics Freight with Tail-Lift & Protective Crating",
      unitRate: 1100,
      labourCost: 400,
      totalCost: 1500,
      markupPercent: 20,
      clientRate: 1800,
      totalClientPrice: 1800,
      supplierSource: "Global Expo Logistics",
      confidenceScore: 96,
      confidenceLevel: "VERIFIED_SUPPLIER",
    },
    // 15. Installation
    {
      id: "boq-15",
      category: "Installation",
      itemCode: "INS-01",
      description: "Turnkey Onsite Build Crew (Carpenters, Riggers, Electricians, Painters) 24/7 Setup",
      quantity: 1,
      unit: "lump sum",
      material: "Master Craftsmanship Team with Venue Badges & Safety Gear",
      unitRate: 4500,
      labourCost: 2800,
      totalCost: 7300,
      markupPercent: 22,
      clientRate: 8906,
      totalClientPrice: 8906,
      supplierSource: "ExpoCraft In-House Build Ops",
      confidenceScore: 100,
      confidenceLevel: "VERIFIED_SUPPLIER",
    },
    // 16. Dismantling
    {
      id: "boq-16",
      category: "Dismantling",
      itemCode: "DIS-01",
      description: "Post-Show Rapid Teardown, Eco-Friendly Waste Sorting & Site Clearance within 24 Hours",
      quantity: 1,
      unit: "lump sum",
      material: "Disassembly Crew & Licensed Venue Waste Clearance",
      unitRate: 1800,
      labourCost: 1200,
      totalCost: 3000,
      markupPercent: 20,
      clientRate: 3600,
      totalClientPrice: 3600,
      supplierSource: "ExpoCraft In-House Teardown Ops",
      confidenceScore: 100,
      confidenceLevel: "VERIFIED_SUPPLIER",
    },
  ];
}
