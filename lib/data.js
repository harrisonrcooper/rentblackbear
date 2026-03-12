// ═══════════════════════════════════════════════════════════════════
// lib/data.js — Single source of truth for the entire site.
// Edit this file to update properties, rooms, pricing, colors, etc.
// Both the public site and admin dashboard read from this file.
// ═══════════════════════════════════════════════════════════════════

// ─── Site Settings ──────────────────────────────────────────────────
export const SETTINGS = {
  companyName: "Black Bear Rentals",
  legalName: "Oak & Main Development LLC",
  phone: "(256) 555-0192",
  email: "info@rentblackbear.com",
  city: "Huntsville, Alabama",
  tagline: "Huntsville's Turnkey Co-Living Experience",
  heroHeadline: "Your Room Is Ready.",
  heroSubline: "Everything's Included.",
  heroDesc: "Rent by the bedroom in fully furnished homes. WiFi, cleaning, parking, and utilities — all handled. Just move in.",
};

// ─── Theme Colors ───────────────────────────────────────────────────
export const THEME = {
  bg: "#1a1714",
  card: "#2c2520",
  accent: "#d4a853",
  text: "#f5f0e8",
  muted: "#c4a882",
  surface: "#fefdfb",
  surfaceAlt: "#f5f0e8",
  green: "#4a7c59",
  dark: "#1a1714",
  warm: "#5c4a3a",
};

// ─── Properties & Rooms ─────────────────────────────────────────────
// Each property has rooms with individual pricing.
// Status options: "occupied", "vacant"
// Utilities options: "allIncluded", "first100"
export const PROPERTIES = [
  {
    id: "p1",
    name: "The Holmes House",
    address: "Corner of Holmes & Lee, Huntsville, AL",
    type: "Single Family Home",
    typeTag: "SFH",
    totalBaths: 3,
    sqft: 2400,
    status: "Available",
    utilities: "first100",
    utilityCap: 100,
    cleaningFreq: "Weekly",
    description: "A spacious 5-bedroom single family home in our flagship mixed-use neighborhood, The Corner at Holmes & Lee. Walking distance to local coffee shops, salons, and neighborhood amenities. Perfect for young professionals or traveling contractors who want community and convenience.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c0?w=800&q=80",
    ],
    rooms: [
      {
        id: "r1", name: "Primary Suite", rent: 850, sqft: 280, privateBath: true,
        features: ["Walk-in closet", "En-suite bathroom", "Natural light"],
        status: "occupied",
        tenant: { name: "Marcus Johnson", leaseStart: "2025-08-01", leaseEnd: "2026-07-31", email: "marcus@email.com", phone: "(256) 555-1001" },
      },
      {
        id: "r2", name: "Bedroom 2", rent: 750, sqft: 220, privateBath: true,
        features: ["Private bathroom", "Closet organizer"],
        status: "occupied",
        tenant: { name: "Sarah Chen", leaseStart: "2025-09-01", leaseEnd: "2026-08-31", email: "sarah@email.com", phone: "(256) 555-1002" },
      },
      {
        id: "r3", name: "Bedroom 3", rent: 650, sqft: 180, privateBath: false,
        features: ["Shared hall bath", "Street view"],
        status: "occupied",
        tenant: { name: "David Park", leaseStart: "2025-10-01", leaseEnd: "2026-03-31", email: "david@email.com", phone: "(256) 555-1003" },
      },
      {
        id: "r4", name: "Bedroom 4", rent: 650, sqft: 175, privateBath: false,
        features: ["Shared hall bath", "Backyard view"],
        status: "vacant",
        tenant: null,
      },
      {
        id: "r5", name: "Bedroom 5", rent: 600, sqft: 160, privateBath: false,
        features: ["Shared hall bath", "Cozy layout"],
        status: "occupied",
        tenant: { name: "Amy Rodriguez", leaseStart: "2025-11-01", leaseEnd: "2026-10-31", email: "amy@email.com", phone: "(256) 555-1005" },
      },
    ],
  },
  {
    id: "p2",
    name: "Lee Drive East",
    address: "Lee Drive, Huntsville, AL",
    type: "Townhome",
    typeTag: "Townhome",
    totalBaths: 2,
    sqft: 1200,
    status: "Available",
    utilities: "allIncluded",
    utilityCap: 0,
    cleaningFreq: "Biweekly",
    description: "Brand-new construction townhome on Lee Drive. Modern finishes throughout with an open floor plan and full kitchen. Part of a duplex build with clean lines and energy-efficient systems.",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    ],
    rooms: [
      {
        id: "r6", name: "Primary Suite", rent: 750, sqft: 200, privateBath: true,
        features: ["En-suite bathroom", "New construction"],
        status: "occupied",
        tenant: { name: "James Williams", leaseStart: "2025-07-01", leaseEnd: "2026-06-30", email: "james@email.com", phone: "(256) 555-2001" },
      },
      {
        id: "r7", name: "Bedroom 2", rent: 650, sqft: 170, privateBath: false,
        features: ["Shared hall bath", "Good closet space"],
        status: "occupied",
        tenant: { name: "Lisa Thompson", leaseStart: "2025-08-01", leaseEnd: "2026-07-31", email: "lisa@email.com", phone: "(256) 555-2002" },
      },
      {
        id: "r8", name: "Bedroom 3", rent: 600, sqft: 155, privateBath: false,
        features: ["Shared hall bath", "USB outlets"],
        status: "vacant",
        tenant: null,
      },
    ],
  },
  {
    id: "p3",
    name: "Lee Drive West",
    address: "Lee Drive, Huntsville, AL",
    type: "Townhome",
    typeTag: "Townhome",
    totalBaths: 2,
    sqft: 1200,
    status: "Coming Soon",
    utilities: "allIncluded",
    utilityCap: 0,
    cleaningFreq: "Biweekly",
    description: "The mirror unit to Lee Drive East with the same premium finishes and thoughtful layout. Currently in final stages of completion. Reserve a room now for priority move-in.",
    images: [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    ],
    rooms: [
      {
        id: "r9", name: "Primary Suite", rent: 750, sqft: 200, privateBath: true,
        features: ["En-suite bathroom", "New construction"],
        status: "occupied",
        tenant: { name: "Kevin Brown", leaseStart: "2026-01-01", leaseEnd: "2026-12-31", email: "kevin@email.com", phone: "(256) 555-3001" },
      },
      {
        id: "r10", name: "Bedroom 2", rent: 650, sqft: 170, privateBath: false,
        features: ["Shared hall bath", "Good closet space"],
        status: "occupied",
        tenant: { name: "Michelle Davis", leaseStart: "2026-01-01", leaseEnd: "2026-12-31", email: "michelle@email.com", phone: "(256) 555-3002" },
      },
      {
        id: "r11", name: "Bedroom 3", rent: 600, sqft: 155, privateBath: false,
        features: ["Shared hall bath", "USB outlets"],
        status: "occupied",
        tenant: { name: "Carlos Gutierrez", leaseStart: "2026-02-01", leaseEnd: "2027-01-31", email: "carlos@email.com", phone: "(256) 555-3003" },
      },
    ],
  },
];

