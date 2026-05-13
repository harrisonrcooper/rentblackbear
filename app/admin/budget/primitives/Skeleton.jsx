"use client";

// Generic skeleton placeholders. Pulse animation lives in the global
// style block injected by BudgetClient.

import { COLORS } from "../lib/tokens";

export function SkeletonBlock({ height = 16, width = "100%", radius = 8, style = {} }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width, height, borderRadius: radius,
        background: COLORS.surfaceTint,
        animation: "bb-pulse 1.4s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

// Full-page loading skeleton — used as the EmptyState equivalent when
// initial data is still arriving. Shape matches the eventual dashboard
// so the layout doesn't shift when real content lands.
export function DashboardSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading budget…" style={{ display: "grid", gap: 16, marginTop: 16 }}>
      <SkeletonBlock height={220} radius={18} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        <SkeletonBlock height={78} radius={14} />
        <SkeletonBlock height={78} radius={14} />
        <SkeletonBlock height={78} radius={14} />
        <SkeletonBlock height={78} radius={14} />
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "hidden" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonBlock key={i} height={32} width={60} radius={100} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <SkeletonBlock height={168} radius={18} />
        <SkeletonBlock height={168} radius={18} />
        <SkeletonBlock height={168} radius={18} />
        <SkeletonBlock height={168} radius={18} />
        <SkeletonBlock height={168} radius={18} />
      </div>
    </div>
  );
}
