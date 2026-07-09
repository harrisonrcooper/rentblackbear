// Plan the workbook import. Pure: no I/O, no network, fully testable.
//
// The seed in actions/build/_store.ts captured most of "DREAMING HOME BUILD",
// but not all of it. Two tabs were dropped entirely — Sheet21 (the "Visits to
// China" sourcing checklist) and "NIKKI container girl" (the cabinet advice
// thread from Charlie Hartwig and Matthew Mendez) — and a scatter of specs and
// links across the system tabs never landed anywhere.
//
// The brief's rule is "don't lose a single note or link". So this planner is:
//
//   ADDITIVE   — it only ever appends. It never edits or deletes an existing
//                row, because the owner has been editing this data by hand and
//                his version outranks the workbook's.
//   IDEMPOTENT — running it twice adds nothing the second time. Every item is
//                matched against what is already there before being proposed.
//   INSPECTABLE — it returns a plan. Writing it is somebody else's job.

/** Loose equality for things a human typed twice. */
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/**
 * Compare URLs ignoring scheme, www, query, fragment and a trailing slash.
 *
 * The PATH is significant. Stripping it collapses every link on a host to the
 * same key, so a Facebook group and a Facebook video would look like the same
 * reference — which is exactly the bug this comment exists to prevent.
 */
