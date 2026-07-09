// Persistence for the home-build planner.
//
// The build planner is its own thing — a standalone page with its own
// nav — so it lives in its own `app_data` row (`build:<workspaceId>`),
// fully separate from the budget blob. Same JSONB-blob pattern as the
// budget writer; it reuses that module's Supabase helpers.
//
// The seed below is pre-loaded with the owner's real wishlist, rooms,
// finish selections and China-sourcing vendor list (from the
// "DREAMING HOME BUILD" workbook) so the planner opens fully populated.

import { loadVersioned, saveCas } from "@/lib/app-data";
import type { CasResult, Versioned } from "@/lib/app-data";

/**
 * Soft-delete marker, on every row the UI can delete.
 *
 * Deletes are archived rather than dropped: tasks, comments, tags and links
 * will reference these rows by id, and a hard delete would silently orphan
 * them. Archived rows are filtered out of every section but remain in the
 * blob, so a delete is always recoverable.
 */
export interface Archivable {
  archived?: boolean;
}

export interface BuildMustHave {
  id: string;
  text: string;
  done: boolean;
}
export interface BuildRoom extends Archivable {
  id: string;
  name: string;
  level: string;       // Main / Upstairs / Basement …
  size: string;        // free text, e.g. "16 × 16"
  must_haves: string;  // the architect-facing requirements, as originally written
  /**
   * The checkable form of `must_haves`. Absent until the first tick, at which
   * point it becomes authoritative — see lib/build/rooms.ts. `must_haves` is
   * never rewritten, so the original text survives whatever happens here.
   */
  must_have_items?: BuildMustHave[];
  lighting: string;    // lighting & electrical plan notes
  details: string;     // any other notes for the room
}
export interface BuildCostLine extends Archivable {
  id: string;
  label: string;
  group: string;
  estimate_cents: number;
  actual_cents: number;
  in_basis: boolean;   // counts toward the home's tax cost basis
}
export interface BuildWish extends Archivable {
  id: string;
  label: string;
  priority: "need" | "want" | "dream";
  done: boolean;
}
export interface BuildMilestone extends Archivable {
  id: string;
  label: string;
  target: string | null; // ISO YYYY-MM-DD
  done: boolean;
}
export interface BuildSelection extends Archivable {
  id: string;
  label: string;
  choice: string;
  /** Free-text spec notes — the requirements behind the choice. */
  notes?: string;
  status: "open" | "decided" | "ordered";
  vendor: string;
  allowance_cents: number;   // budgeted allowance
  actual_cents: number;      // the chosen item's price
  lead_time: string;         // free text, e.g. "8 weeks"
  deadline: string | null;   // ISO YYYY-MM-DD — decide-by date
}
export interface BuildTeamMember extends Archivable {
  id: string;
  role: string;
  name: string;
  contact: string;
  /** Advice threads, quotes, anything said about this vendor. */
  notes?: string;
}
export interface BuildBoardItem extends Archivable {
  id: string;
  kind: "image" | "link";
  url: string;   // a Supabase Storage image URL, or any pasted link
  note: string;
}
export interface BuildBoard extends Archivable {
  id: string;
  name: string;
  pinterest_url: string;       // a public Pinterest board URL — embedded live
  items: BuildBoardItem[];     // uploaded images + pasted links
}
export interface BuildReference extends Archivable {
  id: string;
  url: string;
  title: string;
  tag: string;   // free-text category (House plans, Products, Videos…)
  note: string;
}
export interface BuildSwatch extends Archivable {
  id: string;
  name: string;
  color: string;     // hex
  material: string;  // White oak, Quartzite, Paint…
  note: string;      // where it's used
}

