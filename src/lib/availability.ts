// ============================================================================
// Wann darf eine Person an einem Tag eingeplant werden?
//
// Namchi kennt (noch) keinen Urlaub; die einzige Einschränkung sind feste
// Arbeitstage (availableWeekdays) und eine Höchstzahl an Tagen je Woche
// (maxDaysPerWeek). Alles steht hier an EINER Stelle.
// ============================================================================

import { format, startOfWeek } from "date-fns";
import type { Employee } from "../types";
import { parseIsoDate, weekdayKeyOf } from "./demand";

/** Montag der Woche, in der `isoDate` liegt (ISO, Woche Mo–So). */
export function weekStartOf(isoDate: string): string {
  return format(startOfWeek(parseIsoDate(isoDate), { weekStartsOn: 1 }), "yyyy-MM-dd");
}

/**
 * Arbeitet diese Person an diesem Wochentag überhaupt? Leere/fehlende Liste =
 * keine Einschränkung.
 */
export function worksOnWeekday(employee: Employee, isoDate: string): boolean {
  const tage = employee.availableWeekdays;
  if (!tage || tage.length === 0) return true;
  return tage.includes(weekdayKeyOf(parseIsoDate(isoDate)));
}

/** Darf diese Person an diesem Datum arbeiten? */
export function mayWorkOn(employee: Employee, isoDate: string): boolean {
  return worksOnWeekday(employee, isoDate);
}
