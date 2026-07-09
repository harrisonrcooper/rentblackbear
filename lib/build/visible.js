// Archived rows are soft-deleted: still in the blob, hidden from the UI.
//
// Sections read a filtered view of state so a deleted room disappears
// everywhere at once, while the underlying row survives for anything that
// references it by id (and so a delete can be undone).

const ROW_ARRAYS = [
  "rooms", "wishlist", "costs", "milestones", "selections", "team", "boards",
  "references", "palette", "draws", "documents", "photos", "change_orders",
  "payments", "inspections", "punch_list", "rfis", "as_built", "warranties",
  "energy", "materials", "decisions_log", "quotes", "phases", "schedule_tasks",
  "trips",
];

const live = (rows) => (Array.isArray(rows) ? rows.filter((r) => !r?.archived) : rows);

/** A copy of `state` with archived rows (and archived board items) removed. */
export function visibleState(state) {
  const out = { ...state };
  for (const key of ROW_ARRAYS) out[key] = live(state[key]);
  // Boards and trips nest their own item rows.
  if (Array.isArray(out.boards)) {
    out.boards = out.boards.map((b) => ({ ...b, items: live(b.items) }));
  }
  if (Array.isArray(out.trips)) {
    out.trips = out.trips.map((t) => ({ ...t, items: live(t.items) }));
  }
  return out;
}

export { ROW_ARRAYS };