export interface BuildDraw extends Archivable {
  id: string;
  label: string;
  date: string | null;
  amount_cents: number;
}
export interface BuildLoan {
  amount_cents: number;
  rate_bps: number;   // construction-loan rate, basis points
}
export interface BuildDocument extends Archivable {
  id: string;
  name: string;
  category: string;
  url: string;        // link to where the doc lives (Drive, Dropbox, portal…)
}
export interface BuildPhoto extends Archivable {
  id: string;
  url: string;        // Supabase Storage image URL
  caption: string;
  date: string | null; // ISO YYYY-MM-DD the photo was taken
  phase: string;       // construction phase
}
export interface BuildChangeOrder extends Archivable {
  id: string;
  date: string | null;
  description: string;       // what changed
  reason: string;            // why
  amount_cents: number;      // positive magnitude
  kind: "add" | "credit";    // adds cost vs. returns money
  status: "pending" | "approved" | "rejected";
}
export interface BuildPayment extends Archivable {
  id: string;
  date: string | null;
  vendor: string;
  description: string;
  amount_cents: number;
  method: string;            // Check / ACH / Wire / Card / Cash / Loan draw
  lien_waiver: "not_needed" | "pending" | "received";
}
export interface BuildInspection extends Archivable {
  id: string;
  name: string;
  date: string | null;
  status: "not_scheduled" | "scheduled" | "passed" | "failed";
  inspector: string;
  notes: string;
}
export interface BuildPunchItem extends Archivable {
  id: string;
  room: string;
  description: string;
  trade: string;       // who fixes it
  done: boolean;
}
export interface BuildRfi extends Archivable {
  id: string;
  question: string;
  asked_of: string;    // Architect / Builder / Engineer…
  answer: string;
  status: "open" | "answered";
  date: string | null;
}
export interface BuildAsBuilt extends Archivable {
  id: string;
  label: string;
  value: string;
}
export interface BuildWarranty extends Archivable {
  id: string;
  item: string;
  provider: string;
  expires: string | null;
  url: string;
}
export interface BuildEnergyMetric extends Archivable {
  id: string;
  label: string;
  value: string;       // measured / commissioned result
  target: string;      // the goal
}

export interface BuildState {
  project_name: string;
  style: string;   // architectural style / vibe
  lot: string;     // lot / location notes
  budget_cents: number;
  sqft: number;
  stories: number;
  notes: string;   // overall vision / must-knows for the architect
  rooms: BuildRoom[];
  wishlist: BuildWish[];
  costs: BuildCostLine[];
  milestones: BuildMilestone[];
  selections: BuildSelection[];
  team: BuildTeamMember[];
  boards: BuildBoard[];
  references: BuildReference[];
  palette: BuildSwatch[];
  loan: BuildLoan;
  draws: BuildDraw[];
  documents: BuildDocument[];
  photos: BuildPhoto[];
  change_orders: BuildChangeOrder[];
  payments: BuildPayment[];
  inspections: BuildInspection[];
  punch_list: BuildPunchItem[];
  rfis: BuildRfi[];
  as_built: BuildAsBuilt[];
  warranties: BuildWarranty[];
  energy: BuildEnergyMetric[];
  schema_version: number;
  last_modified_at: string | null;
}

export const BUILD_SCHEMA_VERSION = 1;

export function buildKey(workspaceId: string): string {
  return `build:${workspaceId}`;
}

const SEED_VISION =
  "Modern French Country / Transitional Château — French Normandy, Provincial and " +
  "Châteauesque influence. Big priorities: a true butler's pantry, a two-story closet, " +
  "a see-through fireplace splitting the master sitting area, an art/inspiration studio, " +
  "a carriage apartment, and a walkout basement with gym, sauna and cold plunge. " +
  "12 ft ceilings, 8 ft interior doors, arches throughout. Whole-house smart (Savant) + " +
  "generator, air-sealed (AeroBarrier), Zehnder HVAC designed by Positive Energy. Windows, " +
  "doors, cabinets and lighting are being sourced from China — see Team & Vendors.";

