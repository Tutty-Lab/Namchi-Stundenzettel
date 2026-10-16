// ============================================================================
// Unterbesetzung muss sichtbar werden statt still zu passieren.
//
// Namchi: jeden Tag 11:00–22:00; immer mindestens eine Person, bis 22:00.
// ============================================================================

import { describe, expect, it } from "vitest";
import { analyzeSchedule } from "../analyze";
import { DEFAULT_WORK_HOURS } from "../workHours";
import type { Employee, Shift } from "../../types";

const emp = (id: string): Employee => ({ id, name: id, employmentType: "TEILZEIT", targetMinutes: 60 * 60 });

const dienst = (id: string, date: string, from: number, to: number): Shift => ({
  id: `shift-${id}-${date}-${from}`,
  employeeId: id,
  date,
  startMinutes: from,
  endMinutes: to,
  pauseMinutes: 0,
  paidMinutes: to - from,
  shiftType: from >= 16 * 60 ? "LATE" : "EARLY",
  generated: true,
});

const peaksOf = (employees: Employee[], shifts: Shift[], date: string) =>
  analyzeSchedule({ year: 2026, month: 8, workHours: DEFAULT_WORK_HOURS, employees, shifts })
    .peakViolations.find((d) => d.date === date)?.peaks ?? [];

describe("Namchi – Besetzung", () => {
  it("lückenlos von 11 bis 22 Uhr ist in Ordnung", () => {
    const shifts = [dienst("a", "2026-08-04", 11 * 60, 17 * 60), dienst("b", "2026-08-04", 16 * 60, 22 * 60)];
    expect(peaksOf([emp("a"), emp("b")], shifts, "2026-08-04").filter((p) => !p.ok)).toEqual([]);
  });

  it("eine Lücke am Nachmittag wird gemeldet", () => {
    const shifts = [dienst("a", "2026-08-04", 11 * 60, 15 * 60), dienst("b", "2026-08-04", 16 * 60, 22 * 60)];
    expect(peaksOf([emp("a"), emp("b")], shifts, "2026-08-04").some((p) => !p.ok && p.label === "Trong giờ mở cửa")).toBe(true);
  });

  it("meldet, wenn bis 22:00 niemand mehr da ist", () => {
    const shifts = [dienst("a", "2026-08-04", 11 * 60, 17 * 60), dienst("b", "2026-08-04", 16 * 60, 21 * 60)];
    expect(peaksOf([emp("a"), emp("b")], shifts, "2026-08-04").some((p) => !p.ok && p.label === "Đóng cửa")).toBe(true);
  });
});
