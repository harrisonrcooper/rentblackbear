import { describe, it, expect } from "vitest";
import { hexToRgb, mixColors, intensityColor, GROUP_META } from "../colors";

describe("hexToRgb", () => {
  it("parses 6-digit hex with or without leading #", () => {
    expect(hexToRgb("#ff0000")).toEqual([255, 0, 0]);
    expect(hexToRgb("00ff00")).toEqual([0, 255, 0]);
    expect(hexToRgb("#0000FF")).toEqual([0, 0, 255]);
  });

  it("returns null for garbage / unsupported formats", () => {
    expect(hexToRgb(null)).toBeNull();
    expect(hexToRgb("")).toBeNull();
    expect(hexToRgb("#fff")).toBeNull(); // 3-digit shorthand unsupported
    expect(hexToRgb("rgb(255,0,0)")).toBeNull();
    expect(hexToRgb("not a color")).toBeNull();
  });
});

describe("mixColors", () => {
  it("interpolates linearly between two hex colors", () => {
    // 50% mix of black + white → mid grey (128, 128, 128)
    expect(mixColors("#000000", "#ffffff", 0.5)).toBe("rgb(128, 128, 128)");
  });

  it("t=0 returns the bg color; t=1 returns the fg color", () => {
    expect(mixColors("#ff0000", "#00ff00", 0)).toBe("rgb(255, 0, 0)");
    expect(mixColors("#ff0000", "#00ff00", 1)).toBe("rgb(0, 255, 0)");
  });

  it("falls back to fgHex when one input is not parseable", () => {
    // COLORS.surfaceTint is "var(--bb-surface-tint)" at runtime —
    // intensityColor passes that through, so mixColors must not throw
    // and must return the fgHex.
    expect(mixColors("var(--bb-surface-tint)", "#4a7c59", 0.5)).toBe("#4a7c59");
  });
});

describe("intensityColor", () => {
  it("returns a string (no exceptions) for every intensity 1..4", () => {
    for (const i of [1, 2, 3, 4]) {
      const out = intensityColor("#4a7c59", i);
      expect(typeof out).toBe("string");
      expect(out.length).toBeGreaterThan(0);
    }
  });

  it("unknown intensity falls back to the lowest band", () => {
    const lowest = intensityColor("#4a7c59", 1);
    const unknown = intensityColor("#4a7c59", 99);
    expect(unknown).toBe(lowest);
  });
});

describe("GROUP_META", () => {
  it("ships every documented category group", () => {
    const keys = Object.keys(GROUP_META);
    expect(keys).toEqual(expect.arrayContaining([
      "giving", "housing", "transport", "food", "personal",
      "kids", "debt", "yearly", "retirement", "other",
    ]));
  });

  it("every entry has label + accent + bg + icon", () => {
    for (const [, meta] of Object.entries(GROUP_META)) {
      expect(meta.label).toBeTruthy();
      expect(meta.accent).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(meta.bg).toContain("rgba(");
      expect(meta.icon).toBeTruthy();
    }
  });
});
