import {
  Accessibility,
  Activity,
  Baby,
  Droplets,
  Scale,
  User2,
  type LucideIcon,
} from "lucide-react";
import { ImpactIndicator } from "@/types/indicator.types";

export type IndicatorStatus = "success" | "warning" | "error" | "neutral";

/**
 * Card icon per impact indicator, keyed by its MSNP code.
 *
 * Only the icon lives here — headings come from the indicator's own name in the
 * API, so they stay authoritative and translated. Codes 1-10 are the plan's
 * impact tier and are stable; an unmapped code still renders, just without an
 * icon.
 */
export const IMPACT_INDICATOR_ICONS: Record<string, LucideIcon> = {
  "1": Baby, // stunting
  "2": Accessibility, // wasting
  "3": Baby, // low birth weight
  "4": Scale, // underweight
  "5": Scale, // child overweight
  "6": User2, // adolescent overweight
  "7": User2, // adult overweight
  "8": Activity, // women low BMI
  "9": Droplets, // child anaemia
  "10": Droplets, // women anaemia
};

/** Above this multiple of the year's target, an indicator reads as off track. */
const OFF_TRACK_RATIO = 1.5;

/**
 * Rates an indicator against *this fiscal year's* milestone, not the 2030
 * commitment — the card shows progress against what was due now, while the
 * badge shows where the plan ends up. Judging against 2030 would paint almost
 * every indicator red for the rest of the plan period.
 *
 * Every impact indicator is the prevalence of an adverse outcome, so lower is
 * always better. Nothing in the API marks direction, so an indicator where
 * higher is better would be rated backwards here — revisit if the impact tier
 * ever gains one.
 */
export const getIndicatorStatus = (
  indicator: ImpactIndicator
): IndicatorStatus => {
  const current = indicator.current?.value;
  const target = indicator.currentTarget?.value;

  if (current === null || current === undefined) return "neutral";
  if (target === null || target === undefined) return "neutral";

  if (current <= target) return "success";
  // A zero target can't be exceeded by a ratio, so treat any overshoot as off
  // track rather than dividing by zero.
  if (target === 0) return "error";
  return current / target <= OFF_TRACK_RATIO ? "warning" : "error";
};

/**
 * Trims a target down to what fits a badge: the comparator, the number and the
 * unit, dropping the survey attribution the plan appends
 * (`4 (स्टेप्स सर्वेक्षण)` → `4%`). Falls back to the full label when there is
 * no number to isolate, in which case the unit is left off — the text is prose,
 * not a measurement.
 */
export const formatTargetLabel = (
  target: ImpactIndicator["endTarget"],
  unit?: string | null
): string | undefined => {
  if (!target) return undefined;
  // Digits are Devanagari when the request locale is `ne`, ASCII otherwise.
  const match = /([<>≤≥]?\s*)([\d०-९.]+)/.exec(target.label);
  if (!match) return target.label;
  return `${match[1].trim()}${match[2]}${unit ?? ""}`;
};