const ROOM_SEED: Array<[string, string, string]> = [
  ["Kitchen", "Main", "No sink in the island · butler's pantry · 2 dishwashers · microwave in island or pantry · coffee & tea bar · glass rinser in sink · water-bottle dispenser"],
  ["Butler's pantry", "Main", "Microwave, prep counter, deep storage"],
  ["Living room", "Main", "Open to kitchen · decorative tadelakt-plaster fireplace"],
  ["Master bedroom", "Main", "12 ft ceilings · 8 ft doors · sitting area split from the bed by a see-through fireplace · balcony access"],
  ["Master closet", "Main", "Two-story closet"],
  ["Master bathroom", "Main", "Quartzite slab shower surround · wall-mount faucet · solid-stone freestanding tub · ceiling heater · ceiling water mister · floating vanity w/ undermount motion lighting"],
  ["Half bath", "Main", ""],
  ["Studio", "Upstairs", "Art & inspiration studio · ~14×30 · vaulted ceilings · backyard view · bird's-nest deck · interior loft windows · lots of natural light & cabinets · utility sink"],
  ["Gym", "Basement", "Sauna · cold plunge"],
  ["Basement", "Basement", "Walkout basement"],
  ["Mechanical room", "Basement", "HVAC + hot-water tank · whole-house dehumidifier"],
  ["Garage", "Main", "Side entry · wall-mounted door opener · hot & cold lines for a wall-mounted pressure washer"],
  ["Carriage apartment", "Above garage", "3 bed / 2 bath minimum · no office · sliding-glass / accordion doors out to the pool"],
  ["Stairs", "—", "Floating staircase · motion-sensor light per step · custom wire/glass railing"],
];

const WISH_SEED: Array<[string, "need" | "want" | "dream"]> = [
  ["Butler's pantry", "need"], ["Two-story closet", "need"], ["Art / inspiration studio", "need"],
  ["Carriage apartment (3 bed / 2 bath)", "need"], ["Walkout basement", "need"], ["Side-entry garage", "need"],
  ["Home gym", "need"],
  ["See-through master fireplace", "want"], ["Floating staircase w/ step lighting", "want"],
  ["12 ft ceilings", "want"], ["8 ft interior doors", "want"], ["Arches / archways throughout", "want"],
  ["Whole-house smart home (Savant)", "want"], ["Whole-house generator", "want"],
  ["Smart-glass front door (camera-triggered)", "want"], ["Smart-glass privacy windows", "want"],
  ["Speakers throughout & outside", "want"], ["Coffee & tea bar", "want"], ["Outside shower", "want"],
  ["Permanent Christmas lights", "want"], ["Electric pergola w/ outdoor blinds", "want"],
  ["Swimming pool", "dream"], ["Sauna", "dream"], ["Cold plunge", "dream"],
  ["Water-vapor fireplace", "dream"], ["Live-edge walnut furniture", "dream"],
];

const COST_SEED: Array<[string, string]> = [
  ["Land / lot", "Land & site"], ["Site prep & clearing", "Land & site"],
  ["Survey & soil test", "Land & site"], ["Excavation & grading", "Land & site"],
  ["Utility connections", "Land & site"], ["Driveway", "Land & site"],
  ["Foundation", "Structure"], ["Framing & lumber", "Structure"],
  ["Roof & trusses", "Structure"], ["Windows & exterior doors", "Structure"],
  ["Siding / stone / cladding", "Exterior"], ["Porches, decks & pergola", "Exterior"],
  ["Garage", "Exterior"], ["Pool", "Exterior"],
  ["HVAC (Zehnder)", "Mechanical"], ["Plumbing", "Mechanical"],
  ["Electrical & smart home", "Mechanical"], ["Insulation & air sealing", "Mechanical"],
  ["Drywall", "Interior"], ["Interior trim, doors & arches", "Interior"],
  ["Interior paint & plaster", "Interior"], ["Stairs & railing", "Interior"],
  ["Flooring", "Finishes"], ["Cabinets & countertops", "Finishes"],
  ["Tile & stone", "Finishes"], ["Lighting", "Finishes"], ["Appliances", "Finishes"],
  ["Sauna & cold plunge", "Finishes"],
  ["Architect & house plans", "Soft costs"], ["Structural engineering", "Soft costs"],
  ["Permits & impact fees", "Soft costs"], ["Construction loan interest & fees", "Soft costs"],
  ["Builder / GC fee", "Soft costs"], ["China sourcing & freight", "Soft costs"],
  ["Landscaping & turf", "Landscaping & extras"],
  ["Contingency reserve", "Reserve"], ["Furniture & move-in", "Reserve"],
];

