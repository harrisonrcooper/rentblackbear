import { describe, it, expect } from "vitest";
import {
  DEFAULT_HABITS,
  HABIT_OWNERS,
  HABIT_STYLES,
  computeHabitStreak,
  buildHeatmap,
  buildGardenGrid,
  last7Days,
  longestStreak,
} from "../habits";

// Helper: build an ISO date `n` days before today.
function isoDaysAgo(n, today = new Date()) {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

describe("default tables", () => {
  it("DEFAULT_HABITS ships the canonical 6 habits with required fields", () => {
    expect(DEFAULT_HABITS).toHaveLength(6);
    for (const h of DEFAULT_HABITS) {
      expect(h.id).toBeTruthy();
      expect(h.label).toBeTruthy();
      expect(["daily", "weekly", "monthly"]).toContain(h.cadence);
      expect(["harrison", "carolina", "shared"]).toContain(h.owner);
    }
  });

  it("HABIT_OWNERS ships profile chips for all + harrison + carolina + shared", () => {
    expect(HABIT_OWNERS.map((o) => o.id)).toEqual(["all", "harrison", "carolina", "shared"]);
  });

  it("HABIT_STYLES exposes the three card styles", () => {
    expect(HABIT_STYLES.map((s) => s.id)).toEqual(["heatmap", "garden", "stride"]);
  });
});

describe("computeHabitStreak", () => {
  it("returns 0 when no completions", () => {
    expect(computeHabitStreak({})).toBe(0);
    expect(computeHabitStreak({ completions: [] })).toBe(0);
  });

  it("counts back from today when today is checked", () => {
    const completions = [isoDaysAgo(0), isoDaysAgo(1), isoDaysAgo(2)];
    expect(computeHabitStreak({ completions })).toBe(3);
  });

  it("forgives missing today — counts the run that ends yesterday", () => {
    const completions = [isoDaysAgo(1), isoDaysAgo(2), isoDaysAgo(3)];
    expect(computeHabitStreak({ completions })).toBe(3);
  });

  it("breaks on the first gap (today and yesterday both missing)", () => {
    const completions = [isoDaysAgo(3), isoDaysAgo(4)];
    expect(computeHabitStreak({ completions })).toBe(0);
  });
});

describe("buildHeatmap", () => {
  it("returns exactly `days` cells, oldest first", () => {
    const out = buildHeatmap([], 14);
    expect(out).toHaveLength(14);
    expect(out[13].iso).toBe(isoDaysAgo(0));
    expect(out[0].iso).toBe(isoDaysAgo(13));
  });

  it("marks done=true for cells matching the completions set", () => {
    const completions = [isoDaysAgo(0), isoDaysAgo(3)];
    const out = buildHeatmap(completions, 7);
    expect(out.find((c) => c.iso === isoDaysAgo(0)).done).toBe(true);
    expect(out.find((c) => c.iso === isoDaysAgo(3)).done).toBe(true);
    expect(out.find((c) => c.iso === isoDaysAgo(1)).done).toBe(false);
  });
});

describe("buildGardenGrid", () => {
  it("returns 7 rows × `weeks` cols", () => {
    const rows = buildGardenGrid([], 4);
    expect(rows).toHaveLength(7);
    for (const r of rows) expect(r).toHaveLength(4);
  });

  it("intensity is 0 when the day is not done", () => {
    const rows = buildGardenGrid([isoDaysAgo(0)], 2);
    // Find a cell that is not the most-recent (not done) and check intensity.
    const notDone = rows.flat().find((c) => c.iso && !c.done);
    expect(notDone.intensity).toBe(0);
  });

  it("most-recent done day reflects rolling-7-day window intensity", () => {
    // Mark every day in a 14-day window as done — today's intensity = 4
    // because 7 of the last 7 are checked.
    const completions = [];
    for (let i = 0; i < 14; i++) completions.push(isoDaysAgo(i));
    const rows = buildGardenGrid(completions, 2);
    const todayCell = rows.flat().find((c) => c.iso === isoDaysAgo(0));
    expect(todayCell.intensity).toBe(4);
  });
});

describe("last7Days", () => {
  it("returns exactly 7 cells, oldest first", () => {
    const out = last7Days([]);
    expect(out).toHaveLength(7);
    expect(out[6].iso).toBe(isoDaysAgo(0));
    expect(out[0].iso).toBe(isoDaysAgo(6));
  });

  it("flags done on matching dates", () => {
    const out = last7Days([isoDaysAgo(0), isoDaysAgo(2)]);
    expect(out.filter((c) => c.done).map((c) => c.iso))
      .toEqual(expect.arrayContaining([isoDaysAgo(0), isoDaysAgo(2)]));
  });
});

describe("longestStreak", () => {
  it("returns 0 for empty / null input", () => {
    expect(longestStreak([])).toBe(0);
    expect(longestStreak(null)).toBe(0);
    expect(longestStreak(undefined)).toBe(0);
  });

  it("returns 1 when only one completion exists", () => {
    expect(longestStreak(["2026-05-10"])).toBe(1);
  });

  it("finds the longest consecutive run across multiple gaps", () => {
    const completions = [
      "2026-05-01", "2026-05-02",                     // run of 2
      "2026-05-05", "2026-05-06", "2026-05-07", "2026-05-08", // run of 4
      "2026-05-10",                                   // run of 1
    ];
    expect(longestStreak(completions)).toBe(4);
  });

  it("deduplicates before measuring", () => {
    expect(longestStreak(["2026-05-01", "2026-05-01", "2026-05-02"])).toBe(2);
  });
});
