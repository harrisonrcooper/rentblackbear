// Cmd+K search across everything.
//
// The index is built from the entity registry, so every module is searchable
// the moment it is registered — there is no per-module search code to forget
// to write. Rows come from the blob (rooms, vendors, references…) and from
// the engine collections (tasks).
//
// Matching is deliberately simple and local: this is one household's build,
// a few thousand rows at the very most, and searching in the browser keeps
// Cmd+K instant with no round trip.

import type { BuildState } from "@/actions/build/_store";

import { ENTITY_REGISTRY, ENTITY_TYPES, entityUrl } from "./entities";
import type { EntityRef, EntityType } from "./entities";

export interface SearchDoc extends EntityRef {
  /** Lowercased haystack: title + subtitle + any extra searchable fields. */
  haystack: string;
}

/** Fields worth searching beyond title/subtitle, per entity type. */
const EXTRA_TEXT: Partial<Record<EntityType, string[]>> = {
  room: ["must_haves", "lighting", "details", "level"],
  reference: ["url", "note", "tag"],
  team: ["contact", "role"],
  selection: ["choice", "vendor", "lead_time"],
  swatch: ["material", "note"],
  wish: ["priority"],
  rfi: ["answer", "asked_of"],
  punch: ["room", "trade"],
  document: ["category", "url"],
  as_built: ["value"],
  warranty: ["provider"],
  energy: ["value", "target"],
  cost: ["group"],
  payment: ["vendor", "method"],
  change_order: ["reason", "status"],
  inspection: ["inspector", "notes", "status"],
  task: ["notes", "assignee", "status"],
};

const str = (v: unknown): string => (typeof v === "string" ? v : "");

/**
 * Build the searchable index. `extra` supplies rows not held in the blob —
 * currently tasks, keyed by entity type.
 */
export function buildSearchIndex(
  state: BuildState,
  extra?: Partial<Record<EntityType, Array<Record<string, unknown>>>>,
): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const type of ENTITY_TYPES) {
    const spec = ENTITY_REGISTRY[type];

    if (type === "project") {
      const title = str((state as unknown as Record<string, unknown>).project_name);
      docs.push({
        type, id: "project", title: title || "Project",
        subtitle: str((state as unknown as Record<string, unknown>).style),
        section: spec.section, url: entityUrl(spec.section), kindLabel: spec.label,
        haystack: `${title} ${str((state as unknown as Record<string, unknown>).style)} ${str((state as unknown as Record<string, unknown>).notes)}`.toLowerCase(),
      });
      continue;
    }

    const rows: Array<Record<string, unknown>> = spec.arrayKey
      ? ((state[spec.arrayKey] as unknown as Array<Record<string, unknown>>) || [])
      : (extra?.[type] || []);

    for (const row of rows) {
      if (row.archived) continue;

      const title = spec.title(row);
      const subtitle = spec.subtitle ? spec.subtitle(row) : "";
      const extras = (EXTRA_TEXT[type] || []).map((k) => str(row[k])).join(" ");

      docs.push({
        type,
        id: str(row.id),
        title: title || spec.label,
        subtitle,
        section: spec.section,
        url: entityUrl(spec.section, str(row.id)),
        kindLabel: spec.label,
        haystack: `${title} ${subtitle} ${extras}`.toLowerCase(),
      });
    }
  }

  return docs;
}

/**
 * Score a doc against a query. Higher is better; 0 means no match.
 *
 * Every query term must appear somewhere, so "oak door" doesn't match a row
 * that only says "oak". Where a term lands decides the score: the title
 * outranks the subtitle, which outranks the rest, and a term starting a word
 * outranks one buried mid-word ("kas" should find "Kasin", not "Alaska").
 */
export function scoreDoc(doc: SearchDoc, terms: string[]): number {
  if (terms.length === 0) return 0;

  const title = doc.title.toLowerCase();
  const subtitle = doc.subtitle.toLowerCase();
  let total = 0;

  for (const term of terms) {
    let best = 0;

    if (title === term) best = 100;
    else if (title.startsWith(term)) best = 60;
    else if (wordStarts(title, term)) best = 45;
    else if (title.includes(term)) best = 25;
    else if (wordStarts(subtitle, term)) best = 18;
    else if (subtitle.includes(term)) best = 12;
    else if (wordStarts(doc.haystack, term)) best = 8;
    else if (doc.haystack.includes(term)) best = 4;

    if (best === 0) return 0; // every term must match somewhere
    total += best;
  }

  // Shorter titles are usually the more specific hit for the same score.
  return total + Math.max(0, 12 - doc.title.length / 8);
}

function wordStarts(haystack: string, term: string): boolean {
  let i = haystack.indexOf(term);
  while (i !== -1) {
    if (i === 0 || /[\s\-_/(,.]/.test(haystack[i - 1])) return true;
    i = haystack.indexOf(term, i + 1);
  }
  return false;
}

export function search(index: SearchDoc[], query: string, limit = 20): SearchDoc[] {
  const terms = query.toLowerCase().split(/\s+/).map((t) => t.trim()).filter(Boolean);
  if (terms.length === 0) return [];

  const hits: Array<{ doc: SearchDoc; score: number }> = [];
  for (const doc of index) {
    const score = scoreDoc(doc, terms);
    if (score > 0) hits.push({ doc, score });
  }

  hits.sort((a, b) => (b.score - a.score) || a.doc.title.localeCompare(b.doc.title));
  return hits.slice(0, limit).map((h) => h.doc);
}