const MILESTONE_SEED: string[] = [
  "Finalize budget & financing", "Secure the lot", "Lock the house plans", "Hire builder / GC",
  "Engineering & permits", "Construction loan closes", "China sourcing trip & orders placed",
  "Groundbreaking & site prep", "Foundation poured", "Framing complete", "Roof dried-in",
  "Rough-ins (HVAC / plumbing / electrical)", "Air sealing & insulation", "Drywall & plaster",
  "Interior trim & arches", "Cabinets & countertops", "Flooring & tile", "Fixtures & appliances",
  "Landscaping & pool", "Final inspection & certificate of occupancy", "Permanent loan / closing", "Move in",
];

// His finish selections — pre-filled with the picks already in the workbook.
const SELECTION_SEED: Array<[string, string]> = [
  ["Architectural style", "Modern French Country / Transitional Château"],
  ["HVAC system", "Zehnder + ComfoWell + Santa Fe whole-house dehumidifier (design: Positive Energy)"],
  ["Air sealing", "AeroBarrier"],
  ["Electrical panel", "SPAN smart panel"],
  ["Smart home", "Savant whole-house"],
  ["Network", "PoE Ubiquiti wifi · hardwired smart door keypad"],
  ["Flooring", "White oak (Rainforest)"],
  ["Interior doors", "White oak, 8 ft (Tryba Home)"],
  ["Front door & windows", "Iron (RP technik) · smart glass on the front door"],
  ["Cabinets", "Plywood carcass, white-oak veneer doors, Blum hardware (Sjumbo)"],
  ["Countertops & fireplace slabs", "Sjumbo"],
  ["Cabinet & door hardware", "Gunmetal handles/pulls (Filta)"],
  ["Fireplaces", "Aquafire water-vapor · tadelakt plaster / faux-stone surround"],
  ["Shower surround", "Quartzite slab"],
  ["Freestanding tub", "Solid stone"],
  ["Wall paneling", "White oak / walnut tongue-and-groove (MUMU)"],
  ["Garage doors", "Anlike"],
  ["Lighting", "Alabaster + Momo · designer: lightcanhelpyou.com"],
  ["Decking / fencing / soffit / cladding", "WPC (coowin)"],
  ["Stairs & railing", "Custom wire/glass (ACE Architectural Designs)"],
  ["Exterior waterproofing", "Peel-and-stick + Aluma Flash (Polyguard)"],
  ["Framing", "2×8 bottom plate, staggered 2×4 studs, plywood sheathing, blocking everywhere"],
];

// Builder / architect / lender rows are blank to fill in; the China
// sourcing vendors come pre-loaded from the workbook.
const TEAM_SEED: Array<[string, string, string]> = [
  ["Builder / GC", "", ""],
  ["Architect / designer", "", ""],
  ["Construction lender", "", ""],
  ["Structural engineer", "", ""],
  ["HVAC design", "Positive Energy", "positiveenergy.pro"],
  ["Cabinets, closets & countertops", "Sjumbo — Kasin", "+86 191 292 64057"],
  ["Interior doors", "Tryba Home — Sukie", "+86 181 5108 3705"],
  ["Iron doors & windows", "RP technik — Florian", "+86 186 1602 9787"],
  ["Garage doors", "Anlike — Anna", "+86 180 2937 6759"],
  ["WPC decking / fencing / soffit", "coowin — Amanda", "+86 176 6966 7151"],
  ["Alabaster lighting", "Alabaster — Happy", "WeChat: wxid_g9kngn918rci21"],
  ["Lighting", "Momo Lighting — Monet", "+86 135 2818 6297"],
  ["White oak flooring", "Rainforest — Lia", "+1 213 245 4713"],
  ["Handles & pulls", "Filta — Clara", "+86 189 5873 9310"],
  ["Live-edge walnut furniture", "Woodyoulike — Carol", "+86 189 2379 8394"],
  ["Wall paneling", "MUMU Woodworking — Rachel", "+86 139 2557 3913"],
  ["Outdoor blinds & pergolas", "Chembo — Jawan", "+86 132 296 3006"],
  ["Custom stairs & railing", "ACE Architectural Designs — Lily", "+86 137 9456 0622"],
];

