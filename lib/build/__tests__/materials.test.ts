import { describe, it, expect } from "vitest";

import {
  STATUS_ORDER,
  STATUS_LABEL,
  statusTone,
  extendedCents,
  groupsOf,
  chosenIn,
  cheapestIn,
  chooseWinner,
  totalCents,
  byRoom,
  byStatus,
} from "../materials";
import type { BuildMaterial, MaterialStatus } from "@/actions/build/_store";

// Build a material with sane defaults; override only what a test cares about.
function mk(p: Partial<BuildMaterial> = {}): BuildMaterial {
  return {
    id: p.id ?? "m1",
    name: p.name ?? "Material",
    category: p.category ?? "General",
    room_ids: p.room_ids ?? [],
    spec: p.spec ?? "",
    vendor: p.vendor ?? "",
    unit_price_cents: p.unit_price_cents ?? 0,
    quantity: p.quantity ?? 1,
    unit: p.unit ?? "each",
    lead_time: p.lead_time ?? "",
    status: p.status ?? "idea",
    url: p.url ?? "",
    photo_url: p.photo_url ?? "",
    compare_group: p.compare_group ?? "",
    is_chosen: p.is_chosen ?? false,
    notes: p.notes ?? "",
    archived: p.archived,
  };
}

describe("extendedCents", () => {
  it("multiplies unit price by whole quantity exactly", () => {
    expect(extendedCents(mk({ unit_price_cents: 12_50, quantity: 3 }))).toBe(37_50);
  });

  it("rounds a fractional quantity so cents stay integer", () => {
    // 899¢/sq ft × 12.5 sq ft = 11237.5¢ → 11238¢, never a half-cent.
    expect(extendedCents(mk({ unit_price_cents: 899, quantity: 12.5 }))).toBe(11_238);
  });

  it("is zero when price or quantity is zero", () => {
    expect(extendedCents(mk({ unit_price_cents: 0, quantity: 9 }))).toBe(0);
    expect(extendedCents(mk({ unit_price_cents: 5000, quantity: 0 }))).toBe(0);
  });

  it("treats missing numbers as zero rather than NaN", () => {
    expect(extendedCents({ ...mk({ quantity: 4 }), unit_price_cents: undefined as unknown as number })).toBe(0);
    expect(extendedCents({ ...mk({ unit_price_cents: 4 }), quantity: undefined as unknown as number })).toBe(0);
  });
});

describe("groupsOf", () => {
  it("buckets rows by comparison group and skips the ungrouped", () => {
    const rows = [
      mk({ id: "a", compare_group: "Cabinet doors" }),
      mk({ id: "b", compare_group: "" }),
      mk({ id: "c", compare_group: "Cabinet doors" }),
      mk({ id: "d", compare_group: "Tub" }),
    ];
    const g = groupsOf(rows);
    expect([...g.keys()]).toEqual(["Cabinet doors", "Tub"]);
    expect(g.get("Cabinet doors")!.map((m) => m.id)).toEqual(["a", "c"]);
    expect(g.get("Tub")!.map((m) => m.id)).toEqual(["d"]);
  });

  it("skips whitespace-only groups and trims keys so they merge", () => {
    const rows = [
      mk({ id: "a", compare_group: "   " }),
      mk({ id: "b", compare_group: "Faucet" }),
      mk({ id: "c", compare_group: " Faucet " }),
    ];
    const g = groupsOf(rows);
    expect([...g.keys()]).toEqual(["Faucet"]);
    expect(g.get("Faucet")!.map((m) => m.id)).toEqual(["b", "c"]);
  });

  it("returns an empty map for no materials", () => {
    expect(groupsOf([]).size).toBe(0);
  });
});

describe("chosenIn", () => {
  it("returns the chosen row", () => {
    const group = [mk({ id: "a" }), mk({ id: "b", is_chosen: true })];
    expect(chosenIn(group)?.id).toBe("b");
  });

  it("returns null when no row is chosen", () => {
    expect(chosenIn([mk({ id: "a" }), mk({ id: "b" })])).toBeNull();
  });
});

describe("cheapestIn", () => {
  it("finds the lowest extended price, not the lowest unit price", () => {
    const group = [
      mk({ id: "bulk", unit_price_cents: 100, quantity: 50 }), // 5000
      mk({ id: "single", unit_price_cents: 900, quantity: 1 }), // 900 ← cheapest extended
    ];
    expect(cheapestIn(group)?.id).toBe("single");
  });

  it("returns the first row on a tie", () => {
    const group = [
      mk({ id: "first", unit_price_cents: 1000, quantity: 2 }),
      mk({ id: "second", unit_price_cents: 2000, quantity: 1 }),
    ];
    expect(cheapestIn(group)?.id).toBe("first");
  });

  it("returns null for an empty group", () => {
    expect(cheapestIn([])).toBeNull();
  });
});

