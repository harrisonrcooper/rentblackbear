import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { SECTION_IDS, isSectionId } from "../sections";

describe("section ids", () => {
  it("matches every section BuildClient renders", () => {
    const src = readFileSync(resolve(__dirname, "../../../app/admin/build/BuildClient.jsx"), "utf8");
    const block = src.slice(src.indexOf("const SECTIONS = ["), src.indexOf("];", src.indexOf("const SECTIONS = [")));
    const ids = [...block.matchAll(/\{ id: "([a-z]+)"/g)].map((m) => m[1]);

    expect(ids.length).toBeGreaterThan(0);
    expect([...ids].sort()).toEqual([...SECTION_IDS].sort());
  });

  it("rejects anything that is not a section", () => {
    expect(isSectionId("rooms")).toBe(true);
    expect(isSectionId("../../etc/passwd")).toBe(false);
    expect(isSectionId("")).toBe(false);
    expect(isSectionId(undefined)).toBe(false);
  });
});
