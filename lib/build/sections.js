// The planner's section ids, in one place.
//
// Both the server page (validating ?s=) and the client shell (rendering the
// nav) need this list. It cannot live in BuildClient.jsx: that module is
// "use client", and a server component importing a plain value from a client
// module gets a client reference, not the array.

export const SECTION_IDS = [
  "overview",
  "inspiration",
  "rooms",
  "materials",
  "wants",
  "references",
  "palette",
  "selections",
  "decisions",
  "decisionlog",
  "quotes",
  "team",
  "brief",
  "costs",
  "schedule",
  "trips",
  "changeorders",
  "payments",
  "milestones",
  "inspections",
  "punchlist",
  "photos",
  "documents",
  "asbuilt",
  "energy",
];

export function isSectionId(value) {
  return typeof value === "string" && SECTION_IDS.includes(value);
}
