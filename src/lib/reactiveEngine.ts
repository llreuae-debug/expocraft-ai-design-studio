import { Project, StallDimensions } from "@/types";
import { computeTechnicalTakeoff, generateInitial16CategoryBOQ } from "./takeoffEngine";
import { DetailedBOQLineItem } from "@/types/boq";
import { MasterQuotationData } from "@/types/execution";

export interface RecalculatedProjectState {
  dimensions: StallDimensions;
  takeoff: ReturnType<typeof computeTechnicalTakeoff>;
  boqItems: DetailedBOQLineItem[];
  materialSubtotal: number;
  labourSubtotal: number;
  installationCost: number;
  dismantlingCost: number;
  transportCost: number;
  quotationGrandTotal: number;
}

/**
 * Single Connected Reactive Engine:
 * When stall dimensions (width, depth, height, unit) or open sides change,
 * this function automatically recalculates the entire dependent pipeline:
 * Takeoff -> BOQ line items -> Material cost -> Labour -> Installation -> Dismantling -> Quotation
 */
export function recalculateEntireProjectPipeline(
  project: Project,
  newDimensions: Partial<StallDimensions>
): Project {
  const updatedDims: StallDimensions = {
    ...project.dimensions,
    ...newDimensions,
    totalAreaSqm: Number(((newDimensions.width ?? project.dimensions.width) * (newDimensions.depth ?? project.dimensions.depth)).toFixed(2)),
    totalAreaSqft: Number(((newDimensions.width ?? project.dimensions.width) * (newDimensions.depth ?? project.dimensions.depth) * 10.7639).toFixed(2)),
  };

  const tempProject: Project = {
    ...project,
    dimensions: updatedDims,
  };

  // 1. Recompute Technical Takeoff
  const takeoff = computeTechnicalTakeoff(tempProject);

  // 2. Recompute 16-Category BOQ
  const newBoq = generateInitial16CategoryBOQ(tempProject);

  // 3. Recompute Commercial Costs
  const materialCost = newBoq
    .filter((i) => !["Transport", "Installation", "Dismantling"].includes(i.category))
    .reduce((acc, i) => acc + i.totalCost, 0);

  const directLabour = newBoq
    .filter((i) => !["Transport", "Installation", "Dismantling"].includes(i.category))
    .reduce((acc, i) => acc + i.labourCost * i.quantity, 0);

  const installation = newBoq.find((i) => i.category === "Installation")?.totalCost || 7300;
  const dismantling = newBoq.find((i) => i.category === "Dismantling")?.totalCost || 3000;
  const transport = newBoq.find((i) => i.category === "Transport")?.totalCost || 1500;

  const directTotal = materialCost + directLabour + installation + dismantling + transport;
  const overhead = (directTotal * (project.budget.targetMarginPercent || 25)) / 100;
  const vat = ((directTotal + overhead) * 5) / 100;
  const grandTotal = Number((directTotal + overhead + vat).toFixed(2));

  // 4. Return the fully synchronized project object
  return {
    ...tempProject,
    dimensions: updatedDims,
    budget: {
      ...project.budget,
      targetBudgetMax: grandTotal,
    },
    boqItems: newBoq.map((item) => ({
      id: item.id,
      category: item.category === "MDF/Plywood" ? "WALLS_PARTITIONS" : "FLOORING",
      itemCode: item.itemCode,
      name: item.description,
      description: item.material,
      unit: item.unit,
      quantity: item.quantity,
      unitCost: item.unitRate,
      subtotal: item.totalCost,
      markupPercent: item.markupPercent,
      clientRate: item.clientRate,
      totalClientPrice: item.totalClientPrice,
    })),
    quotations: [
      {
        id: `qt-${Date.now()}`,
        quotationNumber: `QT-2026-${project.projectCode.replace("EXP-2026-", "")}-AUTO`,
        version: project.quotations.length + 1,
        issueDate: new Date().toISOString().split("T")[0],
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        subtotalCost: directTotal,
        overheadMargin: overhead,
        discountAmount: 0,
        vatPercent: 5,
        vatAmount: vat,
        grandTotal,
        currency: project.budget.currency,
        status: "DRAFT",
        clientNotes: `Auto-recalculated for ${updatedDims.width}x${updatedDims.depth}m ${updatedDims.openSides.replace(/_/g, " ")} stand space.`,
      },
    ],
    activityLogs: [
      ...project.activityLogs,
      {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: "Reactive Engine",
        role: "ADMIN",
        action: "Dimensions & BOQ Auto-Recalculated",
        details: `Updated dimensions to ${updatedDims.width}x${updatedDims.depth}m. Recomputed takeoff area ${updatedDims.totalAreaSqm} m² and grand total ${grandTotal}.`,
      },
    ],
  };
}
