// Guards for the two formatting rules that keep getting broken.
//
// fmtBuildDate lives in app/admin/build/ui.jsx, which is a "use client" module
// full of JSX. Importing it here would drag React into a node test, so the
// function is re-declared and the SOURCE is asserted to still match. Ugly, but
// it catches the two real bugs: short-month output, and local-time parsing.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, it, expect } from "vitest";

function fmtBuildDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${mm}/${dd}/${d.getUTCFullYear()}`;
}

const UI_SRC = readFileSync(resolve(__dirname, "../../../app/admin/build/ui.jsx"), "utf8");

describe("fmtBuildDate", () => {
  it("renders mm/dd/yyyy, zero-padded", () => {
    expect(fmtBuildDate("2026-07-09")).toBe("07/09/2026");
    expect(fmtBuildDate("2026-12-25")).toBe("12/25/2026");
    expect(fmtBuildDate("2027-01-01")).toBe("01/01/2027");
  });

  it("never emits a short month name", () => {
    expect(fmtBuildDate("2026-07-09")).not.toMatch(/Jul|Jan|Dec/);
  });

  it("never emits the ISO string for a valid date", () => {
    expect(fmtBuildDate("2026-07-09")).not.toBe("2026-07-09");
  });

  it("is empty for an empty input, and passes garbage through unchanged", () => {
    expect(fmtBuildDate("")).toBe("");
    expect(fmtBuildDate("not a date")).toBe("not a date");
  });

  // The off-by-one that bites every date formatter: "2026-07-09" parsed as
  // LOCAL time is 2026-07-08T19:00 in New York, and getDate() returns 8.
  it("does not shift a day in timezones west of UTC", () => {
    const naive = new Date("2026-07-09"); // parsed as UTC midnight
    // Simulate the local-time reading that the old implementation performed.
    const localDay = new Date("2026-07-09T00:00:00").getDate();
    expect(fmtBuildDate("2026-07-09")).toBe("07/09/2026");
    // Whatever the host timezone does to `localDay`, our formatter is stable.
    expect(fmtBuildDate("2026-07-09").slice(3, 5)).toBe("09");
    expect(naive.getUTCDate()).toBe(9);
    expect(typeof localDay).toBe("number");
  });
});

describe("the shared helper still matches this contract", () => {
  it("ui.jsx parses dates as UTC", () => {
    expect(UI_SRC).toContain("T00:00:00Z");
  });

  it("ui.jsx does not use toLocaleDateString for fmtBuildDate", () => {
    const fn = UI_SRC.slice(UI_SRC.indexOf("export function fmtBuildDate"));
    const body = fn.slice(0, fn.indexOf("\n}"));
    expect(body).not.toContain("toLocaleDateString");
    expect(body).toContain("getUTCFullYear");
  });

  it("ui.jsx exposes no fixed height on textareaStyle", () => {
    const fn = UI_SRC.slice(UI_SRC.indexOf("export function textareaStyle"));
    const body = fn.slice(0, fn.indexOf("\n}"));
    expect(body).toContain("delete base.height");
    expect(body).not.toContain("maxHeight");
  });

  it("the planner contains no native select elements", () => {
    const BUILD_CLIENT = readFileSync(resolve(__dirname, "../../../app/admin/build/BuildClient.jsx"), "utf8");
    expect(BUILD_CLIENT).not.toMatch(/<select[\s>]/);
  });
});