describe("chooseWinner", () => {
  it("sets is_chosen on the target and clears its siblings", () => {
    const rows = [
      mk({ id: "a", compare_group: "Doors", is_chosen: true }),
      mk({ id: "b", compare_group: "Doors" }),
      mk({ id: "c", compare_group: "Doors" }),
    ];
    const next = chooseWinner(rows, "b");
    expect(next.map((m) => [m.id, m.is_chosen])).toEqual([
      ["a", false],
      ["b", true],
      ["c", false],
    ]);
  });

  it("never touches rows in other groups or ungrouped rows", () => {
    const rows = [
      mk({ id: "a", compare_group: "Doors" }),
      mk({ id: "b", compare_group: "Tub", is_chosen: true }),
      mk({ id: "c", compare_group: "" }),
    ];
    const next = chooseWinner(rows, "a");
    expect(next.find((m) => m.id === "a")!.is_chosen).toBe(true);
    expect(next.find((m) => m.id === "b")!.is_chosen).toBe(true); // other group, untouched
    expect(next.find((m) => m.id === "c")!.is_chosen).toBe(false);
  });

  it("returns a new array and does not mutate the input", () => {
    const rows = [mk({ id: "a", compare_group: "Doors" })];
    const next = chooseWinner(rows, "a");
    expect(next).not.toBe(rows);
    expect(rows[0].is_chosen).toBe(false); // original untouched
    expect(next[0].is_chosen).toBe(true);
  });

  it("returns a fresh copy when the id is not found", () => {
    const rows = [mk({ id: "a" })];
    const next = chooseWinner(rows, "missing");
    expect(next).not.toBe(rows);
    expect(next.map((m) => m.is_chosen)).toEqual([false]);
  });

  it("chooses an ungrouped row without affecting anyone", () => {
    const rows = [mk({ id: "a", compare_group: "" }), mk({ id: "b", compare_group: "" })];
    const next = chooseWinner(rows, "a");
    expect(next.map((m) => m.is_chosen)).toEqual([true, false]);
  });
});

describe("totalCents", () => {
  it("counts a comparison exactly once — the chosen row", () => {
    const rows = [
      mk({ id: "a", compare_group: "Doors", unit_price_cents: 5000, quantity: 1 }),
      mk({ id: "b", compare_group: "Doors", unit_price_cents: 3000, quantity: 1, is_chosen: true }),
      mk({ id: "c", compare_group: "Doors", unit_price_cents: 4000, quantity: 1 }),
    ];
    expect(totalCents(rows)).toBe(3000);
  });

  it("counts a group with no chosen row as zero", () => {
    const rows = [
      mk({ id: "a", compare_group: "Doors", unit_price_cents: 5000, quantity: 1 }),
      mk({ id: "b", compare_group: "Doors", unit_price_cents: 3000, quantity: 1 }),
    ];
    expect(totalCents(rows)).toBe(0);
  });

  it("always counts ungrouped materials", () => {
    const rows = [
      mk({ id: "a", compare_group: "", unit_price_cents: 1500, quantity: 2 }), // 3000
      mk({ id: "b", compare_group: "", unit_price_cents: 500, quantity: 1 }), //   500
    ];
    expect(totalCents(rows)).toBe(3500);
  });

  it("mixes chosen groups, undecided groups and loose rows correctly", () => {
    const rows = [
      // Decided comparison → chosen 2000 counts, siblings ignored.
      mk({ id: "a", compare_group: "Doors", unit_price_cents: 9000, quantity: 1 }),
      mk({ id: "b", compare_group: "Doors", unit_price_cents: 2000, quantity: 1, is_chosen: true }),
      // Undecided comparison → contributes 0.
      mk({ id: "c", compare_group: "Tub", unit_price_cents: 8000, quantity: 1 }),
      mk({ id: "d", compare_group: "Tub", unit_price_cents: 7000, quantity: 1 }),
      // Loose rows → always counted.
      mk({ id: "e", compare_group: "", unit_price_cents: 1000, quantity: 3 }), // 3000
      mk({ id: "f", compare_group: "", unit_price_cents: 250, quantity: 4 }), //  1000
    ];
    expect(totalCents(rows)).toBe(2000 + 3000 + 1000);
  });

  it("is zero for no materials", () => {
    expect(totalCents([])).toBe(0);
  });
});

