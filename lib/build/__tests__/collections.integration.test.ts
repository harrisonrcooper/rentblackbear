// Integration test for operation replay in the collection store.
//
// The claim under test: when N writers append concurrently to the same
// collection, ALL N appends survive. Compare-and-swap alone would only
// guarantee that one wins and the rest are told they lost; replay is what
// turns "you lost" into "your task is there anyway".
//
// Runs against the real app_data table on a scratch workspace key. Skips when
// Supabase env is absent.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, it, expect, beforeEach, afterAll } from "vitest";

function loadEnvLocal() {
  try {
    const text = readFileSync(resolve(__dirname, "../../../.env.local"), "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* skip */
  }
}
loadEnvLocal();

const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const d = configured ? describe : describe.skip;

// Each test gets its OWN workspace key.
//
// They used to share one, with beforeEach deleting the row. That is safe only
// if every writer has stopped — and it hadn't: vitest's 5-second default
// timeout is shorter than mutate()'s 15-second retry deadline, so a contended
// writer from a timed-out test kept retrying, landed AFTER the delete, and
// resurrected its row inside the next test. The symptom was
// `expected ['keep','x'] to equal ['keep']`, two runs in three.
//
// Isolation removes the class of bug; the generous timeouts below remove the
// timeout that caused it.
let wsCounter = 0;
const workspaces: string[] = [];
function freshWorkspace(): string {
  const ws = `__it_workspace_${++wsCounter}`;
  workspaces.push(ws);
  return ws;
}

// A whole retry deadline, plus room for the round trips either side.
const CONCURRENCY_TIMEOUT_MS = 60_000;

interface Row {
  id: string;
  created_at: string;
  updated_at: string;
  archived?: boolean;
  title: string;
}

async function rawDelete(key: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  await fetch(`${url}/rest/v1/app_data?key=eq.${encodeURIComponent(key)}`, {
    method: "DELETE",
    headers: { apikey: svc, Authorization: `Bearer ${svc}` },
  });
}

d("collection store: operation replay under concurrency", () => {
  let mod: typeof import("../collections");
  let WS: string;

  beforeEach(async () => {
    mod = await import("../collections");
    WS = freshWorkspace();
  });
  afterAll(async () => {
    const m = await import("../collections");
    for (const ws of workspaces) await rawDelete(m.collectionKey(ws, "tasks"));
  });

  const append = (title: string) => (rows: Row[]) => [
    ...rows,
    { id: mod.newId("tsk"), created_at: mod.now(), updated_at: mod.now(), title },
  ];

  it("starts empty and round-trips a single append", async () => {
    expect(await mod.listAll<Row>(WS, "tasks")).toEqual([]);
    await mod.mutate<Row>(WS, "tasks", append("first"));
    const rows = await mod.listAll<Row>(WS, "tasks");
    expect(rows.map((r) => r.title)).toEqual(["first"]);
  });

  it("keeps EVERY task when five writers append at the same instant", async () => {
    const titles = ["a", "b", "c", "d", "e"];
    await Promise.all(titles.map((t) => mod.mutate<Row>(WS, "tasks", append(t))));

    const rows = await mod.listAll<Row>(WS, "tasks");
    expect(rows).toHaveLength(5);
    expect(rows.map((r) => r.title).sort()).toEqual(titles);
    // Every row got a distinct id despite being minted in parallel.
    expect(new Set(rows.map((r) => r.id)).size).toBe(5);
  }, CONCURRENCY_TIMEOUT_MS);

  // Ten writers exceeds any plausible human workload; if replay + backoff hold
  // here, two spouses editing will never see a dropped task.
  it("survives ten concurrent appends without dropping or duplicating one", async () => {
    const titles = Array.from({ length: 10 }, (_, i) => `t${i}`);
    await Promise.all(titles.map((t) => mod.mutate<Row>(WS, "tasks", append(t))));

    const rows = await mod.listAll<Row>(WS, "tasks");
    expect(rows.map((r) => r.title).sort()).toEqual([...titles].sort());
    expect(new Set(rows.map((r) => r.id)).size).toBe(10);
  }, CONCURRENCY_TIMEOUT_MS);

  // The attempt cap used to be 8. Twenty writers exhausted it and threw
  // "too many concurrent writers" — a save failing because the machine was
  // busy, not because anything was wrong. Retry is deadline-bound now.
  it("survives TWENTY concurrent appends, well past the old attempt cap", async () => {
    const titles = Array.from({ length: 20 }, (_, i) => `x${i}`);
    const results = await Promise.allSettled(
      titles.map((t) => mod.mutate<Row>(WS, "tasks", append(t))),
    );

    const rejected = results.filter((r) => r.status === "rejected");
    expect(rejected.map((r) => (r as PromiseRejectedResult).reason?.message)).toEqual([]);

    const rows = await mod.listAll<Row>(WS, "tasks");
    expect(rows.map((r) => r.title).sort()).toEqual([...titles].sort());
    expect(new Set(rows.map((r) => r.id)).size).toBe(20);
  }, CONCURRENCY_TIMEOUT_MS + 30_000);

  it("replays a status change against a concurrently-appended list", async () => {
    await mod.mutate<Row>(WS, "tasks", append("target"));
    const [target] = await mod.listAll<Row>(WS, "tasks");

    // One writer renames the existing row; three others append. All interleave.
    await Promise.all([
      mod.mutate<Row>(WS, "tasks", (rows) =>
        rows.map((r) => (r.id === target.id ? { ...r, title: "renamed" } : r))),
      mod.mutate<Row>(WS, "tasks", append("x")),
      mod.mutate<Row>(WS, "tasks", append("y")),
      mod.mutate<Row>(WS, "tasks", append("z")),
    ]);

    const rows = await mod.listAll<Row>(WS, "tasks");
    expect(rows).toHaveLength(4);
    expect(rows.find((r) => r.id === target.id)?.title).toBe("renamed");
    expect(rows.map((r) => r.title).sort()).toEqual(["renamed", "x", "y", "z"]);
  }, CONCURRENCY_TIMEOUT_MS);

  it("listLive hides archived rows, listAll keeps them", async () => {
    await mod.mutate<Row>(WS, "tasks", append("keep"));
    await mod.mutate<Row>(WS, "tasks", append("gone"));
    await mod.mutate<Row>(WS, "tasks", (rows) =>
      rows.map((r) => (r.title === "gone" ? { ...r, archived: true } : r)));

    expect((await mod.listLive<Row>(WS, "tasks")).map((r) => r.title)).toEqual(["keep"]);
    expect(await mod.listAll<Row>(WS, "tasks")).toHaveLength(2);
  });

  it("keys each collection separately so tasks and tags never contend", async () => {
    expect(mod.collectionKey(WS, "tasks")).toBe(`build:tasks:${WS}`);
    expect(mod.collectionKey(WS, "tags")).toBe(`build:tags:${WS}`);
    expect(mod.collectionKey(WS, "tasks")).not.toBe(mod.collectionKey(WS, "tags"));
  });
});
