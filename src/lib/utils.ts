import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MeasurementUnit } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Precision conversions
export const METERS_TO_FEET = 3.28084;
export const SQM_TO_SQFT = 10.7639;

export function convertDimension(value: number, from: MeasurementUnit, to: MeasurementUnit): number {
  if (from === to) return value;
  if (from === 'METERS' && to === 'FEET') {
    return Number((value * METERS_TO_FEET).toFixed(2));
  }
  return Number((value / METERS_TO_FEET).toFixed(2));
}

export function calculateArea(width: number, depth: number, unit: MeasurementUnit) {
  const rawArea = width * depth;
  if (unit === 'METERS') {
    const areaSqm = Number(rawArea.toFixed(2));
    const areaSqft = Number((rawArea * SQM_TO_SQFT).toFixed(2));
    return { areaSqm, areaSqft };
  } else {
    const areaSqft = Number(rawArea.toFixed(2));
    const areaSqm = Number((rawArea / SQM_TO_SQFT).toFixed(2));
    return { areaSqm, areaSqft };
  }
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const symbolMap: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'AED ',
    SAR: 'SAR ',
    INR: '₹',
  };
  const sym = symbolMap[currency] || `${currency} `;
  return `${sym}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatDimension(val: number, unit: MeasurementUnit): string {
  return `${val} ${unit === 'METERS' ? 'm' : 'ft'}`;
}

export function generateProjectCode(existingCount: number = 0): string {
  const year = new Date().getFullYear();
  const seq = String(existingCount + 1).padStart(3, '0');
  return `EXP-${year}-${seq}`;
}