describe("byRoom", () => {
  it("returns materials tagged to the room", () => {
    const rows = [
      mk({ id: "a", room_ids: ["r1", "r2"] }),
      mk({ id: "b", room_ids: ["r3"] }),
      mk({ id: "c", room_ids: [] }),
    ];
    expect(byRoom(rows, "r1").map((m) => m.id)).toEqual(["a"]);
    expect(byRoom(rows, "r3").map((m) => m.id)).toEqual(["b"]);
    expect(byRoom(rows, "nope")).toEqual([]);
  });
});

describe("byStatus", () => {
  it("filters by lifecycle status", () => {
    const rows = [
      mk({ id: "a", status: "idea" }),
      mk({ id: "b", status: "ordered" }),
      mk({ id: "c", status: "ordered" }),
    ];
    expect(byStatus(rows, "ordered").map((m) => m.id)).toEqual(["b", "c"]);
    expect(byStatus(rows, "installed")).toEqual([]);
  });
});

describe("status metadata", () => {
  it("orders the six lifecycle statuses earliest to latest", () => {
    expect(STATUS_ORDER).toEqual([
      "idea",
      "researching",
      "decided",
      "ordered",
      "received",
      "installed",
    ]);
  });

  it("labels every status", () => {
    for (const s of STATUS_ORDER) {
      expect(STATUS_LABEL[s]).toBeTruthy();
    }
  });

  it("maps statuses to the three rationed tones", () => {
    const tones: Record<MaterialStatus, string> = {
      idea: "neutral",
      researching: "neutral",
      decided: "accent",
      ordered: "accent",
      received: "green",
      installed: "green",
    };
    for (const s of STATUS_ORDER) {
      expect(statusTone(s)).toBe(tones[s]);
    }
  });
});

describe("totalCents — regressions found in review", () => {
  const mk = (over: Partial<BuildMaterial>): BuildMaterial => ({
    id: Math.random().toString(36).slice(2),
    name: "x", category: "", room_ids: [], spec: "", vendor: "",
    unit_price_cents: 0, quantity: 1, unit: "each", lead_time: "",
    status: "idea", url: "", photo_url: "", compare_group: "", is_chosen: false, notes: "",
    ...over,
  });

  // A compare_group nobody else shares is a label, not a comparison. Excluding
  // it made its price vanish from the total.
  it("counts a material whose compare_group has only one row, even unchosen", () => {
    const solo = mk({ compare_group: "cabinet doors", unit_price_cents: 30_000, quantity: 10 });
    expect(totalCents([solo])).toBe(300_000);
  });

  it("still excludes a real comparison with no winner chosen", () => {
    const a = mk({ compare_group: "g", unit_price_cents: 100, quantity: 1 });
    const b = mk({ compare_group: "g", unit_price_cents: 200, quantity: 1 });
    expect(totalCents([a, b])).toBe(0);
  });

  it("counts exactly the chosen row of a real comparison", () => {
    const a = mk({ compare_group: "g", unit_price_cents: 100, quantity: 1, is_chosen: true });
    const b = mk({ compare_group: "g", unit_price_cents: 200, quantity: 1 });
    expect(totalCents([a, b])).toBe(100);
  });

  it("counts a corrupted group with two chosen rows only once", () => {
    const a = mk({ compare_group: "g", unit_price_cents: 100, quantity: 1, is_chosen: true });
    const b = mk({ compare_group: "g", unit_price_cents: 900, quantity: 1, is_chosen: true });
    expect(totalCents([a, b])).toBe(100);
  });

  it("treats whitespace-only compare_group as ungrouped", () => {
    expect(totalCents([mk({ compare_group: "   ", unit_price_cents: 500, quantity: 2 })])).toBe(1000);
  });

  it("mixes grouped and ungrouped without double counting", () => {
    const rows = [
      mk({ unit_price_cents: 1000, quantity: 1 }),                                   // ungrouped -> 1000
      mk({ compare_group: "solo", unit_price_cents: 2000, quantity: 1 }),            // lone group -> 2000
      mk({ compare_group: "real", unit_price_cents: 3000, quantity: 1, is_chosen: true }),
      mk({ compare_group: "real", unit_price_cents: 9000, quantity: 1 }),            // loser -> 0
      mk({ compare_group: "undecided", unit_price_cents: 7000, quantity: 1 }),
      mk({ compare_group: "undecided", unit_price_cents: 8000, quantity: 1 }),       // no winner -> 0
    ];
    expect(totalCents(rows)).toBe(1000 + 2000 + 3000);
  });
});