// ─── Amenities (shown on public site) ───────────────────────────────
export const AMENITIES = [
  { icon: "📶", title: "High-Speed WiFi", desc: "Reliable internet in every property — remote work ready." },
  { icon: "🛋️", title: "Fully Furnished", desc: "Quality furniture, linens, kitchenware, and appliances. Just bring your bags." },
  { icon: "🧹", title: "Common Area Cleaning", desc: "Professional cleaning of kitchen, living room, and all shared bathrooms. Weekly for 5-bed, biweekly for 3-bed homes." },
  { icon: "🅿️", title: "Off-Street Parking", desc: "Dedicated parking at every property. No street hunting." },
  { icon: "💡", title: "Utilities Covered", desc: "All utilities included on select properties. Others include the first $100, with overage split equally." },
  { icon: "🔑", title: "Rent by the Room", desc: "Pick the bedroom and price point that fits your budget. Private bath rooms available." },
];

// ─── Screening Questions ────────────────────────────────────────────
export const SCREEN_QUESTIONS = [
  { id: "smoke", q: "Are you a non-smoker? We have a strict no-smoking policy on all properties (including vapes).", pass: "Yes" },
  { id: "drugs", q: "Do you agree to our zero-tolerance drug policy?", pass: "Yes" },
  { id: "pets", q: "Are you comfortable with our no-pets policy?", pass: "Yes" },
  { id: "bg", q: "Can you pass a background check with no criminal record?", pass: "Yes" },
  { id: "credit", q: "Is your credit score 650 or above?", pass: "Yes" },
  { id: "income", q: "Is your gross monthly income at least 3x your expected rent?", pass: "Yes" },
  { id: "refs", q: "Can you provide professional references and verifiable landlord history for the past 2 years?", pass: "Yes" },
];

// ─── AI Chat System Prompt ──────────────────────────────────────────
export const CHAT_CONTEXT = `You are the AI assistant for Black Bear Rentals, a furnished co-living rental company in Huntsville, Alabama.

KEY MODEL: We rent BY THE BEDROOM. Each bedroom has its own price. Tenants share common areas with housemates. Property types include SFH and Townhomes.

ALWAYS INCLUDED: Fully furnished, high-speed WiFi, professional cleaning of all common areas (kitchen, living room, shared bathrooms), off-street parking.

UTILITIES: Some properties include ALL utilities. Others include first $100/month, with overage split equally among roommates.

CLEANING: 3-bed = biweekly. 5-bed = weekly. Shared bathrooms are common areas and get cleaned on the same schedule.

BATHROOMS: Some rooms have private en-suite baths (priced higher). Others share hall bathrooms (cleaned by our service).

POLICIES: Strict no-smoking (including vapes), zero-tolerance drug policy, no pets. Background check and credit check required (650+ score). Income must be 3x rent. 2 years verifiable rental history and professional references required. $300 holding deposit due with application (refundable if denied or cancelled within 48 hours). All occupants 18+ must apply.

PROPERTIES:
1. The Holmes House (SFH, 5bd/3ba) — First $100 utilities, weekly cleaning
   Primary Suite $850 (private bath), Bed 2 $750 (private bath), Bed 3 $650, Bed 4 $650, Bed 5 $600 (shared baths)
2. Lee Drive East (Townhome, 3bd/2ba) — All utilities included, biweekly cleaning
   Primary Suite $750 (private bath), Bed 2 $650, Bed 3 $600 (shared baths)
3. Lee Drive West (Townhome, 3bd/2ba) — All utilities included, biweekly cleaning — COMING SOON
   Same layout and pricing as Lee Drive East.

Be friendly, concise, and helpful. Explain the per-bedroom model clearly if asked. If unsure about specific lease terms, suggest contacting us directly.`;