const normUrl = (u) =>
  String(u || "")
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[?#].*$/, "")
    .replace(/\/+$/, "");

const contains = (haystack, needle) => norm(haystack).includes(norm(needle));

// ── What the workbook holds that the seed did not ────────────────────

/** Sheet21. The first row is the tab's own title; the rest are the checklist. */
export const CHINA_SOURCING = [
  { item: "Windows", note: "At the window factory, take videos of how they are installed and put together." },
  { item: "Doors", note: "" },
  { item: "Cabinets", note: "" },
  { item: "Closets", note: "" },
  { item: "Stairs", note: "" },
  { item: "Door handles", note: "" },
  { item: "Furniture", note: "" },
  { item: "Gym equipment", note: "" },
  { item: "Sauna", note: "" },
  { item: "Cold plunge", note: "" },
  { item: "Turf grass", note: "" },
  { item: "Water-vapor fireplace", note: "" },
  { item: "Christmas tree", note: "" },
];

/** THINGS TO GET. Several never reached WISH_SEED. */
export const WANTS = [
  { label: "Fake plants", priority: "dream" },
  { label: "Christmas tree", priority: "dream" },
  { label: "Gym equipment", priority: "want" },
  { label: "Solar panels", priority: "want" },
  { label: "All things solar", priority: "dream" },
];

/** Links present in the workbook but missing from REFERENCE_SEED. */
export const REFERENCES = [
  {
    url: "https://www.facebook.com/groups/1637797286875381/",
    title: "Charlie Hartwig's build & vendor group",
    tag: "Vendors",
    note: "Where the China cabinet and door vendor contacts came from.",
  },
  {
    url: "https://www.facebook.com/share/p/1Kzmaz87Sk/",
    title: "PU faux-stone fireplace panel",
    tag: "Products",
    note: "Check Alibaba for the same panel.",
  },
];

/** Specs that belong to a selection the seed already created, as notes. */
export const SELECTION_NOTES = [
  ["Electrical panel", "High-amp outlet for the cold plunge, sauna and hot tub. High-amp outlet for the car charger."],
  ["Lighting", "Floating vanities with undermount motion-sensor lighting. Flush baseboard outlets (flushtek.com). Outside lighting. Options for light accents."],
  ["Network", "Speakers throughout the house and outside. Hard-wired smart door keypad."],
  ["Framing", "Outlets and hose bibs DO NOT penetrate the house — they come up from the ground."],
  ["Exterior waterproofing", "Outlets and hose bibs DO NOT penetrate the house — they come up from the ground."],
  ["HVAC system", "Reach out to Positive Energy and follow their design to install. Their questionnaire answer: quiet and comfortable."],
  ["Fireplaces", "Check Alibaba for the PU faux-stone panels."],
];

/** Whole plumbing tab — the seed has no plumbing selection at all. */
export const NEW_SELECTIONS = [
  {
    label: "Plumbing",
    choice: "Copper manifold",
    notes: [
      "Copper manifold.",
      "Hot and cold lines to the garage for a wall-mounted pressure washer.",
      "HVAC mechanical room with the hot-water tank.",
      "Outside shower.",
      "No external hose bib connected to the house.",
      "Drain / floor pan under any appliance — basically a mini shower.",
      "Water filter.",
    ].join(" "),
  },
];

/** Room notes the seed truncated. Appended to `details`, never overwriting. */
export const ROOM_NOTES = [
  ["Studio", "Used for artwork, writing, thinking and family time. Options for light accents."],
  ["Basement", "Doesn't need an office. Would like more walls to be sliding-glass or accordion doors leading out to the pool."],
];

/** The vendor advice thread from the "NIKKI container girl" tab. */
export const VENDOR_NOTES = [
  [
    "Cabinets, closets & countertops",
    "Charlie Hartwig (all-star contributor): prefers a 3/4\" plywood carcass; for the doors, MDF or plywood with a white-oak veneer is perfect. 5/8\" or 1/2\" is acceptable. Blum hardware. " +
      "Matthew Mendez (admin, all-star contributor): same as Charlie — solid plywood carcass wrapped in melamine, solid wood with veneer.",
  ],
  [
    "Interior doors",
    "White oak, right around $300 a door. Handles and hidden hinges purchased separately in gunmetal so everything matches — via Filta (Clara).",
  ],
];

// ── Planning ─────────────────────────────────────────────────────────

/**
 * @param {object} state    current BuildState
 * @param {Array}  tasks    current engine tasks
 * @returns {{references:Array, wants:Array, newSelections:Array, selectionNotes:Array,
 *            roomNotes:Array, vendorNotes:Array, sourcingTasks:Array, skipped:object}}
 */
export function planImport(state, tasks = []) {
  const skipped = { references: 0, wants: 0, selectionNotes: 0, roomNotes: 0, vendorNotes: 0, sourcingTasks: 0, newSelections: 0 };

  const existingUrls = new Set((state.references || []).map((r) => normUrl(r.url)));
  const references = REFERENCES.filter((r) => {
    const dup = existingUrls.has(normUrl(r.url));
    if (dup) skipped.references++;
    return !dup;
  });

  const existingWants = new Set((state.wishlist || []).map((w) => norm(w.label)));
  const wants = WANTS.filter((w) => {
    const dup = existingWants.has(norm(w.label));
    if (dup) skipped.wants++;
    return !dup;
  });

  const existingSelections = new Set((state.selections || []).map((s) => norm(s.label)));
  const newSelections = NEW_SELECTIONS.filter((s) => {
    const dup = existingSelections.has(norm(s.label));
    if (dup) skipped.newSelections++;
    return !dup;
  });

  const selectionNotes = [];
  for (const [label, note] of SELECTION_NOTES) {
    const row = (state.selections || []).find((s) => norm(s.label) === norm(label));
    if (!row) continue;                       // nothing to attach it to
    if (contains(row.notes, note)) { skipped.selectionNotes++; continue; }
    selectionNotes.push({ id: row.id, label: row.label, note, existing: row.notes || "" });
  }

  const roomNotes = [];
  for (const [name, note] of ROOM_NOTES) {
    const row = (state.rooms || []).find((r) => norm(r.name) === norm(name));
    if (!row) continue;
    if (contains(row.details, note)) { skipped.roomNotes++; continue; }
    roomNotes.push({ id: row.id, name: row.name, note, existing: row.details || "" });
  }

  const vendorNotes = [];
  for (const [role, note] of VENDOR_NOTES) {
    const row = (state.team || []).find((t) => norm(t.role) === norm(role));
    if (!row) continue;
    if (contains(row.notes, note)) { skipped.vendorNotes++; continue; }
    vendorNotes.push({ id: row.id, role: row.role, note, existing: row.notes || "" });
  }

  const existingTaskTitles = new Set(
    tasks.filter((t) => !t.archived).map((t) => norm(t.title)),
  );
  const sourcingTasks = CHINA_SOURCING.filter((s) => {
    const title = `Source ${s.item.toLowerCase()} in China`;
    const dup = existingTaskTitles.has(norm(title));
    if (dup) skipped.sourcingTasks++;
    return !dup;
  }).map((s) => ({
    title: `Source ${s.item.toLowerCase()} in China`,
    notes: s.note,
    tags: ["china sourcing"],
  }));

  return { references, wants, newSelections, selectionNotes, roomNotes, vendorNotes, sourcingTasks, skipped };
}

/** Total number of writes the plan would make. */
export function planSize(plan) {
  return (
    plan.references.length + plan.wants.length + plan.newSelections.length +
    plan.selectionNotes.length + plan.roomNotes.length + plan.vendorNotes.length +
    plan.sourcingTasks.length
  );
}

/** Apply the plan to a state object, returning a NEW state. Never mutates. */
export function applyToState(state, plan, newId) {
  const next = { ...state };

  next.references = [
    ...(state.references || []),
    ...plan.references.map((r) => ({ id: newId("ref"), ...r })),
  ];

  next.wishlist = [
    ...(state.wishlist || []),
    ...plan.wants.map((w) => ({ id: newId("w"), label: w.label, priority: w.priority, done: false })),
  ];

  next.selections = [
    ...(state.selections || []).map((s) => {
      const patch = plan.selectionNotes.find((p) => p.id === s.id);
      if (!patch) return s;
      return { ...s, notes: [s.notes, patch.note].filter(Boolean).join(" ") };
    }),
    ...plan.newSelections.map((s) => ({
      id: newId("s"), label: s.label, choice: s.choice, status: "open",
      vendor: "", allowance_cents: 0, actual_cents: 0, lead_time: "", deadline: null,
      notes: s.notes,
    })),
  ];

  next.rooms = (state.rooms || []).map((r) => {
    const patch = plan.roomNotes.find((p) => p.id === r.id);
    if (!patch) return r;
    return { ...r, details: [r.details, patch.note].filter(Boolean).join(" ") };
  });

  next.team = (state.team || []).map((t) => {
    const patch = plan.vendorNotes.find((p) => p.id === t.id);
    if (!patch) return t;
    return { ...t, notes: [t.notes, patch.note].filter(Boolean).join(" ") };
  });

  return next;
}
