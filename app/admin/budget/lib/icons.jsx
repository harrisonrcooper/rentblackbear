// Inline-SVG icon system, Lucide-styled (1.5 stroke, round caps/joins).
// `d` accepts either a single path string or an array of paths so
// multi-path icons render in one component.

export function Icon({ d, size = 18, color = "currentColor", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true" focusable="false">
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}

// Path data — string or array-of-strings per icon. Keep grouped by
// usage area so it's quick to find what you're looking for.
export const ICON = {
  // Direction
  chevL:   "M15 18l-6-6 6-6",
  chevR:   "M9 18l6-6-6-6",
  chevD:   "M6 9l6 6 6-6",
  arrowUp: "M12 19V5 M5 12l7-7 7 7",
  arrowDn: "M12 5v14 M19 12l-7 7-7-7",
  // Generic
  upload:   "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  refresh:  ["M3 12a9 9 0 0 1 15-6.7l3 2.7", "M21 4v6h-6", "M21 12a9 9 0 0 1-15 6.7l-3-2.7", "M3 20v-6h6"],
  edit:     ["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"],
  x:        "M18 6L6 18 M6 6l12 12",
  plus:     ["M12 5v14", "M5 12h14"],
  minus:    "M5 12h14",
  check:    "M20 6L9 17l-5-5",
  target:   "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
  // Concept
  home:     "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  building: ["M3 21h18", "M5 21V7l8-4v18", "M19 21V11l-6-3.2"],
  scales:   ["M16 4h3a1 1 0 0 1 1 1v12", "M4 4h3", "M4 4l4 7", "M20 4l-4 7", "M16 4h-8 M12 4v17", "M12 21h-3 M12 21h3"],
  trending: "M22 7l-8.5 8.5-5-5L2 17",
  family:   ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M22 11h-4 M20 9v4"],
  flame:    "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
  envelope: "M21 8v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8 M1 5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v3H1V5z M10 12h4",
  flag:     "M4 22V4a2 2 0 0 1 2-2h12l-3 4 3 4H6 M4 22h6",
  trophy:   "M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22 M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22 M18 2H6v7a6 6 0 0 0 12 0V2z",
  gear:     "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  heart:    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  clock:    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z M12 7v5l3 3",
  walk:     "M13 4v16 M5 8h8 M19 8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2",
  calendar: "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  award:    "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
  bell:     "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  car:      "M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2 M14 16a2 2 0 1 1-4 0 M19 16a2 2 0 1 1-4 0",
  utensils: "M18 8h1a4 4 0 0 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z M6 1v3 M10 1v3 M14 1v3",
  database: "M21 12c0 1.66-4 3-9 3s-9-1.34-9-3 M3 5c0 1.66 4 3 9 3s9-1.34 9-3-4-3-9-3-9 1.34-9 3z M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5",
  fileText: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"],
  landmark: ["M3 22h18", "M3 10h18", "M5 6l7-3 7 3", "M4 10v12", "M20 10v12", "M8 14v4", "M12 14v4", "M16 14v4"],
  link2:    ["M9 17H7A5 5 0 0 1 7 7h2", "M15 7h2a5 5 0 1 1 0 10h-2", "M8 12h8"],
  unlink:   ["M18.84 12.25l1.72-1.71a5 5 0 0 0-7.08-7.07l-1.71 1.71", "M5.17 11.75l-1.71 1.71a5 5 0 0 0 7.07 7.07l1.71-1.71", "M8 2v4", "M2 8h4", "M16 18v4", "M18 16h4"],
};
