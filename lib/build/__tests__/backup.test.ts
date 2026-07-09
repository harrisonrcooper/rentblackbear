import { describe, it, expect } from "vitest";

import { BACKUP_FORMAT, BACKUP_VERSION, describeBundle, validateBundle } from "../backup";
import type { BackupBundle } from "../backup";

const good = (): BackupBundle =>
  JSON.parse(JSON.stringify({
    format: BACKUP_FORMAT,
    bundle_version: BACKUP_VERSION,
    exported_at: "2026-07-09T12:00:00.000Z",
    workspace: "user_abc",
    blob: {
      version: 4,
      value: {
        rooms: [{ id: "r0", name: "Kitchen" }],
        team: [{ id: "t0", name: "Kasin" }],
        references: [{ id: "ref0", url: "https://x" }],
        selections: [{ id: "s0", label: "Flooring" }],
      },
    },
    collections: { tasks: [{ id: "tsk0" }], activity: [] },
    storage_manifest: [],
    counts: { rooms: 1, team: 1, references: 1, selections: 1, "collection:tasks": 1, "collection:activity": 0 },
  }));

describe("validateBundle", () => {
  it("accepts a well-formed bundle", () => {
    const r = validateBundle(good());
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual([]);
  });

  it("rejects a non-object", () => {
    expect(validateBundle(null).ok).toBe(false);
    expect(validateBundle("nope").ok).toBe(false);
    expect(validateBundle(42).ok).toBe(false);
  });

  it("rejects a file that is not a backup", () => {
    const r = validateBundle({ hello: "world" });
    expect(r.ok).toBe(false);
    expect(r.errors.join(" ")).toContain(BACKUP_FORMAT);
  });

  it("rejects a bundle from a newer app version", () => {
    const b = good();
    b.bundle_version = BACKUP_VERSION + 1;
    const r = validateBundle(b);
    expect(r.ok).toBe(false);
    expect(r.errors.join(" ")).toContain("newer than this app understands");
  });

  it("rejects a bundle missing the blob", () => {
    const b = good() as unknown as Record<string, unknown>;
    delete b.blob;
    expect(validateBundle(b).ok).toBe(false);
  });

  it("rejects a blob missing a required array", () => {
    const b = good();
    delete (b.blob.value as unknown as Record<string, unknown>).team;
    const r = validateBundle(b);
    expect(r.ok).toBe(false);
    expect(r.errors.join(" ")).toContain("team");
  });

  // The whole point of `counts`: a file truncated mid-write, or hand-edited,
  // must not be silently restored over the only copy of the vendor list.
  it("catches a TRUNCATED bundle whose counts disagree with its arrays", () => {
    const b = good();
    b.blob.value.team = []; // rows lost, counts still says 1
    const r = validateBundle(b);
    expect(r.ok).toBe(false);
    expect(r.errors.join(" ")).toContain("counts says team=1 but the file has 0");
  });

  it("catches a truncated engine collection", () => {
    const b = good();
    b.collections.tasks = [];
    const r = validateBundle(b);
    expect(r.ok).toBe(false);
    expect(r.errors.join(" ")).toContain("collection:tasks");
  });

  it("warns, but does not fail, when counts are absent", () => {
    const b = good() as unknown as Record<string, unknown>;
    delete b.counts;
    const r = validateBundle(b);
    expect(r.ok).toBe(true);
    expect(r.warnings.join(" ")).toContain("cannot verify");
  });

  it("warns when there are no engine collections", () => {
    const b = good() as unknown as Record<string, unknown>;
    delete b.collections;
    delete b.counts; // counts referenced the collections
    const r = validateBundle(b);
    expect(r.ok).toBe(true);
    expect(r.warnings.join(" ")).toContain("tasks and comments will be empty");
  });

  it("rejects a collection that is not an array", () => {
    const b = good() as unknown as Record<string, unknown>;
    (b.collections as Record<string, unknown>).tasks = { nope: true };
    expect(validateBundle(b).ok).toBe(false);
  });
});

describe("describeBundle", () => {
  it("summarizes what a restore would put back, in plain language", () => {
    expect(describeBundle(good())).toBe(
      "1 rooms, 1 vendors, 1 references, 1 tasks — exported 2026-07-09",
    );
  });
});
