"use client";

// Wants section.

import { COLORS, ACCENT, Card, txt, DelBtn, Check, AddBtn, SelectPill, WISH_TIERS } from "../ui";

export default function WantsSection({ state, addRow, updRow, delRow }) {
  // Tier order is deliberate: what the house cannot do without, first.
  const tiers = [["need", "Needs"], ["want", "Wants"], ["dream", "Dreams"]];
  return (
    <Card title="Wants & needs" sub={`${state.wishlist.length} items`}>
      {tiers.map(([pri, label]) => {
        const items = state.wishlist.filter((w) => w.priority === pri);
        return (
          <div key={pri}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: ACCENT, textTransform: "uppercase", padding: "10px 4px 2px" }}>
              {label} · {items.length}
            </div>
            {items.length === 0 && (
              <div style={{ fontSize: 12.5, color: COLORS.textFaint, fontStyle: "italic", padding: "4px 4px 6px" }}>Nothing here yet.</div>
            )}
            {items.map((w) => (
              <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 4px", borderBottom: `1px solid ${COLORS.surfaceTint}` }}>
                <Check done={w.done} onClick={() => updRow("wishlist", w.id, { done: !w.done })} />
                <input
                  type="text" value={w.label}
                  onChange={(e) => updRow("wishlist", w.id, { label: e.target.value })}
                  style={{ ...txt(), flex: 1, minWidth: 0, textDecoration: w.done ? "line-through" : "none", opacity: w.done ? 0.55 : 1 }}
                />
                <SelectPill
                  value={w.priority}
                  options={WISH_TIERS}
                  onChange={(priority) => updRow("wishlist", w.id, { priority })}
                  ariaLabel={`Priority for ${w.label}`}
                />
                <DelBtn onClick={() => delRow("wishlist", w.id)} />
              </div>
            ))}
          </div>
        );
      })}
      <AddBtn label="Add a want or need" onClick={() => addRow("wishlist", { label: "New item", priority: "want", done: false })} />
    </Card>
  );
}
