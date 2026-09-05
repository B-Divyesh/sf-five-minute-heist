import { describe, expect, it } from "vitest";
import { enumeratePlans, findSolutions, generatePuzzle, pathGlyph, simulatePlan } from "../src/core";

describe("daily puzzle generator", () => {
  it("is deterministic and always produces a valid five-move plan", () => {
    for (let day = 1; day <= 40; day += 1) {
      const seed = `2026-09-${String(day).padStart(2, "0")}`;
      const first = generatePuzzle(seed);
      const second = generatePuzzle(seed);
      expect(second).toEqual(first);
      const solution = findSolutions(first)[0];
      expect(solution).toHaveLength(5);
      expect(simulatePlan(first, solution).won).toBe(true);
    }
  });

  it("rejects incomplete plans", () => {
    const puzzle = generatePuzzle("demo-gallery");
    const solution = findSolutions(puzzle)[0];
    expect(simulatePlan(puzzle, solution.slice(0, 4)).won).toBe(false);
  });

  it("creates five spoiler-free result symbols", () => {
    expect(pathGlyph(["U", "R", "D", "L", "U"], "demo-gallery")).toHaveLength(5);
    expect(pathGlyph(["U", "R", "D", "L", "U"], "demo-gallery")).not.toContain("↑");
  });

  it("enumerates every possible five-move route", () => {
    const plans = enumeratePlans();
    expect(plans).toHaveLength(4 ** 5);
    expect(new Set(plans.map((plan) => plan.join(""))).size).toBe(4 ** 5);
    expect(plans.every((plan) => plan.length === 5)).toBe(true);
  });
});