// Links from the DREAMING HOME BUILD workbook: [url, title, tag, note].
const REFERENCE_SEED: Array<[string, string, string, string]> = [
  ["https://www.advancedhouseplans.com/plan/fort-worth", "Fort Worth plan", "House plans", "Exactly what we need for the corner lot"],
  ["https://www.architecturaldesigns.com/house-plans/6-bed-transitional-french-country-house-plan-with-2-bed-apartment-4954-sq-ft-270109af", "6-bed transitional French country w/ 2-bed apartment", "House plans", ""],
  ["https://www.architecturaldesigns.com/house-plans/transitional-tudor-house-plan-with-4-car-garage-4158-sq-ft-135250gra", "Transitional Tudor, 4-car garage", "House plans", ""],
  ["https://www.architecturaldesigns.com/house-plans/5-bedroom-transitional-house-plan-with-media-room-and-bonus-room-6413-sq-ft-510255wdy", "5-bed transitional w/ media + bonus room", "House plans", ""],
  ["https://www.architecturaldesigns.com/house-plans/transitional-house-plan-with-two-story-great-room-and-lower-level-with-home-theater-703005tyl", "Transitional w/ 2-story great room + theater", "House plans", "Smaller plan"],
  ["https://www.architecturaldesigns.com/house-plans/spacious-transitional-home-plan-with-home-office-290114iy", "Spacious transitional w/ home office", "House plans", "Smaller plan"],
  ["https://www.thehousedesigners.com/plan/2-story-modern-farmhouse-4592-square-feet-luxury-8064/", "2-story modern farmhouse — 4,592 sq ft", "House plans", ""],
  ["https://www.thehousedesigners.com/plan/2-story-modern-farmhouse-3778-square-feet-3-beds-optional-walkout-10619/", "2-story modern farmhouse — 3,778 sq ft, optional walkout", "House plans", ""],
  ["https://www.architecturaldesigns.com/house-plans/3-car-carriage-house-plan-with-2-bedroom-upstairs-apartment-62911dj", "3-car carriage house w/ 2-bed apartment", "House plans", "Carriage apartment"],
  ["https://archivaldesigns.com/products/22253", "Archival Designs plan 22253", "House plans", ""],
  ["https://onekindesign.com/lake-minnetonka-house-relaxing-getaways/", "Lake Minnetonka house", "Inspiration", ""],
  ["https://momsdesignbuild.com/portfolio/orono-overlook/", "Orono Overlook — Moms Design Build", "Inspiration", ""],
  ["https://hansendesignfirm.com/picture-gallery/room-with-a-view/", "Room with a view — Hansen Design", "Inspiration", ""],
  ["https://www.mustardseedhaven.com/services", "Mustard Seed Haven", "Inspiration", ""],
  ["https://pin.it/7I3cG2eXx", "Pinterest pin", "Inspiration", ""],
  ["https://www.youtube.com/watch?v=dZRIgBXtZqM", "Nice design walkthrough", "Videos", ""],
  ["https://www.youtube.com/watch?v=WuYvDuOQ-5M", "HVAC — watch this", "Videos", ""],
  ["https://www.youtube.com/watch?v=xvxTFGvvvuc", "Exterior waterproofing", "Videos", ""],
  ["https://www.youtube.com/watch?v=wY827QUPC5k", "Smart door lock reference", "Videos", ""],
  ["https://www.youtube.com/watch?v=5XBejXntHBI", "Smart home reference", "Videos", ""],
  ["https://www.facebook.com/charlie.hartwig.9/videos/4068352953310852/", "Charlie Hartwig — build video", "Videos", ""],
  ["https://www.lilyanncabinets.com/oak-closets.html", "Lily Ann oak closets", "Products", "Two-story closet"],
  ["https://www.archwaysandceilings.com/", "Archways & Ceilings", "Products", "Arches"],
  ["https://www.archwaysandceilings.com/products/igloo-ceilings", "Igloo (barrel) ceilings", "Products", ""],
  ["https://www.aquafire.com/products/aquafire-pro", "Aquafire Pro — water-vapor fireplace", "Products", ""],
  ["https://www.alibaba.com/product-detail/Solid-White-Marble-Tubs-Luxury-Bali_1600322323220.html", "Solid marble freestanding tub", "Products", ""],
  ["https://flushtek.com/pages/recommended-products", "Flushtek — flush baseboard outlets", "Products", ""],
  ["https://www.amazon.com/dp/B0CC7X8XFD", "Ubiquiti PoE wifi access point", "Products", ""],
  ["https://positiveenergy.pro/what-we-do", "Positive Energy — HVAC design", "Systems", ""],
  ["https://zehnderamerica.com/products/", "Zehnder America — HVAC", "Systems", ""],
  ["https://aeroseal.com/aerobarrier-how/", "AeroBarrier — air sealing", "Systems", ""],
  ["https://polyguard.com/product/polyguard-uv40", "Polyguard UV40 — exterior waterproofing", "Systems", ""],
  ["https://www.reddit.com/r/homeautomation/comments/sec0cr/hardwired_smart_door_lock/", "Hardwired smart door lock — Reddit", "Systems", ""],
  ["https://lightcanhelpyou.com", "Light Can Help You — lighting designer", "Systems", ""],
];

