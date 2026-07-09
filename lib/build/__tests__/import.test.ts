import { describe, it, expect } from "vitest";

import { applyToState, planImport, planSize } from "../../../scripts/build/plan-import.mjs";

let n = 0;
const newId = (p: string) => `${p}_${n++}`;

const state = () => ({
  rooms: [
    { id: "r0", name: "Studio", details: "" },
    { id: "r1", name: "Basement", details: "Walkout basement." },
  ],
  wishlist: [
    { id: "w0", label: "Swimming pool", priority: "dream", done: false },
    { id: "w1", label: "Gym equipment", priority: "want", done: false }, // already there
  ],
  references: [
    { id: "ref0", url: "https://www.aquafire.com/products/aquafire-pro", title: "Aquafire", tag: "Products", note: "" },
  ],
  selections: [
    { id: "s0", label: "Electrical panel", choice: "SPAN", notes: "" },
    { id: "s1", label: "Framing", choice: "2x8", notes: "" },
  ],
  team: [
    { id: "t0", role: "Cabinets, closets & countertops", name: "Sjumbo — Kasin", contact: "+86", notes: "" },
    { id: "t1", role: "HVAC design", name: "Positive Energy", contact: "" },
  ],
});

describe("planImport", () => {
  it("proposes the two missing links and skips one already present", () => {
    const plan = planImport(state(), []);
    expect(plan.references.map((r: { url: string }) => r.url)).toEqual([
      "https://www.facebook.com/groups/1637797286875381/",
      "https://www.facebook.com/share/p/1Kzmaz87Sk/",
    ]);
  });

  // Regression: normUrl used to strip the path, so every link on a host
  // deduped against every other. Both Facebook links vanished from the plan.
  it("distinguishes two different URLs on the same host", () => {
    const s = state();
    s.references.push({
      id: "ref1",
      url: "https://www.facebook.com/charlie.hartwig.9/videos/4068352953310852/",
      title: "Charlie Hartwig — build video", tag: "Videos", note: "",
    });
    const plan = planImport(s, []);
    expect(plan.references.map((r: { url: string }) => r.url)).toEqual([
      "https://www.facebook.com/groups/1637797286875381/",
      "https://www.facebook.com/share/p/1Kzmaz87Sk/",
    ]);
    expect(plan.skipped.references).toBe(0);
  });

  it("still dedupes the SAME url written differently", () => {
    const s = state();
    s.references.push({ id: "ref1", url: "http://facebook.com/groups/1637797286875381?ref=x", title: "", tag: "", note: "" });
    const plan = planImport(s, []);
    expect(plan.references.map((r: { url: string }) => r.url)).toEqual([
      "https://www.facebook.com/share/p/1Kzmaz87Sk/",
    ]);
    expect(plan.skipped.references).toBe(1);
  });

  it("skips a want that already exists, case- and punctuation-insensitively", () => {
    const s = state();
    s.wishlist.push({ id: "w2", label: "fake  plants!", priority: "dream", done: false });
    const plan = planImport(s, []);
    expect(plan.wants.map((w: { label: string }) => w.label)).not.toContain("Fake plants");
    expect(plan.wants.map((w: { label: string }) => w.label)).not.toContain("Gym equipment");
    expect(plan.skipped.wants).toBe(2);
  });

  it("attaches spec notes only to selections that exist", () => {
    const plan = planImport(state(), []);
    const labels = plan.selectionNotes.map((p: { label: string }) => p.label);
    expect(labels).toContain("Electrical panel");
    expect(labels).toContain("Framing");
    expect(labels).not.toContain("Lighting"); // no such selection in this fixture
  });

  it("proposes the Plumbing selection the seed never created", () => {
    const plan = planImport(state(), []);
    expect(plan.newSelections).toHaveLength(1);
    expect(plan.newSelections[0].label).toBe("Plumbing");
    expect(plan.newSelections[0].notes).toContain("Copper manifold");
    expect(plan.newSelections[0].notes).toContain("mini shower");
  });

  it("carries the Charlie Hartwig thread onto the cabinet vendor", () => {
    const plan = planImport(state(), []);
    const cab = plan.vendorNotes.find((v: { role: string }) => v.role.startsWith("Cabinets"));
    expect(cab.note).toContain("Charlie Hartwig");
    expect(cab.note).toContain("Matthew Mendez");
    expect(cab.note).toContain("Blum hardware");
  });

  it("turns Sheet21 into thirteen sourcing tasks, keeping the window-video note", () => {
    const plan = planImport(state(), []);
    expect(plan.sourcingTasks).toHaveLength(13);
    const windows = plan.sourcingTasks.find((t: { title: string }) => t.title.includes("windows"));
    expect(windows.notes).toContain("take videos of how they are installed");
    expect(windows.tags).toEqual(["china sourcing"]);
  });

  it("skips sourcing tasks that already exist", () => {
    const tasks = [{ id: "t", title: "Source windows in China", archived: false }];
    const plan = planImport(state(), tasks);
    expect(plan.sourcingTasks).toHaveLength(12);
    expect(plan.skipped.sourcingTasks).toBe(1);
  });

  it("ignores archived tasks when deduping", () => {
    const tasks = [{ id: "t", title: "Source windows in China", archived: true }];
    expect(planImport(state(), tasks).sourcingTasks).toHaveLength(13);
  });
});

describe("applyToState", () => {
  it("appends without mutating the input", () => {
    const before = state();
    const snapshot = JSON.parse(JSON.stringify(before));
    const plan = planImport(before, []);
    applyToState(before, plan, newId);
    expect(before).toEqual(snapshot);
  });

  it("appends a note rather than overwriting an existing one", () => {
    const s = state();
    s.selections[0].notes = "Existing note.";
    const plan = planImport(s, []);
    const after = applyToState(s, plan, newId);
    const sel = after.selections.find((x: { id: string }) => x.id === "s0");
    expect(sel.notes.startsWith("Existing note.")).toBe(true);
    expect(sel.notes).toContain("High-amp outlet");
  });

  it("appends to a room's details without losing what was there", () => {
    const plan = planImport(state(), []);
    const after = applyToState(state(), plan, newId);
    const basement = after.rooms.find((r: { id: string }) => r.id === "r1");
    expect(basement.details).toContain("Walkout basement.");
    expect(basement.details).toContain("Doesn't need an office");
  });

  it("never removes an existing row", () => {
    const before = state();
    const after = applyToState(before, planImport(before, []), newId);
    for (const key of ["rooms", "wishlist", "references", "selections", "team"] as const) {
      expect(after[key].length).toBeGreaterThanOrEqual(before[key].length);
      for (const row of before[key]) {
        expect(after[key].some((r: { id: string }) => r.id === row.id)).toBe(true);
      }
    }
  });

  // The property that makes this safe to run twice by accident.
  it("is IDEMPOTENT: a second run proposes nothing", () => {
    const first = state();
    const plan1 = planImport(first, []);
    expect(planSize(plan1)).toBeGreaterThan(0);

    const after = applyToState(first, plan1, newId);
    const tasksNow = plan1.sourcingTasks.map((t: { title: string }) => ({ id: "x", title: t.title, archived: false }));

    const plan2 = planImport(after, tasksNow);
    expect(planSize(plan2)).toBe(0);
  });
});
