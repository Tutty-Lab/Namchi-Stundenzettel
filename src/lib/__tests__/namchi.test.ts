// Namchi: Startbelegschaft, Öffnungszeiten und Tagesgewichte im Planer.
import { describe, expect, it } from "vitest";
import { generateSchedule } from "../scheduler";
import { storeById } from "../stores";
import { parseIsoDate, weekdayKeyOf } from "../demand";
import { DEFAULT_WORK_HOURS } from "../workHours";

const store = storeById("namchi");

describe("Namchi", () => {
  const employees = store.sampleEmployees();
  const shifts = generateSchedule({
    year: 2026, month: 9, workHours: DEFAULT_WORK_HOURS, employees,
    rules: store.staffingRules, weights: store.dayWeights, storeTag: store.id,
  });

  it("Startbelegschaft: 9 Leute", () => {
    expect(employees).toHaveLength(9);
  });

  it("jeder Dienst liegt in 11:00–22:00", () => {
    for (const s of shifts) {
      expect(s.startMinutes).toBeGreaterThanOrEqual(11 * 60);
      expect(s.endMinutes).toBeLessThanOrEqual(22 * 60);
    }
  });

  it("Samstag bekommt mehr Stunden als Montag", () => {
    const sum = (day: string) =>
      shifts.filter((s) => weekdayKeyOf(parseIsoDate(s.date)) === day).reduce((t, s) => t + s.paidMinutes, 0);
    expect(sum("saturday")).toBeGreaterThan(sum("monday"));
  });
});