// Common new-construction documents — seeded as empty rows so the
// vault opens with a checklist; each holds a link to where it lives.
const DOC_SEED: Array<[string, string]> = [
  ["Recorded plat / survey", "Survey & site"],
  ["Soil / perc test", "Survey & site"],
  ["Architectural plans", "Plans & drawings"],
  ["Engineered foundation plan", "Plans & drawings"],
  ["Building permit", "Permits & approvals"],
  ["Septic / well permit", "Permits & approvals"],
  ["Construction contract", "Contracts & bids"],
  ["Builder's risk insurance", "Insurance & warranty"],
  ["Construction loan agreement", "Financing"],
  ["Builder warranty", "Insurance & warranty"],
];

// [name, hex, material, where it's used] — from the workbook's finishes.
const PALETTE_SEED: Array<[string, string, string, string]> = [
  ["White oak", "#c9a876", "Wood", "Flooring, interior doors, cabinet fronts"],
  ["Walnut", "#5c4033", "Wood", "Live-edge furniture, accent paneling"],
  ["Quartzite", "#e8e6e1", "Stone", "Counters, shower surround, fireplace slab"],
  ["Gunmetal", "#3a3f44", "Metal", "Cabinet & door hardware"],
  ["Iron black", "#1c1c1c", "Metal", "Doors & windows"],
  ["Tadelakt plaster", "#d8cdbd", "Plaster", "Fireplace surrounds"],
  ["White marble", "#f0eee9", "Stone", "Freestanding tub"],
  ["Trim & interior white", "#f4f1ea", "Paint", "Trim, doors, ceilings"],
  ["Exterior color", "#9a958b", "Paint", "TBD — exterior body"],
  ["Cabinet color", "#e3dfd5", "Paint", "TBD — kitchen cabinets"],
];

// Standard municipal inspection sequence for a new single-family build.
const INSPECTION_SEED: string[] = [
  "Footing / foundation", "Under-slab plumbing", "Framing", "Electrical rough-in",
  "Plumbing rough-in", "Mechanical / HVAC rough-in", "Insulation", "Drywall / lath",
  "Final electrical", "Final plumbing", "Final mechanical", "Final building / C.O.",
];

// As-built reference — the details you'll wish you wrote down.
const ASBUILT_SEED: string[] = [
  "Exterior body paint", "Exterior trim paint", "Interior trim & door paint",
  "Kitchen cabinet color", "Master bedroom paint", "HVAC filter size(s)",
  "Water main shut-off location", "Gas shut-off location", "Main electrical panel location",
  "Well / water source location", "Septic tank & drain-field location", "Irrigation controller location",
];

const WARRANTY_SEED: string[] = [
  "Builder workmanship warranty", "Roof", "HVAC & ERV system", "Appliances",
  "Windows & exterior doors", "Water heater", "Foundation / structural",
];

// Energy & commissioning targets — geared to the AeroBarrier / Zehnder build.
const ENERGY_SEED: Array<[string, string]> = [
  ["HERS index", "<= 50"],
  ["Blower-door air tightness (ACH50)", "<= 1.0"],
  ["AeroBarrier final result (ACH50)", ""],
  ["Duct leakage", "<= 4%"],
  ["Zehnder ERV commissioned airflow", ""],
  ["Whole-house dehumidifier setpoint", "50% RH"],
  ["Wall assembly R-value", ""],
  ["Roof / attic R-value", ""],
  ["Window U-factor / SHGC", ""],
  ["Manual J heating / cooling load", ""],
  ["Generator capacity", ""],
];

