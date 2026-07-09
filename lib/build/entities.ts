// The single place that knows what an "entity" is in the build planner.
//
// Tasks attach to anything. Comments hang off anything. Tags apply to
// anything. Cmd+K searches everything. Those four surfaces would each need
// their own knowledge of every module's row shape — where it lives, what
// its title field is called, which section renders it — and every new module
// would mean touching all four.
//
// Instead they all go through this registry. `EntityType` is a CLOSED union,
// so adding a module without registering it is a compile error rather than a
// blank row in the search results.
//
// The registry also decouples the four surfaces from where a row is STORED.
// Today most rows live in the one big JSONB blob and tasks live in their own
// collection row; if either later becomes a real Postgres table, only
// `resolve` changes.

import type { BuildState } from "@/actions/build/_store";

export const ENTITY_TYPES = [
  "project",
  "room",
  "wish",
  "cost",
  "milestone",
  "selection",
  "team",
  "board",
  "reference",
  "swatch",
  "document",
  "photo",
  "change_order",
  "payment",
  "inspection",
  "punch",
  "rfi",
  "as_built",
  "warranty",
  "energy",
  "task",
] as const;

export type EntityType = (typeof ENTITY_TYPES)[number];

/** A uniform reference to any entity, for search results, chips and drawers. */
export interface EntityRef {
  type: EntityType;
  id: string;
  /** What to show the user. */
  title: string;
  /** Secondary line: room name, vendor, status… */
  subtitle: string;
  /** Which nav section renders it. */
  section: string;
  /** Deep link. */
  url: string;
  /** Human name for the entity's kind, e.g. "Room". */
  kindLabel: string;
}

interface EntitySpec {
  /** Singular, human. */
  label: string;
  /** Nav section id in BuildClient's SECTIONS. */
  section: string;
  /** Which BuildState array holds these rows. `null` = not blob-backed. */
  arrayKey: keyof BuildState | null;
  /** Pull a display title out of a row. */
  title: (row: Record<string, unknown>) => string;
  /** Pull a secondary line out of a row. */
  subtitle?: (row: Record<string, unknown>) => string;
}

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const firstOf = (row: Record<string, unknown>, ...keys: string[]): string => {
  for (const k of keys) {
    const v = str(row[k]).trim();
    if (v) return v;
  }
  return "";
};

/**
 * The registry. Every EntityType must appear exactly once — the
 * `Record<EntityType, …>` type makes an omission a compile error.
 */
