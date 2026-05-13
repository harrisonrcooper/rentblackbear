// Inline-SVG icon system, Lucide-styled (1.5 stroke, round caps/joins).
// `d` accepts either a single path string or an array of paths so
// multi-path icons render in one component.
//
// The path-data map lives in iconPaths.js (pure JS) so non-React
// modules (colors, habits, etc.) can import it without dragging JSX
// into a place where vitest can't parse it.

export { ICON } from "./iconPaths";

export function Icon({ d, size = 18, color = "currentColor", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true" focusable="false">
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}