export function emptyBuildState(): BuildState {
  return {
    project_name: "Our Dream Home",
    style: "Modern French Country / Transitional Château — French Normandy, Provincial & Châteauesque influence",
    lot: "Corner lot · walkout basement · side-entry garage",
    budget_cents: 0,
    sqft: 0,
    stories: 2,
    notes: SEED_VISION,
    rooms: ROOM_SEED.map(([name, level, must_haves], i) => ({
      id: `r${i}`, name, level, size: "", must_haves, lighting: "", details: "",
    })),
    wishlist: WISH_SEED.map(([label, priority], i) => ({
      id: `w${i}`, label, priority, done: false,
    })),
    costs: COST_SEED.map(([label, group], i) => ({
      id: `c${i}`, label, group, estimate_cents: 0, actual_cents: 0, in_basis: true,
    })),
    milestones: MILESTONE_SEED.map((label, i) => ({
      id: `m${i}`, label, target: null, done: false,
    })),
    selections: SELECTION_SEED.map(([label, choice], i) => ({
      id: `s${i}`, label, choice, status: "open" as const,
      vendor: "", allowance_cents: 0, actual_cents: 0, lead_time: "", deadline: null,
    })),
    team: TEAM_SEED.map(([role, name, contact], i) => ({
      id: `t${i}`, role, name, contact,
    })),
    boards: ["Exterior & style", "Kitchen & pantry", "Master suite", "Studio", "Bathrooms", "Outdoor & pool", "Details & finishes"]
      .map((name, i) => ({ id: `b${i}`, name, pinterest_url: "", items: [] })),
    references: REFERENCE_SEED.map(([url, title, tag, note], i) => ({
      id: `ref${i}`, url, title, tag, note,
    })),
    palette: PALETTE_SEED.map(([name, color, material, note], i) => ({
      id: `sw${i}`, name, color, material, note,
    })),
    loan: { amount_cents: 0, rate_bps: 0 },
    draws: [],
    documents: DOC_SEED.map(([name, category], i) => ({
      id: `doc${i}`, name, category, url: "",
    })),
    photos: [],
    change_orders: [],
    payments: [],
    inspections: INSPECTION_SEED.map((name, i) => ({
      id: `insp${i}`, name, date: null, status: "not_scheduled" as const, inspector: "", notes: "",
    })),
    punch_list: [],
    rfis: [],
    as_built: ASBUILT_SEED.map((label, i) => ({ id: `ab${i}`, label, value: "" })),
    warranties: WARRANTY_SEED.map((item, i) => ({
      id: `wr${i}`, item, provider: "", expires: null, url: "",
    })),
    energy: ENERGY_SEED.map(([label, target], i) => ({
      id: `en${i}`, label, value: "", target,
    })),
    schema_version: BUILD_SCHEMA_VERSION,
    last_modified_at: null,
  };
}

export async function loadBuildState(workspaceId: string): Promise<Versioned<BuildState>> {
  const fallback = emptyBuildState();
  const { value, version } = await loadVersioned<BuildState>(buildKey(workspaceId), fallback);
  // Forward-compat: backfill any field a stored partial record lacks.
  return { value: { ...fallback, ...value, schema_version: BUILD_SCHEMA_VERSION }, version };
}

/**
 * Compare-and-swap write. `expectedVersion` is the version the caller last
 * read; if the stored blob has moved past it the write is refused and the
 * current server state comes back to be merged (see lib/build/merge.ts).
 * Nothing is ever blindly overwritten.
 */
export async function saveBuildState(
  workspaceId: string,
  state: BuildState,
  expectedVersion: number,
): Promise<CasResult<BuildState>> {
  return saveCas<BuildState>(
    buildKey(workspaceId),
    {
      ...state,
      schema_version: BUILD_SCHEMA_VERSION,
      last_modified_at: new Date().toISOString(),
    },
    expectedVersion,
    emptyBuildState(),
  );
}