export const ENTITY_REGISTRY: Record<EntityType, EntitySpec> = {
  project:       { label: "Project",        section: "overview",     arrayKey: null,            title: (r) => firstOf(r, "project_name") || "Project" },
  room:          { label: "Room",           section: "rooms",        arrayKey: "rooms",         title: (r) => firstOf(r, "name"),   subtitle: (r) => firstOf(r, "level", "size") },
  wish:          { label: "Want",           section: "wants",        arrayKey: "wishlist",      title: (r) => firstOf(r, "label"),  subtitle: (r) => firstOf(r, "priority") },
  cost:          { label: "Budget line",    section: "costs",        arrayKey: "costs",         title: (r) => firstOf(r, "label"),  subtitle: (r) => firstOf(r, "group") },
  milestone:     { label: "Milestone",      section: "milestones",   arrayKey: "milestones",    title: (r) => firstOf(r, "label"),  subtitle: (r) => firstOf(r, "target") },
  selection:     { label: "Selection",      section: "selections",   arrayKey: "selections",    title: (r) => firstOf(r, "label"),  subtitle: (r) => firstOf(r, "choice", "vendor") },
  team:          { label: "Vendor",         section: "team",         arrayKey: "team",          title: (r) => firstOf(r, "name", "role"), subtitle: (r) => firstOf(r, "role", "contact") },
  board:         { label: "Inspiration",    section: "inspiration",  arrayKey: "boards",        title: (r) => firstOf(r, "name") },
  reference:     { label: "Reference",      section: "references",   arrayKey: "references",    title: (r) => firstOf(r, "title", "url"), subtitle: (r) => firstOf(r, "tag") },
  swatch:        { label: "Material",       section: "palette",      arrayKey: "palette",       title: (r) => firstOf(r, "name"),   subtitle: (r) => firstOf(r, "material") },
  document:      { label: "Document",       section: "documents",    arrayKey: "documents",     title: (r) => firstOf(r, "name"),   subtitle: (r) => firstOf(r, "category") },
  photo:         { label: "Photo",          section: "photos",       arrayKey: "photos",        title: (r) => firstOf(r, "caption") || "Photo", subtitle: (r) => firstOf(r, "phase", "date") },
  change_order:  { label: "Change order",   section: "changeorders", arrayKey: "change_orders", title: (r) => firstOf(r, "description"), subtitle: (r) => firstOf(r, "status") },
  payment:       { label: "Payment",        section: "payments",     arrayKey: "payments",      title: (r) => firstOf(r, "description", "vendor"), subtitle: (r) => firstOf(r, "vendor", "method") },
  inspection:    { label: "Inspection",     section: "inspections",  arrayKey: "inspections",   title: (r) => firstOf(r, "name"),   subtitle: (r) => firstOf(r, "status") },
  punch:         { label: "Punch item",     section: "punchlist",    arrayKey: "punch_list",    title: (r) => firstOf(r, "description"), subtitle: (r) => firstOf(r, "room", "trade") },
  rfi:           { label: "Open question",  section: "decisions",    arrayKey: "rfis",          title: (r) => firstOf(r, "question"), subtitle: (r) => firstOf(r, "asked_of", "status") },
  as_built:      { label: "As-built",       section: "asbuilt",      arrayKey: "as_built",      title: (r) => firstOf(r, "label"),  subtitle: (r) => firstOf(r, "value") },
  warranty:      { label: "Warranty",       section: "asbuilt",      arrayKey: "warranties",    title: (r) => firstOf(r, "item"),   subtitle: (r) => firstOf(r, "provider", "expires") },
  energy:        { label: "Energy metric",  section: "energy",       arrayKey: "energy",        title: (r) => firstOf(r, "label"),  subtitle: (r) => firstOf(r, "target") },
  task:          { label: "Task",           section: "tasks",        arrayKey: null,            title: (r) => firstOf(r, "title"),  subtitle: (r) => firstOf(r, "status") },
};

export function isEntityType(v: string): v is EntityType {
  return (ENTITY_TYPES as readonly string[]).includes(v);
}

/** Deep link to a section, optionally focusing one item. */
export function entityUrl(section: string, id?: string): string {
  const q = new URLSearchParams({ s: section });
  if (id) q.set("item", id);
  return `/admin/build?${q.toString()}`;
}

/**
 * Turn any (type, id) into something renderable. Returns null when the row no
 * longer exists — a task pointing at a deleted room, say — so callers render
 * a tombstone rather than a crash.
 *
 * `extra` supplies rows that do not live in the blob (currently tasks).
 */
export function resolve(
  state: BuildState,
  type: EntityType,
  id: string,
  extra?: Partial<Record<EntityType, Array<Record<string, unknown>>>>,
): EntityRef | null {
  const spec = ENTITY_REGISTRY[type];
  if (!spec) return null;

  if (type === "project") {
    return {
      type, id: "project",
      title: spec.title(state as unknown as Record<string, unknown>),
      subtitle: str((state as unknown as Record<string, unknown>).style),
      section: spec.section, url: entityUrl(spec.section), kindLabel: spec.label,
    };
  }

  const rows: Array<Record<string, unknown>> = spec.arrayKey
    ? ((state[spec.arrayKey] as unknown as Array<Record<string, unknown>>) || [])
    : (extra?.[type] || []);

  const row = rows.find((r) => r.id === id);
  if (!row) return null;

  return {
    type,
    id,
    title: spec.title(row) || spec.label,
    subtitle: spec.subtitle ? spec.subtitle(row) : "",
    section: spec.section,
    url: entityUrl(spec.section, id),
    kindLabel: spec.label,
  };
}
